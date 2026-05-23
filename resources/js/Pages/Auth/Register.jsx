import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Join MagNews" />

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-black text-slate-800">
                    Create Account
                </h2>
                <p className="text-sm text-slate-500">
                    Become a member to like and save your favorite news.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="name" value="Full Name" />
                    <TextInput
                        id="name"
                        value={data.name}
                        className="mt-1 block w-full border-slate-200 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                        isFocused={true}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email Address" />
                    <TextInput
                        id="email"
                        type="email"
                        value={data.email}
                        className="mt-1 block w-full border-slate-200 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            value={data.password}
                            className="mt-1 block w-full border-slate-200 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            required
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm"
                        />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            className="mt-1 block w-full border-slate-200 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            required
                        />
                    </div>
                </div>
                <InputError message={errors.password} className="mt-1" />
                <InputError
                    message={errors.password_confirmation}
                    className="mt-1"
                />

                <div className="pt-2">
                    <PrimaryButton
                        className="w-full justify-center py-3 bg-blue-600 hover:bg-blue-700 transition font-bold text-base"
                        disabled={processing}
                    >
                        Create Account
                    </PrimaryButton>
                </div>

                <p className="text-center text-sm text-slate-600 mt-4">
                    Already a member?{" "}
                    <Link
                        href={route("login")}
                        className="text-blue-600 font-bold hover:underline"
                    >
                        Log in here
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
