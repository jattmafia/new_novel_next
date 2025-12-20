"use client";

import Image from "next/image";
import Link from "next/link";
import { Story } from "@/lib/useStory";
import { imageUrl } from "@/lib/config";
import { Heart, Share2 } from "lucide-react";
import { useState, useEffect } from "react";

interface StoryHeaderProps {
    story: Story;
    chapterCount: number;
    username: string;
}

export default function StoryHeader({
    story,
    chapterCount,
    username,
}: StoryHeaderProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [isAuthor, setIsAuthor] = useState(false);

    useEffect(() => {
        // Check if current user is the author
        const storedUsername = localStorage.getItem("webnovelUsername");
        if (storedUsername) {
            setIsAuthor(storedUsername === username);
        }
    }, [username]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: story.title,
                    text: story.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Share cancelled");
            }
        } else {
            // Fallback: Copy to clipboard
            await navigator.clipboard.writeText(window.location.href);
            alert("Story link copied to clipboard!");
        }
    };

    return (
        <div>
            {/* Hero / Cover */}
            {story.coverImage ? (
                <div className="relative w-full h-screen max-h-[600px] overflow-hidden group">
                    <div className="absolute inset-0 transform-gpu transition-transform duration-1000 group-hover:scale-110 will-change-transform">
                        <Image
                            src={imageUrl(story.coverImage) || '/logo.png'}
                            alt={story.title}
                            fill
                            className="object-cover brightness-50 group-hover:brightness-60 transition-all duration-700"
                            priority
                        />
                    </div>

                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/40 to-black/80" />
                    <div className="absolute inset-0 bg-linear-to-r from-purple-600/20 via-transparent to-amber-600/20" />

                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
                        <div className="max-w-4xl mx-auto px-8">
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white drop-shadow-2xl leading-none mb-6">{story.title}</h1>
                            <p className="text-lg md:text-xl text-white/90 mt-4 max-w-3xl mx-auto drop-shadow-lg">{story.description}</p>

                            {isAuthor && (
                                <div className="mt-10">
                                    <Link href={`/${username}/story/${story._id}/chapter/new`} className="px-8 py-3 bg-linear-to-r from-purple-600 to-amber-500 text-white rounded-lg font-bold text-base shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-pulse">✨ Write Chapter</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                        <Link href={`/${username}`} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 border border-white/20">
                            <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">{username.charAt(0).toUpperCase()}</div>
                            <div className="text-sm text-white font-semibold">{username}</div>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="bg-linear-to-br from-purple-600 to-amber-500 max-w-4xl mx-auto px-8 py-16 rounded-2xl shadow-2xl m-4">
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">{story.title}</h1>
                    <p className="text-lg text-white/90 drop-shadow-md">{story.description}</p>
                </div>
            )}

            <div className="max-w-4xl mx-auto px-4 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="p-6 bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div className="text-sm font-semibold text-purple-600 uppercase">📚 Chapters</div>
                        <div className="text-4xl font-black text-purple-900 mt-3">{chapterCount}</div>
                    </div>
                    <div className="p-6 bg-linear-to-br from-pink-50 to-pink-100 rounded-2xl border-2 border-pink-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div className="text-sm font-semibold text-pink-600 uppercase">❤️ Likes</div>
                        <div className="text-4xl font-black text-pink-900 mt-3">{story.likeCount}</div>
                    </div>
                    <div className="p-6 bg-linear-to-br from-amber-50 to-amber-100 rounded-2xl border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div className="text-sm font-semibold text-amber-600 uppercase">👁️ Views</div>
                        <div className="text-4xl font-black text-amber-900 mt-3">{story.viewCount}</div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                    {isAuthor && (
                        <Link href={`/${username}/story/${story._id}/chapter/new`} className="px-6 py-3 bg-linear-to-r from-purple-600 to-amber-500 text-white rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                            ✨ Write Chapter
                        </Link>
                    )}

                    {!isAuthor && (
                        <Link href={`/${username}`} className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-xl font-bold bg-white hover:bg-purple-50 transition-all duration-300 transform hover:scale-105">
                            Follow Author
                        </Link>
                    )}

                    <button onClick={() => setIsLiked(!isLiked)} className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 ${isLiked ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                        <Heart className="w-5 h-5" /> {isLiked ? 'Liked' : 'Like'}
                    </button>

                    <button onClick={handleShare} className="px-6 py-3 rounded-xl bg-gray-100 text-gray-900 font-bold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2">
                        <Share2 className="w-5 h-5" /> Share
                    </button>
                </div>
            </div>
        </div>
    );
}
