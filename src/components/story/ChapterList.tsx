"use client";

import Image from "next/image";
import Link from "next/link";
import { Chapter } from "@/lib/useStory";
import { imageUrl } from "@/lib/config";
import { BookOpen, Lock } from "lucide-react";

interface ChapterListProps {
    chapters: Chapter[];
    storyId: string;
}

const stripHtml = (html: string) => {
    if (!html) return "";
    // Remove HTML tags
    const tmp = html.replace(/<[^>]*>?/gm, " ");
    // Decode basic entities and clean up whitespace
    return tmp
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

export default function ChapterList({ chapters, storyId }: ChapterListProps) {
    const publishedChapters = chapters.filter((ch) => ch.isPublished);

    if (publishedChapters.length === 0) {
        return (
            <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Chapters Published</h2>
                <p className="text-gray-500 max-w-xs mx-auto">
                    The author hasn't published any chapters for this story yet. Check back soon!
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
                        className="block p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                    >
                        {/* Hover effect background */}
                        <div className="absolute inset-0 bg-linear-to-r from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="relative flex flex-col sm:flex-row items-start gap-5">
                            {/* Image and Main Info */}
                            <div className="flex items-start gap-4 flex-1 min-w-0 w-full">
                                {chapter.coverImage ? (
                                    <div className="w-20 h-20 sm:w-28 sm:h-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 shadow-inner">
                                        <Image 
                                            src={imageUrl(chapter.coverImage) || '/logo.png'} 
                                            alt={chapter.title} 
                                            width={160} 
                                            height={112} 
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                                        />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 sm:w-28 sm:h-20 shrink-0 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-[10px] text-gray-400 border border-gray-100">
                                        <BookOpen className="w-5 h-5 mb-1 opacity-20" />
                                        No Cover
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                                            Chapter {chapter.chapterNumber}
                                        </span>
                                        {idx === 0 && (
                                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                                                New
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg sm:text-xl truncate group-hover:text-purple-600 transition-colors mb-1">
                                        {chapter.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                                        {stripHtml(chapter.content || "")}
                                    </p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                                            <span>{chapter.wordCount?.toLocaleString() || 0} words</span>
                                        </div>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                                            <span>{Math.max(1, Math.ceil((chapter.wordCount || 0) / 200))} min read</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price and Action */}
                            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-gray-50 gap-4">
                                {chapter.accessType === "paid" ? (
                                    <div className="px-4 py-2 rounded-xl bg-amber-50 text-amber-800 font-black flex items-center gap-2 border border-amber-100 shadow-sm">
                                        <Lock className="w-4 h-4 text-amber-600" />
                                        <span className="text-sm">{chapter.currency === 'USD' ? '$' : '₹'}{chapter.price}</span>
                                    </div>
                                ) : (
                                    <div className="px-4 py-2 rounded-xl bg-green-50 text-green-700 font-black text-sm border border-green-100 shadow-sm">
                                        FREE
                                    </div>
                                )}
                                
                                <div className="text-purple-600 font-black text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    READ <span className="hidden sm:inline">CHAPTER</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
