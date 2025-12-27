"use client";

import Link from "next/link";
import { useChapters } from "@/lib/useStory";
import Spinner from "@/components/Spinner";
import { BookOpen, Play } from "lucide-react";
import { useEffect, useState } from "react";

interface StoryPageContentProps {
    params: Promise<{
        storyId: string;
    }> | {
        storyId: string;
    };
}

export default function StoryPageContent({ params }: StoryPageContentProps) {
    const [paramsData, setParamsData] = useState<any>(null);
    const [paramsLoading, setParamsLoading] = useState(true);

    // Handle Promise params
    useEffect(() => {
        const resolveParams = async () => {
            const resolved = await Promise.resolve(params);
            setParamsData(resolved);
            setParamsLoading(false);
        };
        resolveParams();
    }, [params]);

    // Call hooks unconditionally (always)
    const storyId = paramsData?.storyId || "";
    const { chapters, loading } = useChapters(storyId);

    // Filter and handle loading/empty states after hooks
    if (paramsLoading || loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner />
            </div>
        );
    }

    const publishedChapters = chapters.filter((ch) => ch.isPublished);
    const firstChapter = publishedChapters[0];

    if (publishedChapters.length === 0) {
        return (
            <div className="py-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    No Chapters Yet
                </h2>
                <p className="text-gray-600">
                    This story doesn't have any published chapters yet.
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Start Reading CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-8 border-t border-b border-gray-200">
                <span className="text-lg font-semibold text-gray-900">
                    Ready to start reading?
                </span>
                <Link
                    href={`/story/${storyId}/chapter/${firstChapter._id}`}
                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                    <Play className="w-5 h-5" />
                    Read Chapter {firstChapter.chapterNumber}
                </Link>
            </div>
        </>
    );
}
