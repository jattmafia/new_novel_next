"use client";

import { useState, useEffect } from "react";

export interface Story {
    _id: string;
    authorId: string;
    title: string;
    description: string;
    coverImage: string;
    visibility: string;
    chapterCount: number;
    viewCount: number;
    likeCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface Chapter {
    _id: string;
    storyId: string;
    authorId: string;
    chapterNumber: number;
    title: string;
    content: string;
    coverImage?: string;
    wordCount: number;
    accessType: string;
    price?: number;
    currency?: string;
    isPublished: boolean;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
}

export function useStory(storyId: string) {
    const [story, setStory] = useState<Story | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Only fetch if storyId is not empty
        if (!storyId) {
            setLoading(false);
            return;
        }

        const fetchStory = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `/api/stories/${storyId}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch story");
                }

                const data = await response.json();
                // Handle different response formats
                const storyData = data.story || data.data || data;
                setStory(storyData);
                setError(null);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "An error occurred"
                );
                setStory(null);
            } finally {
                setLoading(false);
            }
        };

        fetchStory();
    }, [storyId]);

    return { story, loading, error };
}

export function useChapters(storyId: string, token?: string) {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!storyId) {
            setLoading(false);
            return;
        }

        const fetchChapters = async () => {
            try {
                setLoading(true);
                const headers: Record<string, string> = {
                    "Accept": "application/json",
                };

                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                }

                const response = await fetch(
                    `/api/stories/${storyId}/chapters`,
                    { headers }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch chapters");
                }

                const data = await response.json();
                // Handle different response formats
                const chaptersData = data.chapters || data.data || data;
                setChapters(Array.isArray(chaptersData) ? chaptersData : []);
                setError(null);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "An error occurred"
                );
                setChapters([]);
            } finally {
                setLoading(false);
            }
        };

        fetchChapters();
    }, [storyId, token]);

    return { chapters, loading, error };
}

export function useChapter(storyId: string, chapterId: string, token?: string) {
    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Only fetch if both IDs are provided
        if (!storyId || !chapterId) {
            setLoading(false);
            return;
        }

        const fetchChapter = async () => {
            try {
                setLoading(true);
                const headers: Record<string, string> = {
                    "Accept": "application/json",
                };

                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                }


                const response = await fetch(
                    `/api/stories/${storyId}/chapters/${chapterId}`,
                    { headers }
                );


                if (!response.ok) {
                    throw new Error(`Failed to fetch chapter (${response.status})`);
                }

                const data = await response.json();

                // Handle different response formats
                const chapterData = data.chapter || data.data || data;

                setChapter(chapterData);
                setError(null);
            } catch (err) {
                console.error("useChapter error:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "An error occurred"
                );
                setChapter(null);
            } finally {
                setLoading(false);
            }
        };

        fetchChapter();
    }, [storyId, chapterId, token]);

    return { chapter, loading, error };
}
