"use client";

import Link from "next/link";
import { Chapter } from "@/lib/useStory";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";

interface ChapterNavProps {
    prevChapter: Chapter | null;
    nextChapter: Chapter | null;
    storyId: string;
}

export default function ChapterNav({
    prevChapter,
    nextChapter,
    storyId,
}: ChapterNavProps) {
    return (
        <div className="border-t border-gray-200 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <div className="grid grid-cols-3 gap-4">
                    {/* Previous Chapter */}
                    {prevChapter ? (
                        <Link
                            href={`/story/${storyId}/chapter/${prevChapter._id}`}
                            className="group flex flex-col items-start gap-2 p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
                        >
                            <div className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-purple-600">
                                <ChevronLeft className="w-4 h-4" />
                                <span className="font-semibold">Previous</span>
                            </div>
                            <p className="font-semibold text-gray-900 group-hover:text-purple-600 line-clamp-2 text-sm">
                                Ch. {prevChapter.chapterNumber}: {prevChapter.title}
                            </p>
                        </Link>
                    ) : (
                        <div className="opacity-50 pointer-events-none p-4 bg-gray-100 rounded-lg">
                            <p className="text-sm text-gray-500">Previous</p>
                            <p className="font-semibold text-gray-400 text-sm mt-2">No previous chapter</p>
                        </div>
                    )}

                    {/* Story Home */}
                    <Link
                        href={`/story/${storyId}`}
                        className="group flex flex-col items-center justify-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
                    >
                        <Home className="w-5 h-5 text-gray-600 group-hover:text-purple-600" />
                        <span className="font-semibold text-gray-900 group-hover:text-purple-600 text-sm">
                            Story
                        </span>
                    </Link>

                    {/* Next Chapter */}
                    {nextChapter ? (
                        <Link
                            href={`/story/${storyId}/chapter/${nextChapter._id}`}
                            className="group flex flex-col items-end gap-2 p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
                        >
                            <div className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-purple-600">
                                <span className="font-semibold">Next</span>
                                <ChevronRight className="w-4 h-4" />
                            </div>
                            <p className="font-semibold text-gray-900 group-hover:text-purple-600 line-clamp-2 text-sm text-right">
                                Ch. {nextChapter.chapterNumber}: {nextChapter.title}
                            </p>
                        </Link>
                    ) : (
                        <div className="opacity-50 pointer-events-none p-4 bg-gray-100 rounded-lg">
                            <p className="text-sm text-gray-500">Next</p>
                            <p className="font-semibold text-gray-400 text-sm mt-2">No more chapters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
