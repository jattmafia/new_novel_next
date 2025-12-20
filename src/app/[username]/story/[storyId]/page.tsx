import { ReactNode } from "react";
import StoryDetailWrapper from "@/components/story/StoryDetailWrapper";
import StoryPageContent from "./page.content";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ username: string; storyId: string; storyTitle?: string }>;
}) {
    const { storyId } = await params;

    try {
        const response = await fetch(
            `http://localhost:5000/api/stories/${storyId}`,
            { next: { revalidate: 60 } }
        );

        if (!response.ok) {
            console.log(`[Metadata] API returned status ${response.status}`);
            return {
                title: "Story Not Found",
                description: "The story you're looking for doesn't exist.",
            };
        }

        const data = await response.json();
        console.log("[Metadata] Response data:", JSON.stringify(data).substring(0, 200));

        // Handle different response formats
        const story = data.story || data.data || data;

        if (!story || !story.title) {
            console.log("[Metadata] No story title found in response");
            return {
                title: "Story",
                description: "Read amazing stories on Rowllr.",
            };
        }

        console.log(`[Metadata] Using story title: ${story.title}`);

        return {
            title: `${story.title} - Rowllr`,
            description:
                story.description ||
                "Read amazing stories on Rowllr.",
            openGraph: {
                title: story.title,
                description: story.description,
                images: story.coverImage ? [story.coverImage] : [],
            },
        };
    } catch (error) {
        console.log("[Metadata] Error fetching story:", error);
        return {
            title: "Story - Rowllr",
            description: "Read amazing stories on Rowllr.",
        };
    }
}

export default function StoryPage({
    params,
}: {
    params: Promise<{ username: string; storyId: string; storyTitle?: string }>;
}) {
    return (
        <StoryDetailWrapper params={params}>
            <StoryPageContent params={params} />
        </StoryDetailWrapper>
    );
}
