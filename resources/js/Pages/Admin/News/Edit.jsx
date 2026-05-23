import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Save, ArrowLeft, Upload, X, AlertCircle } from "lucide-react";
import { useState } from "react";
// 1. Import ReactQuill and its stylesheet
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function Edit({ auth, post, categories }) {
    // Falls back to standard image storage path if image_url isn't predefined
    const [preview, setPreview] = useState(
        post.image ? `/storage/${post.image}` : post.image_url,
    );

    const {
        data,
        setData,
        post: submitPost,
        processing,
        errors,
    } = useForm({
        _method: "put", // Spoofing PUT for file upload
        title: post.title,
        category_id: post.category_id,
        content: post.content,
        image: null,
    });

    // 2. Define toolbar controls to match your Create setup
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
        // Use post() because of file upload, Laravel treats as PUT via _method
        submitPost(route("admin.news.update", post.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route("admin.news.index")}
                        className="p-2 bg-white rounded-xl border border-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <h2 className="font-black text-2xl uppercase tracking-tighter text-slate-900">
                        Edit Article
                    </h2>
                </div>
            }
        >
            <Head title={`Edit: ${post.title}`} />

            <form
                onSubmit={submit}
                className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20"
            >
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-6">
                        {/* Title Input */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                className="w-full border-slate-200 rounded-2xl focus:ring-blue-600 font-bold text-lg p-4"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                            />
                            {errors.title && (
                                <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1">
                                    <AlertCircle size={14} /> {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Rich Text Editor Input */}
                        <div className="admin-quill-editor">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                                Content
                            </label>
                            <ReactQuill
                                theme="snow"
                                value={data.content}
                                onChange={(content) =>
                                    setData("content", content)
                                }
                                modules={modules}
                                placeholder="Edit your narrative details..."
                            />
                            {errors.content && (
                                <p className="text-red-500 text-xs mt-4 font-bold">
                                    {errors.content}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Configuration Panel */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 space-y-8">
                        {/* Featured Image Handler */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                                Featured Image
                            </label>
                            <div className="relative group border-2 border-dashed border-slate-200 rounded-[32px] aspect-square flex flex-col items-center justify-center overflow-hidden bg-slate-50">
                                {preview ? (
                                    <img
                                        src={preview}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        alt="Preview"
                                    />
                                ) : (
                                    <div className="text-slate-300 flex flex-col items-center gap-2">
                                        <Upload size={32} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">
                                            No Cover Selected
                                        </span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                    <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest">
                                        Update Image
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                        />
                                    </label>
                                </div>
                            </div>
                            <p className="text-[9px] text-slate-400 mt-2 text-center font-bold uppercase italic tracking-tighter">
                                Current image will be kept if none selected
                            </p>
                        </div>

                        {/* Category Selector */}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                                Category
                            </label>
                            <select
                                className="w-full border-slate-200 rounded-2xl font-bold text-slate-700"
                                value={data.category_id}
                                onChange={(e) =>
                                    setData("category_id", e.target.value)
                                }
                            >
                                <option value="" disabled>
                                    Select a Category
                                </option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && (
                                <p className="text-red-500 text-xs mt-2 font-bold">
                                    {errors.category_id}
                                </p>
                            )}
                        </div>

                        {/* Action Submit Button */}
                        <button
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Save size={18} />{" "}
                            {processing ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
