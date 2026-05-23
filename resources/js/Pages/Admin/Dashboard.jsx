import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
    FileText,
    Users,
    MessageSquare,
    BarChart3,
    Plus,
    ArrowUpRight,
    Clock,
    ChevronRight,
} from "lucide-react";

export default function Dashboard({ auth, stats, recent_posts }) {
    const statCards = [
        {
            label: "Total Articles",
            value: stats.total_posts,
            icon: FileText,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Total Views",
            value: stats.total_views.toLocaleString(),
            icon: BarChart3,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            label: "Total Readers",
            value: stats.total_users,
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
        {
            label: "Comments",
            value: stats.total_comments,
            icon: MessageSquare,
            color: "text-orange-600",
            bg: "bg-orange-50",
        },
    ];
console.log(recent_posts)
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between w-full">
                    <h2 className="font-black text-3xl text-slate-900 tracking-tighter uppercase">
                        Admin Console
                    </h2>
                    <Link
                        href={route("admin.news.create")}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-slate-900 transition-all shadow-lg shadow-blue-200"
                    >
                        <Plus size={18} /> Publish New
                    </Link>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            {/* --- STATS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statCards.map((stat, i) => (
                    <div
                        key={i}
                        className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5"
                    >
                        <div
                            className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}
                        >
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                {stat.label}
                            </p>
                            <p className="text-2xl font-black text-slate-800">
                                {stat.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- RECENT POSTS TABLE --- */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-900 p-2 rounded-lg text-white">
                            <Clock size={20} />
                        </div>
                        <h3 className="font-black text-xl text-slate-800 uppercase tracking-tighter text-sm">
                            Recently Published
                        </h3>
                    </div>
                    <Link
                        href={route("admin.news.index")}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 uppercase tracking-widest"
                    >
                        View All <ChevronRight size={14} />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Article
                                </th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Category
                                </th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                                    Views
                                </th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recent_posts.map((post) => (
                                <tr
                                    key={post.id}
                                    className="group hover:bg-slate-50 transition-all duration-200"
                                >
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4 max-w-md">
                                            {/* shrink-0 ensures the 48px size is forced */}
                                            {/* <img
                                                src={post.image_url}
                                                alt=""
                                                className="w-12 h-12 shrink-0 rounded-2xl object-cover border border-slate-200 shadow-sm group-hover:shadow-md transition-shadow"
                                            /> */}
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-900 leading-tight truncate hover:text-blue-600 transition-colors">
                                                    {post.title}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                                        {new Date(
                                                            post.created_at,
                                                        ).toLocaleDateString(
                                                            undefined,
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                            },
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-8 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
                                            {post.category?.name}
                                        </span>
                                    </td>

                                    <td className="px-8 py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-black text-slate-700">
                                                {post.views}
                                            </span>
                                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                                                Reads
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-8 py-4 text-right">
                                        <Link
                                            href={route("news.show", post.slug)}
                                            className="p-2 inline-flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all"
                                        >
                                            <ArrowUpRight size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
