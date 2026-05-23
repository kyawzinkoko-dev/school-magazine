import { calculateReadTime } from "@/Components/helper";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import {
    Heart,
    Bookmark,
    MessageCircle,
    Send,
    Clock,
    Eye,
    ChevronRight,

} from "lucide-react";
// Import the distance helper from date-fns
import { formatDistanceToNow } from "date-fns";

// Add related_posts to the destructured props here!
export default function Show({ post, isLiked, isSaved, related_posts }) {
    const { auth } = usePage().props;

    const {
        data,
        setData,
        post: postComment,
        processing,
        reset,
    } = useForm({
        body: "",
    });

    const submitComment = (e) => {
        e.preventDefault();
        postComment(route("comments.store", post.id), {
            preserveScroll:true,
            onSuccess: () => reset("body"),
        });
    };
    return (
        <GuestLayout>
            <Head title={post.title} />

            <div className="max-w-4xl mx-auto">
                {/* --- ARTICLE HEADER --- */}
                <span className="text-blue-600 font-black uppercase text-xs tracking-widest">
                    {post.category.name}
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 mb-8 leading-tight">
                    {post.title}
                </h1>

                <img
                    src={
                        post.image_url ||
                        `https://picsum.photos/seed/${post.id}/1200/600`
                    }
                    className="w-full h-[450px] object-cover rounded-3xl mb-10 shadow-lg"
                    alt={post.title}
                />

                {/* --- INTERACTION BAR --- */}
                <div className="flex items-center justify-between py-6 border-y border-slate-100 mb-10">
                    <div className="flex items-center gap-6">
                        {/* Like Button with Real Count */}
                        <Link
                            href={
                                auth.user
                                    ? route("news.like", post.id)
                                    : route("login")
                            }
                            method="post"
                            as="button"
                            preserveScroll
                            className={`flex items-center gap-2 font-bold transition ${isLiked ? "text-red-500" : "text-slate-400 hover:text-red-500"}`}
                        >
                            <Heart
                                fill={isLiked ? "currentColor" : "none"}
                                size={22}
                            />
                            <span>{post.likes_count} Likes</span>{" "}
                            {/* Showing Like Count Here */}
                        </Link>

                        {/* Save Button */}
                        <Link
                            href={
                                auth.user
                                    ? route("news.save", post.id)
                                    : route("login")
                            }
                            method="post"
                            as="button"
                            preserveScroll
                            className={`flex items-center gap-2 font-bold transition ${isSaved ? "text-blue-600" : "text-slate-400 hover:text-blue-600"}`}
                        >
                            <Bookmark
                                fill={isSaved ? "currentColor" : "none"}
                                size={22}
                            />
                            <span>{isSaved ? "Saved" : "Save"}</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4 text-slate-400 text-sm font-bold">
                        <span className="flex items-center gap-1">
                            <Eye size={18} /> {post.views}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock size={18} />{" "}
                            {calculateReadTime(post.content)} MIN READ
                        </span>
                    </div>
                </div>

                {/* --- ARTICLE BODY --- */}
                <div
                    className="prose prose-slate max-w-none mt-8 text-lg leading-relaxed text-slate-700"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* --- COMMENT SECTION --- */}
                <section className="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 mb-20 shadow-sm">
                    {/* Header section with clean badge counting */}
                    <div className="flex items-center justify-between mb-8 border-b border-slate-200/60 pb-4">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
                            <MessageCircle
                                size={22}
                                className="text-slate-600"
                            />
                            <span>Discussion</span>
                        </h3>
                        <span className="bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
                            {post.comments?.length || 0}{" "}
                            {post.comments?.length === 1
                                ? "comment"
                                : "comments"}
                        </span>
                    </div>

                    {/* Comment Submission Form */}
                    {auth.user ? (
                        <form onSubmit={submitComment} className="mb-8 group">
                            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                                <textarea
                                    value={data.body}
                                    onChange={(e) =>
                                        setData("body", e.target.value)
                                    }
                                    className="w-full border-0 focus:ring-0 p-0 text-slate-700 placeholder:text-slate-400 text-sm resize-none min-h-[80px]"
                                    placeholder="Share your thoughts constructively..."
                                />
                                <div className="flex justify-end border-t border-slate-100 pt-3 mt-2">
                                    <button
                                        disabled={
                                            processing || !data.body?.trim()
                                        }
                                        className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition active:scale-98 disabled:opacity-40 disabled:pointer-events-none shadow-sm shadow-blue-500/10"
                                    >
                                        {processing ? (
                                            "Posting..."
                                        ) : (
                                            <>
                                                <Send size={14} /> Comment
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl text-center mb-8 shadow-sm">
                            <p className="text-sm text-slate-500 font-medium mb-2">
                                Have something to add to the conversation?
                            </p>
                            <Link
                                href={route("login")}
                                className="inline-flex text-xs bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-800 transition"
                            >
                                Log in to comment
                            </Link>
                        </div>
                    )}

                    {/* Comment List */}
                    <div className="space-y-4 max-w-full overflow-auto max-h-[400px]">
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="flex gap-4 max-w-full group"
                                >
                                    {/* Upgraded soft-colored Avatar matching user initial */}
                                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/60 flex items-center justify-center text-slate-700 text-sm font-bold shadow-sm select-none">
                                        {comment.user.name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    {/* Clean Bubble Design */}
                                    <div className="flex-1 min-w-0">
                                        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm break-words transition-all hover:border-slate-300/80">
                                            <div className="flex items-baseline justify-between gap-4 mb-1.5">
                                                <span className="font-semibold text-sm text-slate-900 truncate">
                                                    {comment.user.name}
                                                </span>
                                                {/* Dynamic Relative Timestamp column */}
                                                <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                                                    {formatDistanceToNow(
                                                        new Date(
                                                            comment.created_at,
                                                        ),
                                                        { addSuffix: true },
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                                                {comment.body}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-400 text-sm italic font-medium">
                                No comments yet. Be the first to start the
                                conversation!
                            </div>
                        )}
                    </div>
                </section>

                {/* --- RELATED NEWS IMPLEMENTATION --- */}
                <div className="border-t border-slate-200 pt-16 mb-20">
                    <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter">
                        More from {post.category.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {related_posts?.map((item) => (
                            <Link
                                key={item.id}
                                href={route("news.show", item.slug)}
                                className="group flex flex-col"
                            >
                                <div className="relative mb-4 h-40 overflow-hidden rounded-2xl bg-slate-100">
                                    <img
                                        src={
                                            item.image ||
                                            `https://picsum.photos/seed/${item.id}/400/250`
                                        }
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <h4 className="text-lg font-bold leading-tight text-slate-800 group-hover:text-blue-600">
                                    {item.title}
                                </h4>
                                <span className="mt-2 flex items-center gap-1 text-[11px] font-bold uppercase text-slate-400">
                                    Read Article <ChevronRight size={14} />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
