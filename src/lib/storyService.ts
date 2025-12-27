export async function createStory(data: {
    title: string;
    description?: string;
    cover?: File | null;
    isDraft?: boolean;
}) {
    const formData = new FormData();
    formData.append('title', data.title ?? 'Untitled');
    formData.append('description', data.description ?? '');
    formData.append('isDraft', String(data.isDraft ?? true));
    if (data.cover) formData.append('cover', data.cover);

    // Get auth token if available
    const token = localStorage.getItem('authToken');

    console.log('[createStory] FormData entries:');
    Array.from(formData.entries()).forEach(([k, v]) => {
        if (v instanceof File) {
            console.log(`  - ${k}: File(${v.name}, ${v.size} bytes)`);
        } else {
            console.log(`  - ${k}: ${v}`);
        }
    });

    // Send with Authorization header if available
    const res = await fetch(`/api/stories`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData as unknown as BodyInit,
    });

    if (!res.ok) {
        const text = await res.text();
        let json;
        try { json = JSON.parse(text); } catch { json = { message: text }; }
        throw new Error(json?.message || json?.error || `Request failed: ${res.status}`);
    }

    const result = await res.json();
    return result;
}

export async function createChapter(storyId: string, data: {
    title: string;
    content: string;
    chapterNumber?: number | string;
    isDraft?: boolean;
    image?: File | null;
    accessType?: 'free' | 'paid' | 'followers';
    price?: number;
}) {
    if (!storyId) throw new Error('storyId is required');

    const formData = new FormData();
    formData.append('title', data.title ?? 'Untitled');
    formData.append('content', data.content ?? '');
    if (data.chapterNumber !== undefined && data.chapterNumber !== null) formData.append('chapterNumber', String(data.chapterNumber));
    formData.append('accessType', data.accessType || 'free');
    if (data.price) formData.append('price', String(data.price));
    if (data.image) formData.append('cover', data.image);  // Match backend: field name is 'cover'

    // Get auth token if available
    const token = localStorage.getItem('authToken');


    Array.from(formData.entries()).forEach(([k, v]) => {
        if (v instanceof File) {
            console.log(`  - ${k}: File(${v.name}, ${v.size} bytes)`);
        } else {
            console.log(`  - ${k}: ${v}`);
        }
    });

    // Send with Authorization header if available
    const res = await fetch(`/api/stories/${encodeURIComponent(storyId)}/chapters`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData as unknown as BodyInit,
    });


    if (!res.ok) {
        const text = await res.text();
        let json;
        try { json = JSON.parse(text); } catch { json = { message: text }; }
        throw new Error(json?.message || json?.error || `Request failed: ${res.status}`);
    }

    const result = await res.json();
    return result;
}

import { imageUrl } from './config';

function normalizeImageFields(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    const keys = ['cover', 'coverImage', 'image', 'thumbnail', 'coverUrl', 'imageUrl'];
    for (const k of keys) {
        if (k in obj && typeof obj[k] === 'string' && obj[k]) {
            obj[k] = imageUrl(obj[k]) || obj[k];
        }
    }
    // also handle arrays of items
    if (Array.isArray(obj)) {
        return obj.map(normalizeImageFields);
    }
    // normalize nested arrays/objects commonly used like data.items or results
    for (const k of Object.keys(obj)) {
        if (typeof obj[k] === 'object' && obj[k] !== null) {
            obj[k] = normalizeImageFields(obj[k]);
        }
    }
    return obj;
}

export async function getStoriesByAuthor(authorId: string, page?: number, limit?: number) {
    if (!authorId) throw new Error('authorId is required');

    const params = new URLSearchParams();
    if (page !== undefined && page !== null) params.set('page', String(page));
    if (limit !== undefined && limit !== null) params.set('limit', String(limit));

    const qs = params.toString() ? `?${params.toString()}` : '';
    const url = `/api/stories/user/${encodeURIComponent(authorId)}${qs}`;

    // Fetch author stories without Authorization header
    const res = await fetch(url, { method: 'GET' });

    if (!res.ok) {
        const text = await res.text();
        let json;
        try { json = JSON.parse(text); } catch { json = { message: text }; }
        throw new Error(json?.message || `Request failed: ${res.status}`);
    }

    const json = await res.json();
    return normalizeImageFields(json);
}
