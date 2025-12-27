import ChapterReader from "@/components/story/ChapterReader";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ username: string; storyId: string; chapterId: string }>;
}) {
    const { storyId, chapterId } = await params;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/stories/${storyId}/chapters`,
            { next: { revalidate: 60 } }
        );

        if (!response.ok) {
            return {
                title: "Chapter Not Found",
                description: "The chapter you're looking for doesn't exist.",
            };
        }

        const data = await response.json();
        // Handle different response formats
        const chaptersArray = data.chapters || data.data || (Array.isArray(data) ? data : []);
        const chapter = chaptersArray.find((ch: any) => ch._id === chapterId);

        if (!chapter) {
            return {
                title: "Chapter Not Found",
                description: "The chapter you're looking for doesn't exist.",
            };
        }

        return {
            title: `${chapter.title} - Rowllr`,
            description: `Chapter ${chapter.chapterNumber}: ${chapter.title}`,
            openGraph: {
                title: chapter.title,
                description: `Chapter ${chapter.chapterNumber}`,
                images: chapter.coverImage ? [chapter.coverImage] : [],
            },
        };
    } catch (error) {
        return {
            title: "Chapter - Rowllr",
            description: "Read amazing chapters on Rowllr.",
        };
    }
}

export default function ChapterPage({
    params,
}: {
    params: Promise<{ username: string; storyId: string; chapterId: string }>;
}) {
    return <ChapterReader params={params} />;
}
