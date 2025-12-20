"use client";

import { useChapter, useChapters } from "@/lib/useStory";
import Spinner from "@/components/Spinner";
import ChapterNav from "./ChapterNav";
import { useEffect, useState } from "react";

interface ChapterReaderProps {
    params: Promise<{
        username: string;
        storyId: string;
        chapterId: string;
    }> | {
        username: string;
        storyId: string;
        chapterId: string;
    };
}

export default function ChapterReader({ params }: ChapterReaderProps) {
    const [paramsData, setParamsData] = useState<any>(null);
    const [paramsLoading, setParamsLoading] = useState(true);
    const [fontSize, setFontSize] = useState(18);

    useEffect(() => {
        const resolveParams = async () => {
            const resolved = await Promise.resolve(params);
            setParamsData(resolved);
            setParamsLoading(false);
        };
        resolveParams();
    }, [params]);

    // Call hooks unconditionally (before any early returns)
    const storyId = paramsData?.storyId || "";
    const chapterId = paramsData?.chapterId || "";
    const { chapter, loading, error } = useChapter(storyId, chapterId);
    const { chapters } = useChapters(storyId || "");

    useEffect(() => {
        // Mark chapter as read
        const markAsRead = async () => {
            try {
                await fetch(`/api/chapters/${chapterId}/read`, {
                    method: "POST",
                });
            } catch (err) {
                console.error("Failed to mark as read:", err);
            }
        };

        if (chapter && chapterId) {
            markAsRead();
        }
    }, [chapterId, chapter]);

    if (paramsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    if (error || !chapter) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">
                        Chapter Not Found
                    </h1>
                    <p className="text-gray-600">
                        {error || "This chapter doesn't exist or has been deleted."}
                    </p>
                </div>
            </div>
        );
    }

    const currentChapterIndex = chapters.findIndex((ch) => ch._id === chapterId);
    const prevChapter = currentChapterIndex > 0 ? chapters[currentChapterIndex - 1] : null;
    const nextChapter = currentChapterIndex < chapters.length - 1 ? chapters[currentChapterIndex + 1] : null;

    return (
        <div className="bg-white">
            {/* Chapter Header */}
            <div className="border-b border-gray-200 py-12 bg-linear-to-br from-purple-50 to-amber-50">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="mb-3 flex items-center gap-2 text-purple-600 font-semibold text-sm uppercase tracking-wide">
                        <span>Ch. {chapter.chapterNumber}</span>
                        <span>•</span>
                        <span>{chapter.wordCount.toLocaleString()} words</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 leading-tight">
                        {chapter.title}
                    </h1>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-gray-600 text-sm">
                        <span>
                            Published {new Date(chapter.publishedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                        {chapter.accessType === "paid" && (
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-semibold text-xs">
                                💎 Premium Chapter
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Reading Controls */}
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                        <button
                            onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                            className="px-3 py-1 text-gray-700 hover:bg-gray-200 rounded transition-colors text-sm font-semibold"
                            title="Decrease font size"
                        >
                            A−
                        </button>
                        <span className="px-3 text-gray-700 text-sm font-semibold min-w-12 text-center">
                            {fontSize}
                        </span>
                        <button
                            onClick={() => setFontSize(Math.min(28, fontSize + 2))}
                            className="px-3 py-1 text-gray-700 hover:bg-gray-200 rounded transition-colors text-sm font-semibold"
                            title="Increase font size"
                        >
                            A+
                        </button>
                    </div>
                    <div className="text-xs text-gray-500 font-semibold">
                        Reading Time: {Math.max(1, Math.ceil(chapter.wordCount / 200))} min
                    </div>
                </div>
            </div>

            {/* Chapter Content */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-3xl mx-auto px-6">
                    <article
                        className="prose prose-lg max-w-none text-justify leading-relaxed text-gray-800 bg-white rounded-2xl shadow-lg p-12"
                        style={{ fontSize: `${fontSize}px` }}
                    >
                        {chapter.content.split("\n").map((paragraph, index) => (
                            paragraph.trim() && (
                                <p key={index} className="mb-6">
                                    {paragraph}
                                </p>
                            )
                        ))}
                    </article>
                </div>
            </div>

            {/* Chapter Navigation */}
            <ChapterNav
                prevChapter={prevChapter}
                nextChapter={nextChapter}
                storyId={storyId}
            />
        </div>
    );
}
