import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link, usePage } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    const { categories, auth } = usePage().props;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* --- PUBLIC NAVBAR --- */}
            <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center gap-2">
                                <ApplicationLogo className="h-8 w-auto fill-current text-blue-600" />
                                <span className="text-xl font-black tracking-tighter text-slate-800">
                                    MAG_NEWS
                                </span>
                            </Link>

                            {/* Desktop Categories */}
                            {/* <div className="hidden md:flex space-x-6">
                                {categories?.map((cat) => (
                                    <Link
                                        key={`${cat.id}+${cat.name}`}
                                        href={route("news.category", cat.slug)}
                                        className="text-sm font-bold text-slate-600 hover:text-blue-600 transition"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div> */}
                        </div>

                        {/* Right Side: Auth Links */}
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route("dashboard")}
                                    className="text-sm font-bold text-slate-700 hover:text-blue-600"
                                >
                                    My Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route("login")}
                                        className="text-sm font-bold text-slate-700 hover:text-blue-600"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="hidden sm:block rounded-full bg-slate-900 px-5 py-2 text-sm font-bold text-white hover:bg-blue-600 transition"
                                    >
                                        Subscribe
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- MAIN CONTENT AREA --- */}
            {/* Logic: If we are on login/register, we use a small container.
                If we are viewing news, we use a large container.
            */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Check if children is a form (Auth) or a full page (News) */}
                <div className="flex flex-col items-center justify-center">
                    {/* This logic wraps Auth forms in a nice card automatically */}
                    {route().current("login") || route().current("register") ? (
                        <div className="w-full max-w-md mt-12 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
                            {children}
                        </div>
                    ) : (
                        <div className="w-full">{children}</div>
                    )}
                </div>
            </main>

            {/* --- FOOTER --- */}
            <footer className="mt-20 border-t border-slate-200 bg-white py-12">
                <div className="mx-auto max-w-7xl px-4 text-center">
                    <p className="text-sm text-slate-500">
                        &copy; 2026 MagNews Magazine. Built for School Project.
                    </p>
                </div>
            </footer>
        </div>
    );
}
