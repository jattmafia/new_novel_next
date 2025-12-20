"use client";
import React, { useState } from 'react';
import { createChapter } from '../lib/storyService';

interface Props {
    initialStoryId?: string;
    onCreated?: (chapter: any) => void;
}

export default function NewChapterModal({ initialStoryId = '', onCreated }: Props) {
    const [open, setOpen] = useState(false);
    const [storyId, setStoryId] = useState(initialStoryId);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [chapterNumber, setChapterNumber] = useState<string>('');
    const [isDraft, setIsDraft] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!storyId) {
            setError('Please provide a Story ID');
            return;
        }
        setLoading(true);
        try {
            const payload = {
                title,
                content,
                chapterNumber: chapterNumber ? Number(chapterNumber) : undefined,
                isDraft,
                image,
            };
            const result = await createChapter(storyId, payload);
            setLoading(false);
            setOpen(false);
            setTitle(''); setContent(''); setChapterNumber(''); setIsDraft(false); setImage(null);
            if (onCreated) onCreated(result);
            alert('Chapter created successfully');
        } catch (err: any) {
            setLoading(false);
            setError(err?.message || 'Failed to create chapter');
        }
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="px-4 py-2 bg-linear-to-r from-purple-600 to-amber-500 text-white rounded-lg font-semibold hover:shadow-md transition-all text-sm"
            >
                New Chapter
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-2xl bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-900">Create Chapter</h3>
                            <button onClick={() => setOpen(false)} className="text-slate-500">Close</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm text-slate-600">Title</label>
                                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="text-sm text-slate-600">Content</label>
                                <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg min-h-[140px]" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm text-slate-600">Chapter # (optional)</label>
                                    <input value={chapterNumber} onChange={(e) => setChapterNumber(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="text-sm text-slate-600 block">Draft</label>
                                    <div className="mt-1">
                                        <label className="inline-flex items-center">
                                            <input type="checkbox" checked={isDraft} onChange={(e) => setIsDraft(e.target.checked)} className="mr-2" />
                                            <span className="text-sm text-slate-700">Save as draft</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-slate-600">Cover Image (optional)</label>
                                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} className="w-full mt-1" />
                            </div>

                            {error && <div className="text-sm text-red-600">{error}</div>}

                            <div className="flex items-center gap-3 justify-end">
                                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 bg-linear-to-r from-purple-600 to-amber-500 text-white rounded-lg font-semibold">
                                    {loading ? 'Creating...' : 'Create Chapter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
