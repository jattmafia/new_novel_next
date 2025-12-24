"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createChapter } from "@/lib/storyService";
import { ChevronLeft, Maximize2, Minimize2, Eye, Edit3, Settings } from "lucide-react";
import Spinner from "@/components/Spinner";
import RichTextEditor from "./RichTextEditor";

interface ChapterEditorProps {
    storyId: string;
    username: string;
}

export default function ChapterEditor({ storyId, username }: ChapterEditorProps) {
    const router = useRouter();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [chapterNumber, setChapterNumber] = useState<string>("");
    const [accessType, setAccessType] = useState<"free" | "paid" | "followers">(
        "free"
    );
    const [price, setPrice] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    // Strip HTML tags for word count
    const strippedContent = content.replace(/<[^>]*>/g, ' ').trim();
    const wordCount = strippedContent ? strippedContent.split(/\s+/).filter(Boolean).length : 0;
    const readingTime = Math.ceil(wordCount / 225);

    // Auto-resize textarea (no longer needed for RichTextEditor but keeping for safety if used elsewhere)
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [content]);

    // Check if user is authorized to edit this story
    useEffect(() => {
        const storedUsername = localStorage.getItem("webnovelUsername");

        // If no user is logged in or username doesn't match, redirect to home
        if (!storedUsername || storedUsername !== username) {
            router.push("/");
            return;
        }

        // Load draft from localStorage if exists
        const savedDraft = localStorage.getItem(`draft_${storyId}`);
        if (savedDraft) {
            try {
                const { title: dTitle, content: dContent } = JSON.parse(savedDraft);
                if (!title && dTitle) setTitle(dTitle);
                if (!content && dContent) setContent(dContent);
            } catch (e) {
                console.error("Failed to load draft", e);
            }
        }

        setIsAuthorized(true);
        setIsChecking(false);
    }, [username, router, storyId]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                setSaveStatus("Saved to local storage");
                setTimeout(() => setSaveStatus(null), 2000);
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                setIsFocusMode(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [title, content, storyId, accessType, price, image, chapterNumber]);

    // Auto-save to localStorage
    useEffect(() => {
        if (title || content) {
            const timer = setTimeout(() => {
                try {
                    localStorage.setItem(`draft_${storyId}`, JSON.stringify({ title, content }));
                    setSaveStatus("Draft saved locally");
                    setTimeout(() => setSaveStatus(null), 2000);
                } catch (e) {
                    console.error("Failed to auto-save draft", e);
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [title, content, storyId]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
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
                image,
                accessType,
                price:
                    accessType === "paid" && price ? Number(price) : undefined,
            };

            await createChapter(storyId, payload);

            // Clear local draft on successful save
            localStorage.removeItem(`draft_${storyId}`);

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
        <div className={`min-h-screen ${isFocusMode ? 'bg-gray-50' : 'bg-white'} transition-colors duration-300`}>
            {/* Header */}
            <div className={`border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-md z-40 transition-all ${isFocusMode ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Go back"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="h-6 w-px bg-gray-200" />
                        <p className="text-sm font-medium text-gray-600">
                            {saveStatus || "Writing Chapter"}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsPreviewMode(!isPreviewMode)}
                            className={`p-2 rounded-lg transition-colors ${isPreviewMode ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100 text-gray-600'}`}
                            title={isPreviewMode ? "Back to Editor" : "Preview Chapter"}
                        >
                            {isPreviewMode ? <Edit3 className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => setIsFocusMode(!isFocusMode)}
                            className={`p-2 rounded-lg transition-colors ${isFocusMode ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100 text-gray-600'}`}
                            title={isFocusMode ? "Exit Focus Mode" : "Focus Mode"}
                        >
                            {isFocusMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                        </button>
                        <div className="h-6 w-px bg-gray-200 mx-2" />
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-6 py-2 bg-linear-to-r from-purple-600 to-amber-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50"
                        >
                            {loading ? "Publishing..." : "Publish"}
                        </button>
                    </div>
                </div>
            </div>

            <div className={`max-w-5xl mx-auto px-4 py-12 transition-all ${isFocusMode ? 'max-w-3xl' : ''}`}>
                <div className={`grid grid-cols-1 ${isFocusMode || isPreviewMode ? '' : 'lg:grid-cols-3'} gap-12`}>
                    {/* Main Editor */}
                    <div className={`${isFocusMode || isPreviewMode ? 'max-w-3xl mx-auto w-full' : 'lg:col-span-2'} space-y-8`}>
                        {isPreviewMode ? (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                <h1 className="text-5xl font-black text-gray-900 leading-tight">
                                    {title || "Untitled Chapter"}
                                </h1>
                                {imagePreview && (
                                    <img src={imagePreview} alt="Cover" className="w-full h-64 object-cover rounded-2xl shadow-lg" />
                                )}
                                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed font-serif">
                                    <div dangerouslySetInnerHTML={{ __html: content }} />
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Title */}
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Chapter Title"
                                    className="w-full text-5xl font-black placeholder-gray-200 focus:outline-none bg-transparent border-none p-0"
                                />

                                {/* Cover Image Upload (Hidden in Focus Mode unless image exists) */}
                                {(!isFocusMode || imagePreview) && (
                                    <label className="block group">
                                        <div className="relative border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden min-h-[120px] flex items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-all">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                            {imagePreview ? (
                                                <div className="relative w-full h-48">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <p className="text-white font-semibold flex items-center gap-2">
                                                            <Settings className="w-5 h-5" /> Change Cover
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center p-6">
                                                    <p className="text-gray-400 font-medium">
                                                        Add a chapter cover image
                                                    </p>
                                                    <p className="text-xs text-gray-300 mt-1">Optional but recommended</p>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                )}

                                {/* Content Editor */}
                                <div className="relative group">
                                    <RichTextEditor
                                        content={content}
                                        onChange={setContent}
                                        placeholder="Once upon a time..."
                                    />

                                    {/* Floating Stats */}
                                    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-xl flex items-center gap-6 text-sm font-medium text-gray-500 transition-all ${isFocusMode ? 'opacity-20 hover:opacity-100' : 'opacity-100'}`}>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-900">{wordCount}</span>
                                            <span>words</span>
                                        </div>
                                        <div className="w-px h-4 bg-gray-200" />
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-900">{readingTime}</span>
                                            <span>min read</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium animate-in slide-in-from-bottom-2">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Settings (Hidden in Focus/Preview Mode) */}
                    {!isFocusMode && !isPreviewMode && (
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-8">
                                <div className="bg-gray-50 rounded-2xl p-8 space-y-8 border border-gray-100">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">
                                            Publishing Settings
                                        </h3>

                                        <div className="space-y-4">
                                            {[
                                                { id: 'free', label: 'Free for everyone', desc: 'Public access' },
                                                { id: 'followers', label: 'Followers only', desc: 'Reward your fans' },
                                                { id: 'paid', label: 'Premium access', desc: 'Set a price' }
                                            ].map((type) => (
                                                <label key={type.id} className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${accessType === type.id ? 'border-purple-500 bg-white shadow-sm' : 'border-transparent hover:bg-gray-100'}`}>
                                                    <input
                                                        type="radio"
                                                        name="accessType"
                                                        value={type.id}
                                                        checked={accessType === type.id}
                                                        onChange={() => setAccessType(type.id as any)}
                                                        className="mt-1 w-4 h-4 text-purple-600"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">{type.label}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">{type.desc}</p>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>

                                        {accessType === "paid" && (
                                            <div className="mt-6 animate-in fade-in slide-in-from-top-2">
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                                    Price (USD)
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                                    <input
                                                        type="number"
                                                        value={price}
                                                        onChange={(e) => setPrice(e.target.value)}
                                                        placeholder="0.00"
                                                        min="0"
                                                        step="0.01"
                                                        className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 text-gray-900 font-bold"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="h-px bg-gray-200" />

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                            Chapter Number
                                        </label>
                                        <input
                                            type="number"
                                            value={chapterNumber}
                                            onChange={(e) => setChapterNumber(e.target.value)}
                                            placeholder="Auto-assigned"
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 text-gray-900 font-medium"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-2 italic">
                                            Leave blank to automatically append to the end.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
