import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Welcome Back" />

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-black text-slate-800">
                    Welcome Back
                </h2>
                <p className="text-sm text-slate-500">
                    Log in to save articles and join the discussion.
                </p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email Address" />
                    <TextInput
                        id="email"
                        type="email"
                        value={data.email}
                        className="mt-1 block w-full border-slate-200 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <div className="flex justify-between items-center">
                        <InputLabel htmlFor="password" value="Password" />
                        {/* {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="text-xs text-blue-600 hover:underline"
                            >
                                Forgot?
                            </Link>
                        )} */}
                    </div>
                    <TextInput
                        id="password"
                        type="password"
                        value={data.password}
                        className="mt-1 block w-full border-slate-200 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                        onChange={(e) => setData("password", e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-slate-600">
                            Stay logged in
                        </span>
                    </label>
                </div>

                <PrimaryButton
                    className="w-full justify-center py-3 bg-blue-600 hover:bg-blue-700 transition font-bold text-base"
                    disabled={processing}
                >
                    Sign In
                </PrimaryButton>

                <p className="text-center text-sm text-slate-600 mt-4">
                    Don't have an account?{" "}
                    <Link
                        href={route("register")}
                        className="text-blue-600 font-bold hover:underline"
                    >
                        Create one free
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
