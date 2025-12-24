"use client";

import { useChapter, useChapters } from "@/lib/useStory";
import Spinner from "@/components/Spinner";
import ChapterNav from "./ChapterNav";
import { useEffect, useState, useRef } from "react";
import { Settings, Maximize2, Minimize2, Sun, Moon, Coffee, Type, ChevronDown, Play, Pause, ArrowUp } from "lucide-react";
import Link from "next/link";

interface ChapterReaderProps {
    params: Promise<{
        username: string;
        storyId: string;
        chapterId: string;
    }> | {
        username: string;
        storyId: string;
        chapterId: string;
    };
}

export default function ChapterReader({ params }: ChapterReaderProps) {
    const [paramsData, setParamsData] = useState<any>(null);
    const [paramsLoading, setParamsLoading] = useState(true);
    const [fontSize, setFontSize] = useState(18);
    const [lineHeight, setLineHeight] = useState(1.6);
    const [fontColor, setFontColor] = useState("");
    const [theme, setTheme] = useState("light"); // light, dark, sepia
    const [fontFamily, setFontFamily] = useState("serif"); // serif, sans, mono
    const [showSettings, setShowSettings] = useState(false);
    const [showChapterList, setShowChapterList] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isAutoScrolling, setIsAutoScrolling] = useState(false);
    const [scrollSpeed, setScrollSpeed] = useState(1);
    const scrollInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const currentProgress = (window.scrollY / totalHeight) * 100;
            setProgress(currentProgress);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isAutoScrolling) {
            scrollInterval.current = setInterval(() => {
                window.scrollBy(0, scrollSpeed);
            }, 50);
        } else {
            if (scrollInterval.current) clearInterval(scrollInterval.current);
        }
        return () => {
            if (scrollInterval.current) clearInterval(scrollInterval.current);
        };
    }, [isAutoScrolling, scrollSpeed]);

    useEffect(() => {
        const resolveParams = async () => {
            const resolved = await Promise.resolve(params);
            setParamsData(resolved);
            setParamsLoading(false);
        };
        resolveParams();
    }, [params]);

    // Call hooks unconditionally (before any early returns)
    const storyId = paramsData?.storyId || "";
    const chapterId = paramsData?.chapterId || "";
    const { chapter, loading, error } = useChapter(storyId, chapterId);
    const { chapters } = useChapters(storyId || "");

    useEffect(() => {
        // Mark chapter as read
        const markAsRead = async () => {
            try {
                await fetch(`/api/chapters/${chapterId}/read`, {
                    method: "POST",
                });
            } catch (err) {
                console.error("Failed to mark as read:", err);
            }
        };

        if (chapter && chapterId) {
            markAsRead();
        }
    }, [chapterId, chapter]);

    if (paramsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    if (error || !chapter) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">
                        Chapter Not Found
                    </h1>
                    <p className="text-gray-600">
                        {error || "This chapter doesn't exist or has been deleted."}
                    </p>
                </div>
            </div>
        );
    }

    const currentChapterIndex = chapters.findIndex((ch) => ch._id === chapterId);
    const prevChapter = currentChapterIndex > 0 ? chapters[currentChapterIndex - 1] : null;
    const nextChapter = currentChapterIndex < chapters.length - 1 ? chapters[currentChapterIndex + 1] : null;

    // Helper to format content if it's plain text
    const formattedContent = chapter.content.includes('<') && chapter.content.includes('>')
        ? chapter.content
        : chapter.content.split('\n').map(p => `<p>${p}</p>`).join('');

    const themes: Record<string, { bg: string; text: string; card: string; border: string }> = {
        light: { bg: "bg-gray-50", text: "text-gray-800", card: "bg-white", border: "border-gray-200" },
        dark: { bg: "bg-slate-950", text: "text-slate-200", card: "bg-slate-900", border: "border-slate-800" },
        sepia: { bg: "bg-[#f4ecd8]", text: "text-[#5b4636]", card: "bg-[#fdf6e3]", border: "border-[#e6dbb2]" },
    };

    const fonts: Record<string, string> = {
        serif: "font-serif",
        sans: "font-sans",
        mono: "font-mono",
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${themes[theme].bg} ${themes[theme].text}`}>
            {/* Chapter Header */}
            {!isFullScreen && (
                <div className={`border-b ${themes[theme].border} py-12 bg-linear-to-br from-purple-50/50 to-amber-50/50`}>
                    <div className="max-w-3xl mx-auto px-4">
                        <div className="mb-3 flex items-center gap-2 text-purple-600 font-semibold text-sm uppercase tracking-wide">
                            <span>Ch. {chapter.chapterNumber}</span>
                            <span>•</span>
                            <span>{chapter.wordCount.toLocaleString()} words</span>
                        </div>
                        <h1 className={`text-5xl md:text-6xl font-black mb-4 leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {chapter.title}
                        </h1>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-gray-500 text-sm">
                            <span>
                                Published {new Date(chapter.publishedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                            {chapter.accessType === "paid" && (
                                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-semibold text-xs">
                                    💎 Premium Chapter
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Reading Controls */}
            <div className={`sticky top-0 z-30 border-b backdrop-blur-md ${themes[theme].card} ${themes[theme].border} shadow-sm`}>
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 h-1 bg-purple-600 transition-all duration-150" style={{ width: `${progress}%` }} />

                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Chapter Quick Switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setShowChapterList(!showChapterList)}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-black/5 rounded-lg transition-colors text-sm font-bold"
                            >
                                <span>Ch. {chapter.chapterNumber}</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${showChapterList ? 'rotate-180' : ''}`} />
                            </button>

                            {showChapterList && (
                                <div className={`absolute left-0 mt-2 w-64 max-h-96 overflow-y-auto p-2 rounded-xl shadow-2xl border ${themes[theme].card} ${themes[theme].border} z-50 animate-in fade-in slide-in-from-top-2`}>
                                    <div className="space-y-1">
                                        {chapters.filter(ch => ch.isPublished).map((ch) => (
                                            <Link
                                                key={ch._id}
                                                href={`/story/${storyId}/chapter/${ch._id}`}
                                                className={`block px-4 py-3 rounded-lg text-sm transition-all ${ch._id === chapterId ? 'bg-purple-600 text-white' : 'hover:bg-black/5'}`}
                                                onClick={() => setShowChapterList(false)}
                                            >
                                                <div className="font-bold">Chapter {ch.chapterNumber}</div>
                                                <div className={`text-xs truncate ${ch._id === chapterId ? 'text-purple-100' : 'text-gray-500'}`}>{ch.title}</div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="hidden md:flex items-center gap-1 bg-black/5 rounded-lg p-1">
                            <button
                                onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                                className="p-2 hover:bg-black/5 rounded transition-colors"
                                title="Decrease font size"
                            >
                                <Type className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-sm font-bold min-w-8 text-center">
                                {fontSize}
                            </span>
                            <button
                                onClick={() => setFontSize(Math.min(32, fontSize + 1))}
                                className="p-2 hover:bg-black/5 rounded transition-colors"
                                title="Increase font size"
                            >
                                <Type className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="hidden lg:flex items-center gap-1 bg-black/5 rounded-lg p-1">
                            <button
                                onClick={() => setTheme("light")}
                                className={`p-2 rounded transition-all ${theme === "light" ? "bg-white shadow-sm text-purple-600" : "hover:bg-black/5"}`}
                                title="Light Theme"
                            >
                                <Sun className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setTheme("sepia")}
                                className={`p-2 rounded transition-all ${theme === "sepia" ? "bg-[#fdf6e3] shadow-sm text-amber-700" : "hover:bg-black/5"}`}
                                title="Sepia Theme"
                            >
                                <Coffee className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setTheme("dark")}
                                className={`p-2 rounded transition-all ${theme === "dark" ? "bg-slate-800 shadow-sm text-blue-400" : "hover:bg-black/5"}`}
                                title="Dark Theme"
                            >
                                <Moon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Reading Time Remaining */}
                        <div className="hidden sm:block text-[10px] font-bold uppercase tracking-tighter opacity-40 text-right leading-none">
                            <div>{Math.max(0, Math.ceil((chapter.wordCount * (1 - progress / 100)) / 200))} min</div>
                            <div>left</div>
                        </div>

                        {/* Auto-scroll Toggle */}
                        <button
                            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                            className={`p-2 rounded-lg transition-colors ${isAutoScrolling ? 'bg-purple-600 text-white' : 'hover:bg-black/5'}`}
                            title={isAutoScrolling ? "Stop Auto-scroll" : "Start Auto-scroll"}
                        >
                            {isAutoScrolling ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>

                        <button
                            onClick={() => setIsFullScreen(!isFullScreen)}
                            className="p-2 hover:bg-black/5 rounded-lg transition-colors"
                            title={isFullScreen ? "Exit Focus Mode" : "Focus Mode"}
                        >
                            {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className={`p-2 hover:bg-black/5 rounded-lg transition-colors ${showSettings ? 'bg-black/5' : ''}`}
                                title="Settings"
                            >
                                <Settings className="w-5 h-5" />
                            </button>

                            {showSettings && (
                                <div className={`absolute right-0 mt-2 w-64 p-4 rounded-xl shadow-2xl border ${themes[theme].card} ${themes[theme].border} z-50 animate-in fade-in slide-in-from-top-2`}>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider opacity-50 mb-3 block">Typography</label>
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex justify-between text-xs mb-2">
                                                        <span>Font Size</span>
                                                        <span>{fontSize}px</span>
                                                    </div>
                                                    <input
                                                        type="range" min="12" max="32" value={fontSize}
                                                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                                                        className="w-full accent-purple-600"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-xs mb-2">
                                                        <span>Line Height</span>
                                                        <span>{lineHeight}</span>
                                                    </div>
                                                    <input
                                                        type="range" min="1.2" max="2.4" step="0.1" value={lineHeight}
                                                        onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                                                        className="w-full accent-purple-600"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider opacity-50 mb-3 block">Font Family</label>
                                            <div className="grid grid-cols-3 gap-1 bg-black/5 p-1 rounded-lg">
                                                {Object.keys(fonts).map((f) => (
                                                    <button
                                                        key={f}
                                                        onClick={() => setFontFamily(f)}
                                                        className={`px-2 py-1.5 rounded-md text-xs capitalize transition-all ${fontFamily === f ? 'bg-white shadow-sm text-purple-600' : 'hover:bg-black/5'}`}
                                                    >
                                                        {f}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider opacity-50 mb-3 block">Font Color</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={fontColor || (theme === 'dark' ? '#e2e8f0' : theme === 'sepia' ? '#5b4636' : '#1f2937')}
                                                    onChange={(e) => setFontColor(e.target.value)}
                                                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none"
                                                />
                                                <button
                                                    onClick={() => setFontColor("")}
                                                    className="text-xs font-bold text-purple-600 hover:underline"
                                                >
                                                    Reset to Theme
                                                </button>
                                            </div>
                                        </div>

                                        {isAutoScrolling && (
                                            <div>
                                                <label className="text-xs font-bold uppercase tracking-wider opacity-50 mb-3 block">Scroll Speed</label>
                                                <input
                                                    type="range" min="1" max="10" value={scrollSpeed}
                                                    onChange={(e) => setScrollSpeed(parseInt(e.target.value))}
                                                    className="w-full accent-purple-600"
                                                />
                                            </div>
                                        )}

                                        <div className="lg:hidden">
                                            <label className="text-xs font-bold uppercase tracking-wider opacity-50 mb-3 block">Theme</label>
                                            <div className="flex gap-2">
                                                <button onClick={() => setTheme("light")} className={`flex-1 p-2 border rounded-lg ${theme === 'light' ? 'border-purple-600 bg-purple-50' : 'bg-white'}`}><Sun className="w-4 h-4 mx-auto text-gray-800" /></button>
                                                <button onClick={() => setTheme("sepia")} className={`flex-1 p-2 border rounded-lg ${theme === 'sepia' ? 'border-amber-600 bg-amber-50' : 'bg-[#fdf6e3]'}`}><Coffee className="w-4 h-4 mx-auto text-amber-700" /></button>
                                                <button onClick={() => setTheme("dark")} className={`flex-1 p-2 border rounded-lg ${theme === 'dark' ? 'border-blue-600 bg-slate-800' : 'bg-slate-900'}`}><Moon className="w-4 h-4 mx-auto text-white" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Chapter Content */}
            <div className={`py-16 transition-all duration-500 ${isFullScreen ? 'pt-8' : ''}`}>
                <div className="max-w-3xl mx-auto px-6">
                    <article
                        className={`prose prose-lg max-w-none transition-all duration-300 rounded-2xl shadow-xl p-8 md:p-16 ${themes[theme].card} ${!fontColor ? themes[theme].text : ''} ${fonts[fontFamily]}`}
                        style={{
                            fontSize: `${fontSize}px`,
                            lineHeight: lineHeight,
                            color: fontColor || undefined,
                            // Use a custom property for the color to be used in CSS
                            ...(fontColor ? { '--custom-reader-color': fontColor } : {})
                        } as any}
                    >
                        <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
                    </article>
                </div>
            </div>

            {/* Back to Top Button */}
            {progress > 20 && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className={`fixed bottom-8 right-8 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 z-40 ${themes[theme].card} ${themes[theme].border} border`}
                >
                    <ArrowUp className="w-6 h-6" />
                </button>
            )}

            {/* Chapter Navigation */}
            {!isFullScreen && (
                <ChapterNav
                    prevChapter={prevChapter}
                    nextChapter={nextChapter}
                    storyId={storyId}
                />
            )}
        </div>
    );
}
