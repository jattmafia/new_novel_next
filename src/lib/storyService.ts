export async function createChapter(storyId: string, data: {
    title: string;
    content: string;
    chapterNumber?: number | string;
    isDraft?: boolean;
    image?: File | null;
}) {
    if (!storyId) throw new Error('storyId is required');

    const formData = new FormData();
    formData.append('title', data.title ?? 'Untitled');
    formData.append('content', data.content ?? '');
    if (data.chapterNumber !== undefined && data.chapterNumber !== null) formData.append('chapterNumber', String(data.chapterNumber));
    formData.append('isDraft', data.isDraft ? 'true' : 'false');
    if (data.image) formData.append('image', data.image);

    // Send without Authorization header (use backend without auth)
    const res = await fetch(`/api/stories/${encodeURIComponent(storyId)}/chapters`, {
        method: 'POST',
        body: formData as unknown as BodyInit,
    });

    if (!res.ok) {
        const text = await res.text();
        let json;
        try { json = JSON.parse(text); } catch { json = { message: text }; }
        throw new Error(json?.message || `Request failed: ${res.status}`);
    }

    return res.json();
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

export async function createStory(data: {
    title: string;
    description?: string;
    isDraft?: boolean;
    cover?: File | null;
}) {
    if (!data?.title) throw new Error('title is required');

    // If cover is provided, send as FormData (multipart). Do not include Authorization.
    if (data.cover) {
        const form = new FormData();
        form.append('title', data.title);
        form.append('description', data.description ?? '');
        form.append('isDraft', data.isDraft ? 'true' : 'false');
        // Append the uploaded file under multiple common field names so backends
        // that expect different keys (e.g. 'image', 'file', 'cover') will receive it.
        form.append('cover', data.cover);
        form.append('image', data.cover);
        form.append('file', data.cover);

        const res = await fetch('/api/stories', {
            method: 'POST',
            body: form as unknown as BodyInit,
        });

        if (!res.ok) {
            const text = await res.text();
            let json;
            try { json = JSON.parse(text); } catch { json = { message: text }; }
            throw new Error(json?.message || `Request failed: ${res.status}`);
        }

        const json = await res.json();
        return normalizeImageFields(json);
    }

    const res = await fetch('/api/stories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: data.title,
            description: data.description ?? '',
            isDraft: !!data.isDraft,
        }),
    });

    if (!res.ok) {
        const text = await res.text();
        let json;
        try { json = JSON.parse(text); } catch { json = { message: text }; }
        throw new Error(json?.message || `Request failed: ${res.status}`);
    }

    const json = await res.json();
    return normalizeImageFields(json);
}
