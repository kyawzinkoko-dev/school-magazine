<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_posts' => Post::count(),
                'total_views' => (int) Post::sum('views'),
                'total_users' => \App\Models\User::where('role', 'user')->count(),
                'total_comments' => \App\Models\Comment::count(),
            ],
            'recent_posts' => Post::with('category')->latest()->take(5)->get(),
        ]);
    }

    public function index()
    {
        return Inertia::render('Admin/News/Index', [
            'posts' => Post::with('category')->latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/News/Create', [
            'categories' => Category::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'content' => 'required|string',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('news_images', 'public');
        }

        $validated['slug'] = Str::slug($request->title) . '-' . rand(100, 999);
        $validated['user_id'] = auth()->id();

        Post::create($validated);

        return redirect()->route('admin.news.index')->with('message', 'News published!');
    }

    public function edit(Post $news) // Note: parameter name matches resource 'news'
    {
        return Inertia::render('Admin/News/Edit', [
            'post' => $news,
            'categories' => Category::all()
        ]);
    }

    public function update(Request $request, Post $news)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($news->image) {
                Storage::disk('public')->delete($news->image);
            }
            $validated['image'] = $request->file('image')->store('news_images', 'public');
        }

        $news->update($validated);

        return redirect()->route('admin.news.index')->with('message', 'Article updated!');
    }

    public function destroy(Post $news)
    {
        if ($news->image) {
            Storage::disk('public')->delete($news->image);
        }
        $news->delete();

        return back()->with('message', 'Article deleted.');
    }
}