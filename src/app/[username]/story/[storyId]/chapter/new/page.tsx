"use client";

import ChapterEditor from "@/components/story/ChapterEditor";
import { useParams } from "next/navigation";

export default function NewChapterPage() {
    const params = useParams();
    const username = params.username as string;
    const storyId = params.storyId as string;

    return <ChapterEditor storyId={storyId} username={username} />;
}
