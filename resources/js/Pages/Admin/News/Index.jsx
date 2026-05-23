import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Plus,
    Edit3,
    Trash2,
    ExternalLink,
    Search,
    FileText,
    Eye,
    MoreHorizontal,
    X,
} from "lucide-react";
import { useState } from "react";

export default function Index({ auth, posts }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeMenu, setActiveMenu] = useState(null);
    const { delete: destroy } = useForm();

    // 1. Search Logic: Filters the posts array in real-time
    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const deletePost = (id) => {
        if (
            confirm("Move this article to trash? This action cannot be undone.")
        ) {
            destroy(route("admin.news.destroy", id));
            setActiveMenu(null);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
                    <div>
                        <h2 className="font-black text-3xl text-slate-900 tracking-tighter uppercase italic">
                            Newsroom
                        </h2>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                            Manage and publish your stories
                        </p>
                    </div>
                    <Link
                        href={route("admin.news.create")}
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.1em] hover:bg-slate-900 transition-all shadow-xl shadow-blue-200 active:scale-95"
                    >
                        <Plus size={18} strokeWidth={3} /> New Publication
                    </Link>
                </div>
            }
        >
            <Head title="Admin | Newsroom" />

            {/* --- SEARCH BAR --- */}
            <div className="mb-8">
                <div className="relative w-full max-w-md">
                    {/* <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                    /> */}
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title..."
                        className="w-full pl-12 pr-10 py-4 bg-white border-none rounded-[20px] shadow-sm focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* --- DATA TABLE --- */}
            <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-xl shadow-slate-200/40">
                <div className="overflow-visible">
                    {" "}
                    {/* Changed from overflow-hidden to allow dropdowns to pop out */}
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    Article Information
                                </th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    Category
                                </th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    Engagement
                                </th>
                                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredPosts.map((post) => (
                                <tr
                                    key={post.id}
                                    /* Dynamic Z-Index Fix: Active row gets lifted above others */
                                    className={`transition-all duration-300 ${
                                        activeMenu === post.id
                                            ? "relative z-50 bg-blue-50/50"
                                            : "hover:bg-slate-50/50"
                                    }`}
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 shrink-0 rounded-[22px] overflow-hidden border-2 border-white shadow-md ring-1 ring-slate-100">
                                                <img
                                                    src={post.image_url}
                                                    className="w-full h-full object-cover"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <Link
                                                    href={route(
                                                        "admin.news.edit",
                                                        post.id,
                                                    )}
                                                    className="font-black text-slate-800 text-base leading-tight block truncate hover:text-blue-600 transition-colors"
                                                >
                                                    {post.title}
                                                </Link>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">
                                                    {new Date(
                                                        post.created_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest">
                                            {post.category?.name ||
                                                "Uncategorized"}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-1.5">
                                            <Eye
                                                size={14}
                                                className="text-blue-500"
                                            />
                                            <span className="text-sm font-black text-slate-700">
                                                {post.views?.toLocaleString() ||
                                                    0}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right relative">
                                        {/* Dropdown Toggle */}
                                        <button
                                            onClick={() =>
                                                setActiveMenu(
                                                    activeMenu === post.id
                                                        ? null
                                                        : post.id,
                                                )
                                            }
                                            className={`p-2 rounded-lg transition-colors ${
                                                activeMenu === post.id
                                                    ? "bg-blue-600 text-white shadow-lg"
                                                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-900"
                                            }`}
                                        >
                                            <MoreHorizontal size={20} />
                                        </button>

                                        {/* Dropdown Menu Container */}
                                        {activeMenu === post.id && (
                                            <>
                                                {/* Backdrop to close menu on click outside */}
                                                <div
                                                    className="fixed inset-0 z-[60]"
                                                    onClick={() =>
                                                        setActiveMenu(null)
                                                    }
                                                ></div>

                                                <div className="absolute right-8 top-12 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[70] py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                                                    <Link
                                                        href={route(
                                                            "news.show",
                                                            post.slug,
                                                        )}
                                                        className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                                                    >
                                                        <ExternalLink
                                                            size={16}
                                                        />{" "}
                                                        View Live
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            "admin.news.edit",
                                                            post.id,
                                                        )}
                                                        className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-amber-600 transition-colors"
                                                    >
                                                        <Edit3 size={16} /> Edit
                                                        Article
                                                    </Link>
                                                    <div className="h-px bg-slate-100 my-1"></div>
                                                    <button
                                                        onClick={() =>
                                                            deletePost(post.id)
                                                        }
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors text-left"
                                                    >
                                                        <Trash2 size={16} />{" "}
                                                        Delete Article
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredPosts.length === 0 && (
                    <div className="py-24 text-center border-t border-slate-50">
                        <FileText
                            size={48}
                            className="mx-auto text-slate-200 mb-4"
                        />
                        <h3 className="text-slate-900 font-black text-lg uppercase italic">
                            No matches found
                        </h3>
                        <p className="text-slate-400 text-sm font-bold mt-1 max-w-xs mx-auto">
                            Try searching for something else or create a new
                            publication.
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
