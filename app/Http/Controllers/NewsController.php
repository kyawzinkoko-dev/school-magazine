<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsController extends Controller
{
    /**
     * Display the Magazine Home Page
     */
    public function index(Request $request)
    {
        // 1. Sanitize the category input from the request
        $categorySlug = $request->input('category');

        $posts = Post::query()
            ->with('category')
            ->when($request->search, function ($q, $search) {
                $q->where('title', 'like', "%{$search}%");
            })
            ->when($categorySlug, function ($q, $slug) {
                // We use whereHas to filter by the category's slug column
                $q->whereHas('category', function ($query) use ($slug) {
                    $query->where('slug', trim($slug));
                });
            })
            ->latest() // Ensures newly added news (highest ID/created_at) is first
            ->paginate(6)
            ->withQueryString();

        // Fetch all categories for the filter bar
        $categories = Category::select('id', 'name', 'slug')->get();

        return Inertia::render('Home', [
            'posts' => $posts,
            'categories' => $categories,
            'filters' => [
                'search' => $request->search ?? "",
                'category' => $categorySlug ?? ""
            ]
        ]);
    }
    
    public function show(Post $post)
    {
        $post->increment('views');
        $user = auth()->user();

        return Inertia::render('News/Show', [
            // withCount('likes') adds a 'likes_count' attribute to the post automatically
            'post' => $post->load(['category', 'user', 'comments.user'])->loadCount('likes'),

            'isLiked' => $user ? $post->likes()->where('user_id', $user->id)->exists() : false,
            'isSaved' => $user ? $user->savedPosts()->where('post_id', $post->id)->exists() : false,

            'related_posts' => Post::where('category_id', $post->category_id)
                ->where('id', '!=', $post->id)
                ->limit(3)
                ->get()
        ]);
    }

    /**
     * Filter News by Category
     */
    public function category(Category $category)
    {
        return Inertia::render('Home', [
            'posts' => Post::where('category_id', $category->id)
                ->with('category')
                ->latest()
                ->get(),
            'currentCategory' => $category->name
        ]);
    }
    public function like(Post $post)
    {
        $user = auth()->user();

        // Check if the user already liked this post
        $existingLike = $post->likes()->where('user_id', $user->id)->first();

        if ($existingLike) {
            // If it exists, remove it (Unlike)
            $existingLike->delete();
        } else {
            // If it doesn't exist, create it (Like)
            $post->likes()->create([
                'user_id' => $user->id
            ]);
        }

        // Return back to the same page without a full reload
        return back();
    }

    /**
     * Toggle Save (Bookmark) for a Post
     */
    public function save(Post $post)
    {
        $user = auth()->user();

        // Check if saved
        $isSaved = $user->savedPosts()->where('post_id', $post->id)->exists();

        if ($isSaved) {
            $user->savedPosts()->detach($post->id);
        } else {
            $user->savedPosts()->attach($post->id);
        }

        return back();
    }

    /**
     * Store a Comment
     */
    public function comment(Request $request, Post $post)
    {
        $request->validate([
            'body' => 'required|string|max:1000',
        ]);

        $post->comments()->create([
            'user_id' => auth()->id(),
            'body' => $request->body,
        ]);

        return back()->with('message', 'Comment added!');
    }

    public function savedArticles()
    {
        // Get the logged in user's saved posts with their categories
        $savedPosts = auth()->user()->savedPosts()
            ->with('category')
            ->latest()
            ->get();

        return Inertia::render('Profile/SavedArticles', [
            'posts' => $savedPosts
        ]);
    }
}