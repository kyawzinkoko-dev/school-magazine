import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import {
    Upload,
    X,
    ArrowLeft,
    Send,
    AlertCircle,
    ChevronDown,
} from "lucide-react";
import { useState } from "react";
// 1. Import ReactQuill and its stylesheet
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function Create({ auth, categories }) {
    const [preview, setPreview] = useState(null);
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        category_id: "",
        content: "",
        image: null,
    });

    // 2. Define custom toolbar options (optional but recommended)
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "clean"],
        ],
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.news.store"));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route("admin.news.index")}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <ArrowLeft size={22} className="text-slate-600" />
                        </Link>
                        <div>
                            <h2 className="font-bold text-xl text-slate-800 tracking-tight">
                                Create Publication
                            </h2>
                            <p className="text-xs text-slate-500 font-medium italic">
                                Drafting your next story
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="New Publication" />

            <form
                onSubmit={submit}
                className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pb-32"
            >
                {/* --- CONTENT EDITOR --- */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-500/10">
                        {/* Title Input */}
                        <div className="p-8 border-b border-slate-100">
                            <input
                                type="text"
                                className="w-full border-none focus:ring-0 text-3xl font-bold placeholder:text-slate-300 p-0"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                placeholder="Headline goes here..."
                            />
                            {errors.title && (
                                <p className="text-red-500 text-xs mt-3 font-semibold flex items-center gap-1">
                                    <AlertCircle size={14} /> {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Rich Text Content Area */}
                        <div className="p-8 admin-quill-editor">
                            <ReactQuill
                                theme="snow"
                                value={data.content}
                                onChange={(content) =>
                                    setData("content", content)
                                }
                                modules={modules}
                                placeholder="Start weaving your narrative..."
                                className="min-h-[400px] mb-12"
                            />
                            {errors.content && (
                                <p className="text-red-500 text-xs mt-2 font-medium">
                                    {errors.content}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- SETTINGS SIDEBAR --- */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Media Card */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 block">
                            Featured Media
                        </label>

                        <div className="relative group aspect-video rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-blue-400 transition-all flex flex-col items-center justify-center overflow-hidden">
                            {preview ? (
                                <>
                                    <img
                                        src={preview}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        alt="Preview"
                                    />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreview(null);
                                                setData("image", null);
                                            }}
                                            className="bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <label className="cursor-pointer flex flex-col items-center gap-2 group">
                                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-all">
                                        <Upload size={20} />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                                        Click to upload cover
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                </label>
                            )}
                        </div>
                        {errors.image && (
                            <p className="text-red-500 text-[11px] mt-2 font-bold">
                                {errors.image}
                            </p>
                        )}
                    </div>

                    {/* Taxonomy Card */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 block">
                            Classification
                        </label>
                        <div className="relative">
                            <select
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all appearance-none"
                                value={data.category_id}
                                onChange={(e) =>
                                    setData("category_id", e.target.value)
                                }
                            >
                                <option value="">Select Topic</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={16}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            />
                        </div>
                        {errors.category_id && (
                            <p className="text-red-500 text-[11px] mt-2 font-bold">
                                {errors.category_id}
                            </p>
                        )}
                    </div>

                    {/* Publish Card */}
                    <div className="bg-slate-900 rounded-3xl p-6 shadow-lg shadow-blue-900/20">
                        <div className="space-y-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                            >
                                <Send size={18} />
                                <span>
                                    {processing
                                        ? "Publishing..."
                                        : "Publish Article"}
                                </span>
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-500 text-center mt-4 font-medium uppercase tracking-tighter">
                            Finalize your story to reach your audience
                        </p>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
