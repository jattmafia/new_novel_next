"use client";
import { useState } from 'react';
import { createStory } from '@/lib/storyService';

export default function NewStoryModal({ onCreated }: { onCreated?: (data: any) => void }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isDraft, setIsDraft] = useState(true);
    const [cover, setCover] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!title.trim()) return setError('Title is required');
        setLoading(true);
        try {
            const res = await createStory({ title: title.trim(), description: description.trim(), isDraft, cover });
            setOpen(false);
            setTitle('');
            setDescription('');
            setIsDraft(true);
            setCover(null);
            if (onCreated) {
                onCreated(res);
            } else {
                // default behaviour: reload page so server-rendered profile shows new story
                if (typeof window !== 'undefined') window.location.reload();
            }
        } catch (err: any) {
            setError(err?.message || 'Create failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <button onClick={() => setOpen(true)} className="px-6 py-2.5 border-2 border-purple-300 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 hover:border-purple-400 transition-all text-sm">
                New Story
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4">Create New Story</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Title</label>
                                <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-lg border border-purple-200 px-3 py-2 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full rounded-lg border border-purple-200 px-3 py-2 text-sm" rows={4} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Cover Image (optional)</label>
                                <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] ?? null)} className="mt-1 block w-full text-sm" />
                                {cover && <p className="text-xs text-slate-500 mt-1">Selected: {cover.name}</p>}
                            </div>
                            <div className="flex items-center gap-3">
                                <input id="isDraft" type="checkbox" checked={isDraft} onChange={(e) => setIsDraft(e.target.checked)} />
                                <label htmlFor="isDraft" className="text-sm text-slate-700">Save as Draft</label>
                            </div>

                            {error && <p className="text-sm text-red-600">{error}</p>}

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg border border-slate-200">Cancel</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold">
                                    {loading ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
