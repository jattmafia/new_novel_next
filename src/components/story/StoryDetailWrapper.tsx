"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { useStory, useChapters } from "@/lib/useStory";
import StoryHeader from "./StoryHeader";
import ChapterList from "./ChapterList";
import Spinner from "@/components/Spinner";

interface StoryDetailWrapperProps {
    params: Promise<{
        username: string;
        storyId: string;
        storyTitle?: string;
    }> | {
        username: string;
        storyId: string;
        storyTitle?: string;
    };
    children: ReactNode;
}

export default function StoryDetailWrapper({
    params,
    children,
}: StoryDetailWrapperProps) {
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

    const storyId = paramsData?.storyId || "";
    const username = paramsData?.username || "";

    // Call hooks always, regardless of loading state
    const { story, loading: storyLoading, error: storyError } =
        useStory(storyId);
    const { chapters, loading: chaptersLoading } = useChapters(storyId);

    // Handle loading and error states
    if (paramsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (storyLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (storyError || !story) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">
                        Story Not Found
                    </h1>
                    <p className="text-gray-600">
                        {storyError || "This story doesn't exist or has been deleted."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Story Header */}
            <StoryHeader story={story} chapterCount={chapters.length} username={username} />

            {/* Main Content - Centered */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Chapter Content or Default View */}
                <div className="prose max-w-none mx-auto">{children}</div>

                {/* Chapters List */}
                {chaptersLoading ? (
                    <div className="flex justify-center mt-8">
                        <Spinner />
                    </div>
                ) : (
                    <ChapterList chapters={chapters} storyId={storyId} />
                )}
            </div>
        </div>
    );
}
