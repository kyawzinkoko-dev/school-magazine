import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Bookmark, Clock, ChevronRight, BookOpen } from "lucide-react";

export default function SavedArticles({ posts }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-black text-2xl text-slate-800 leading-tight">
                    My Reading Library
                </h2>
            }
        >
            <Head title="Saved Articles" />

            <div className="py-2">
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition group"
                            >
                                <div className="h-40 overflow-hidden relative">
                                    <img
                                        src={
                                            post.image ||
                                            `https://picsum.photos/seed/${post.id}/600/400`
                                        }
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
                                            <Bookmark
                                                size={14}
                                                fill="currentColor"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">
                                        {post.category?.name}
                                    </span>
                                    <h3 className="text-lg font-bold text-slate-800 mt-2 line-clamp-2 group-hover:text-blue-600">
                                        <Link
                                            href={route("news.show", post.slug)}
                                        >
                                            {post.title}
                                        </Link>
                                    </h3>

                                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1">
                                            <Clock size={12} /> Saved{" "}
                                            {new Date(
                                                post.pivot.created_at,
                                            ).toLocaleDateString()}
                                        </div>
                                        <Link
                                            href={route("news.show", post.slug)}
                                            className="text-blue-600 font-black text-xs flex items-center gap-1"
                                        >
                                            READ <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* --- EMPTY STATE --- */
                    <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 text-slate-300 mb-6">
                            <BookOpen size={40} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800">
                            Your library is empty
                        </h3>
                        <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                            Articles you save while browsing will appear here
                            for you to read later.
                        </p>
                        <Link
                            href={route("news.index")}
                            className="mt-8 inline-block bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition"
                        >
                            Explore News
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
