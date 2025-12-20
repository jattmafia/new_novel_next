"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createChapter } from "@/lib/storyService";
import { ChevronLeft } from "lucide-react";
import Spinner from "@/components/Spinner";

interface ChapterEditorProps {
    storyId: string;
    username: string;
}

export default function ChapterEditor({ storyId, username }: ChapterEditorProps) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [chapterNumber, setChapterNumber] = useState<string>("");
    const [accessType, setAccessType] = useState<"free" | "paid" | "followers">(
        "free"
    );
    const [price, setPrice] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    // Check if user is authorized to edit this story
    useEffect(() => {
        const storedUsername = localStorage.getItem("webnovelUsername");

        // If no user is logged in or username doesn't match, redirect to home
        if (!storedUsername || storedUsername !== username) {
            router.push("/");
            return;
        }

        setIsAuthorized(true);
        setIsChecking(false);
    }, [username, router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSave = async (isDraft: boolean = false) => {
        setError(null);

        if (!title.trim()) {
            setError("Chapter title is required");
            return;
        }

        if (!content.trim()) {
            setError("Chapter content is required");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                title,
                content,
                chapterNumber: chapterNumber ? Number(chapterNumber) : undefined,
                isDraft,
                image,
                accessType,
                price:
                    accessType === "paid" && price ? Number(price) : undefined,
            };

            await createChapter(storyId, payload);

            setLoading(false);
            // Redirect back to story page 
            router.push(`/${username}/story/${storyId}`);
        } catch (err: any) {
            setLoading(false);
            setError(err?.message || "Failed to create chapter");
        }
    };

    // Show loading state while checking authorization 
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    // Don't render if not authorized
    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-gray-200 sticky top-0 bg-white z-40">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <div className="flex-1 text-center">
                        <p className="text-sm text-gray-500">Writing Chapter</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => handleSave(false)}
                            disabled={loading}
                            className="px-6 py-2 bg-linear-to-r from-purple-600 to-amber-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50"
                        >
                            {loading ? "Publishing..." : "Publish"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Editor */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title */}
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Add chapter title"
                            className="w-full text-4xl font-bold placeholder-gray-300 focus:outline-none"
                        />

                        {/* Cover Image Upload */}
                        <label className="block">
                            <div className="border-2 border-dashed border-purple-400 rounded-lg p-6 text-center cursor-pointer hover:bg-purple-50 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <p className="text-purple-600 font-semibold">
                                    {image ? image.name : "Upload chapter cover image"}
                                </p>
                            </div>
                        </label>

                        {/* Content Editor */}
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Start writing here"
                            className="w-full h-96 p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 resize-none text-gray-700"
                        />

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Pricing */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-gray-50 rounded-lg p-6 space-y-6">
                            <div>
                                <h3 className="font-bold text-gray-900 mb-4">
                                    Chapter Price
                                </h3>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="accessType"
                                            value="free"
                                            checked={accessType === "free"}
                                            onChange={() => setAccessType("free")}
                                            className="w-5 h-5"
                                        />
                                        <span className="text-gray-700 font-medium">
                                            Free
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="accessType"
                                            value="paid"
                                            checked={accessType === "paid"}
                                            onChange={() => setAccessType("paid")}
                                            className="w-5 h-5"
                                        />
                                        <span className="text-gray-700 font-medium">
                                            Set Price
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="accessType"
                                            value="followers"
                                            checked={accessType === "followers"}
                                            onChange={() => setAccessType("followers")}
                                            className="w-5 h-5"
                                        />
                                        <span className="text-gray-700 font-medium">
                                            Followers Only
                                        </span>
                                    </label>
                                </div>

                                {accessType === "paid" && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Price
                                        </label>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 text-gray-900 font-medium placeholder-gray-400"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Chapter Number (Optional) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Chapter Number (Optional)
                                </label>
                                <input
                                    type="number"
                                    value={chapterNumber}
                                    onChange={(e) => setChapterNumber(e.target.value)}
                                    placeholder="Auto-assigned"
                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 text-gray-900 font-medium placeholder-gray-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
