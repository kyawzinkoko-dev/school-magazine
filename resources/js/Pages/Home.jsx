import { calculateReadTime } from "@/Components/helper";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Clock, Eye, ChevronRight, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function Welcome({ posts, filters, categories }) {
    const [search, setSearch] = useState(filters.search || "");
    const [allPosts, setAllPosts] = useState(posts.data);
    const [nextPageUrl, setNextPageUrl] = useState(posts.next_page_url);
    const [loading, setLoading] = useState(false);

    // 1. Sync state when filters or initial posts change (e.g., after a search)
    useEffect(() => {
        setAllPosts(posts.data);
        setNextPageUrl(posts.next_page_url);
    }, [posts]);

    // 2. Handle Search (Debounced)
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (filters.search || "")) {
                router.get(
                    route("news.index"),
                    { search, category: filters.category },
                    {
                        preserveState: true,
                        replace: true,
                    },
                );
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    // 3. Improved Infinite Scroll Logic
    const loadMore = () => {
        if (!nextPageUrl || loading) return;

        setLoading(true);

        // Instead of fetch, use router.reload or router.get with 'only'
        router.get(
            nextPageUrl,
            {
                search: filters.search,
                category: filters.category,
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ["posts"], // Only fetch the 'posts' partial
                onSuccess: (page) => {
                    // Append the new posts to the existing list
                    setAllPosts((prev) => [...prev, ...page.props.posts.data]);
                    setNextPageUrl(page.props.posts.next_page_url);
                    setLoading(false);
                },
                onFinish: () => setLoading(false),
            },
        );
    };

    const featured = allPosts[0];
    const remainingPosts = allPosts.slice(1);

    return (
        <GuestLayout>
            <Head title="Latest News & Magazine" />

            {/* --- SEARCH & CATEGORY FILTERS --- */}
            <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="relative w-full md:w-96">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search for news..."
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border-slate-200 focus:ring-blue-500 focus:border-blue-500 shadow-sm outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                    <Link
                        href={route("news.index")}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${!filters.category ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`}
                    >
                        ALL
                    </Link>
                    {categories?.map((cat) => (
                        <Link
                            key={cat.id}
                            href={route("news.index", { category: cat.slug })}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${filters.category === cat.slug ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`}
                        >
                            {cat.name.toUpperCase()}
                        </Link>
                    ))}
                </div>
            </div>

            {/* --- FEATURED HERO --- */}
            {!filters.search && !filters.category && featured && (
                <div className="relative mb-16 overflow-hidden rounded-[32px] bg-slate-900 shadow-2xl group">
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-3/5 overflow-hidden">
                            <img
                                src={
                                    featured.image_url ||
                                    "https://picsum.photos/800/600"
                                }
                                className="h-[400px] w-full object-cover opacity-80 group-hover:scale-105 transition duration-700"
                            />
                        </div>
                        <div className="flex flex-col justify-center p-8 md:w-2/5 md:p-12 bg-slate-900">
                            <span className="mb-4 inline-block w-fit rounded-full bg-blue-600 px-4 py-1 text-[10px] font-black uppercase text-white tracking-widest">
                                {featured.category?.name || "Featured"}
                            </span>
                            <h2 className="mb-4 text-3xl font-black text-white leading-tight">
                                {featured.title}
                            </h2>
                            <p
                                className="mb-6 line-clamp-3 text-slate-400 text-sm"
                                dangerouslySetInnerHTML={{
                                    __html: featured.content,
                                }}
                            ></p>
                            <Link
                                href={route("news.show", featured.slug)}
                                className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-blue-400 hover:text-white transition"
                            >
                                Read Full Story <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* --- NEWS GRID --- */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {remainingPosts.map((post) => (
                    <article
                        key={post.id}
                        className="group flex flex-col bg-white rounded-3xl border border-slate-100 p-4 transition hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-1"
                    >
                        <div className="relative mb-4 h-52 overflow-hidden rounded-2xl">
                            <img
                                src={
                                    post.image_url ||
                                    `https://picsum.photos/seed/${post.id}/600/400`
                                }
                                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-3 left-3">
                                <span className="rounded-lg bg-white/90 backdrop-blur px-3 py-1.5 text-[10px] font-black uppercase text-slate-800 tracking-widest shadow-sm">
                                    {post.category?.name}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col px-2">
                            <div className="mb-3 flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span className="flex items-center gap-1">
                                    <Clock
                                        size={12}
                                        className="text-blue-500"
                                    />{" "}
                                    {calculateReadTime(post.content)} MIN READ
                                </span>
                                <span className="flex items-center gap-1">
                                    <Eye size={12} className="text-blue-500" />{" "}
                                    {post.views} VIEWS
                                </span>
                            </div>
                            <h3 className="mb-3 text-xl font-bold leading-snug text-slate-800 group-hover:text-blue-600 transition-colors">
                                <Link href={route("news.show", post.slug)}>
                                    {post.title}
                                </Link>
                            </h3>
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: post.content,
                                }}
                                className="mb-5 line-clamp-2 text-sm text-slate-500 leading-relaxed"
                            >

                            </p>
                            <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                                <Link
                                    href={route("news.show", post.slug)}
                                    className="text-[11px] font-black text-slate-900 group-hover:text-blue-600 flex items-center gap-1 uppercase tracking-widest"
                                >
                                    View Article <ChevronRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* --- LOAD MORE TRIGGER --- */}
            {nextPageUrl && (
                <div className="mt-20 flex justify-center">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="group flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 active:scale-95"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Loading...
                            </>
                        ) : (
                            "Load More Articles"
                        )}
                    </button>
                </div>
            )}
        </GuestLayout>
    );
}
