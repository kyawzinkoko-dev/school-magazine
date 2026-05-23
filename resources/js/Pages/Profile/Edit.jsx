import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    Settings,
    Bookmark,
    BookOpen,
    ChevronRight,
    User,
    ShieldAlert,
    Trash2,
} from "lucide-react";

export default function Edit({ auth, mustVerifyEmail, status, savedPosts }) {
    // Detect tab from URL: e.g., /profile?tab=profile
    const urlParams = new URLSearchParams(window.location.search);
    const [activeTab, setActiveTab] = useState(
        urlParams.get("tab") || "library",
    );

    // Sync state if user clicks a link with a different tab param
    useEffect(() => {
        const currentTab = new URLSearchParams(window.location.search).get(
            "tab",
        );
        if (currentTab) setActiveTab(currentTab);
    }, [window.location.search]);

    const tabs = [
        {
            id: "library",
            name: "Reading List",
            icon: Bookmark,
            count: savedPosts.length,
        },
        { id: "profile", name: "Profile Info", icon: User },
        { id: "security", name: "Security", icon: ShieldAlert },
        { id: "danger", name: "Danger Zone", icon: Trash2 },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-black text-3xl text-slate-900 tracking-tighter uppercase">
                    My Dashboard
                </h2>
            }
        >
            <Head title="My Dashboard" />

            <div className="flex flex-col lg:flex-row gap-8">
                {/* --- SIDEBAR NAVIGATION --- */}
                <aside className="w-full lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                // Update URL without refreshing page
                                window.history.pushState(
                                    {},
                                    "",
                                    `?tab=${tab.id}`,
                                );
                            }}
                            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
                                activeTab === tab.id
                                    ? "bg-blue-600 text-white shadow-xl shadow-blue-200"
                                    : "text-slate-500 hover:bg-white hover:text-slate-800 border border-transparent hover:border-slate-200"
                            }`}
                        >
                            <tab.icon size={18} />
                            {tab.name}
                            {tab.count !== undefined && (
                                <span
                                    className={`ml-auto px-2 py-0.5 rounded-lg text-[10px] font-black ${activeTab === tab.id ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"}`}
                                >
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </aside>

                {/* --- CONTENT SECTION --- */}
                <div className="flex-1">
                    {activeTab === "library" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {savedPosts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {savedPosts.map((post) => (
                                        <div
                                            key={post.id}
                                            className="bg-white rounded-[32px] border border-slate-100 p-3 flex gap-4 hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                                        >
                                            <div className="w-28 h-28 shrink-0 overflow-hidden rounded-[24px]">
                                                <img
                                                    src={
                                                        post.image_url ||
                                                        `https://picsum.photos/seed/${post.id}/400`
                                                    }
                                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center pr-2">
                                                <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">
                                                    {post.category?.name}
                                                </span>
                                                <h3 className="font-bold text-slate-800 leading-tight line-clamp-2 mt-1 group-hover:text-blue-600 transition-colors">
                                                    {post.title}
                                                </h3>
                                                <Link
                                                    href={route(
                                                        "news.show",
                                                        post.slug,
                                                    )}
                                                    className="mt-3 flex items-center gap-1 text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
                                                >
                                                    Read Now{" "}
                                                    <ChevronRight size={12} />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-[40px] border border-slate-100 p-20 text-center shadow-sm">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                        <BookOpen size={40} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                                        Your library is empty
                                    </h3>
                                    <p className="text-slate-500 text-sm mt-2">
                                        Articles you save will appear here.
                                    </p>
                                    <Link
                                        href="/"
                                        className="mt-8 inline-block bg-slate-900 text-white px-10 py-4 rounded-full font-bold hover:bg-blue-600 transition shadow-xl shadow-slate-200 uppercase text-xs tracking-widest"
                                    >
                                        Explore News
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "profile" && (
                        <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm animate-in fade-in duration-500">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm animate-in fade-in duration-500">
                            <UpdatePasswordForm />
                        </div>
                    )}

                    {activeTab === "danger" && (
                        <div className="bg-white rounded-[40px] p-8 border border-red-50 shadow-sm animate-in fade-in duration-500">
                            <DeleteUserForm />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
