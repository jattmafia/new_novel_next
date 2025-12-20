"use client";

import Image from "next/image";
import Link from "next/link";
import { Chapter } from "@/lib/useStory";
import { imageUrl } from "@/lib/config";
import { Lock } from "lucide-react";

interface ChapterListProps {
    chapters: Chapter[];
    storyId: string;
}

export default function ChapterList({ chapters, storyId }: ChapterListProps) {
    if (chapters.length === 0) {
        return (
            <div className="py-12 text-center">
                <h2 className="text-lg font-bold mb-2">No Chapters Yet</h2>
                <p className="text-gray-500">
                    No chapters published yet. Check back soon!
                </p>
            </div>
        );
    }

    const publishedChapters = chapters.filter((ch) => ch.isPublished);

    if (publishedChapters.length === 0) {
        return (
            <div className="py-12 text-center">
                <h2 className="text-lg font-bold mb-2">No Published Chapters</h2>
                <p className="text-gray-500">
                    Check back soon for new chapters.
                </p>
            </div>
        );
    }

    return (
        <div id="chapters" className="mt-12">
            <div className="flex items-center gap-2 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">CHAPTERS</h2>
                <span className="text-gray-600 font-semibold">{publishedChapters.length} {publishedChapters.length === 1 ? "CHAPTER" : "CHAPTERS"}</span>
            </div>

            <div className="space-y-4">
                {publishedChapters.map((chapter, idx) => (
                    <Link
                        key={chapter._id}
                        href={`/story/${storyId}/chapter/${chapter._id}`}
                        className="block p-4 bg-white border border-gray-100 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all group"
                    >
                        <div className="flex items-start justify-between gap-4">
                            {chapter.coverImage ? (
                                <div className="w-20 h-14 shrink-0 overflow-hidden rounded-md bg-gray-100 mr-4">
                                    <Image src={imageUrl(chapter.coverImage) || '/logo.png'} alt={chapter.title} width={160} height={112} className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-20 h-14 shrink-0 rounded-md bg-gray-50 mr-4 flex items-center justify-center text-xs text-gray-400">No Image</div>
                            )}

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-gray-500">Ch. {chapter.chapterNumber}</span>
                                    <h3 className="font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors">{chapter.title}</h3>
                                </div>
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{(chapter.content && chapter.content.slice(0, 140)) || ''}</p>
                                <p className="text-xs text-gray-500 mt-2">{chapter.wordCount?.toLocaleString() || 0} words • {Math.max(1, Math.ceil((chapter.wordCount || 0) / 200))} min</p>
                            </div>

                            <div className="flex flex-col items-end gap-3 ml-4">
                                {chapter.accessType === "paid" ? (
                                    <div className="px-3 py-1 rounded-md bg-amber-50 text-amber-800 font-semibold flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-amber-600" />
                                        <span className="text-sm">{chapter.currency === 'USD' ? '$' : '₹'}{chapter.price}</span>
                                    </div>
                                ) : (
                                    <div className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-sm">Free</div>
                                )}

                                <div className="text-sm text-gray-400">{idx === 0 ? 'Latest' : ''}</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
