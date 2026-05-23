import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    Newspaper,
    Settings,
    LogOut,
    Bookmark,
    User,
    ChevronDown,
} from "lucide-react";

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isAdmin = user.role === "admin";

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center gap-10">
                            <Link
                                href="/"
                                className="flex items-center gap-2 group"
                            >
                                <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-slate-900 transition-colors">
                                    <ApplicationLogo className="h-6 w-auto fill-white" />
                                </div>
                                <span className="text-lg font-black tracking-tighter text-slate-800 uppercase">
                                    Mag_News
                                </span>
                            </Link>

                            <div className="hidden space-x-1 sm:flex h-16">
                                {/* If Admin: Go to Panel. If User: Go to Profile Library Tab */}
                                <NavLink
                                    href={
                                        isAdmin
                                            ? route("admin.dashboard")
                                            : route("profile.edit", {
                                                 // tab: "library",
                                              })
                                    }
                                    active={
                                        route().current("dashboard") ||
                                        route().current("admin.dashboard")
                                    }
                                    className="px-4 text-sm font-bold flex items-center gap-2"
                                >
                                    {isAdmin && (
                                        <LayoutDashboard size={18} />
                                    ) }
                                    {isAdmin &&"Admin Panel" }
                                </NavLink>

                                {isAdmin && (
                                    <NavLink
                                        href={route("admin.news.index")}
                                        active={route().current("admin.news.*")}
                                        className="px-4 text-sm font-bold flex items-center gap-2"
                                    >
                                        <Settings size={18} /> Manage News
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-3 pl-3 pr-2 py-1.5 border border-slate-100 rounded-full bg-slate-50 hover:bg-white transition-all group">
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs font-black text-slate-800 leading-none uppercase">
                                                {user.name}
                                            </span>
                                            <span className="text-[9px] uppercase text-blue-600 font-bold tracking-widest mt-0.5">
                                                {user.role}
                                            </span>
                                        </div>
                                        <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-black">
                                            {user.name.charAt(0)}
                                        </div>
                                        <ChevronDown
                                            size={14}
                                            className="text-slate-400"
                                        />
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link
                                        href={route("profile.edit", {
                                            tab: "library",
                                        })}
                                        className="flex items-center gap-2 font-bold"
                                    >
                                        <Bookmark size={16} /> My Library
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("profile.edit", {
                                            tab: "profile",
                                        })}
                                        className="flex items-center gap-2 font-bold"
                                    >
                                        <User size={16} /> Settings
                                    </Dropdown.Link>
                                    <div className="border-t border-slate-100 my-1"></div>
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="flex items-center gap-2 font-bold text-red-600"
                                    >
                                        <LogOut size={16} /> Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white border-b border-slate-100">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
