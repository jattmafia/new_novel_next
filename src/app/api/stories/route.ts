import { NextResponse } from 'next/server';
import { API_BASE } from '@/lib/config';

async function fetchWithTimeout(url: string, opts: any, timeout = 15000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const res = await fetch(url, { ...opts, signal: controller.signal });
        return res;
    } finally {
        clearTimeout(id);
    }
}

async function proxyPost(path: string, body: any, headers: Record<string, string> = {}) {
    const url = `${API_BASE}${path}`;
    try {
        return await fetchWithTimeout(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...headers },
            body: JSON.stringify(body),
        }, 15000);
    } catch (err) {
        return await fetchWithTimeout(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...headers },
            body: JSON.stringify(body),
        }, 20000);
    }
}

export async function POST(request: Request) {
    try {
        const reqContentType = (request.headers.get('content-type') || '').toLowerCase();
        // Forward Authorization header if present
        const auth = request.headers.get('authorization') || '';

        let forwardRes: Response;

        if (reqContentType.includes('multipart/form-data')) {
            // When client sends FormData (with file), forward FormData directly and
            // DO NOT set Content-Type header (fetch will add the proper boundary).
            const formData = await request.formData();
            const url = `${API_BASE}/stories`;
            forwardRes = await fetchWithTimeout(url, {
                method: 'POST',
                headers: auth ? { Authorization: auth } : undefined,
                body: formData as unknown as BodyInit,
            }, 20000);
        } else {
            const body = await request.json();
            forwardRes = await proxyPost('/stories', body, auth ? { Authorization: auth } : {});
        }

        // Preserve backend response body and content-type so callers see exact error messages
        const forwardContentType = forwardRes.headers.get('content-type') || 'application/json';
        const forwardBody = await forwardRes.arrayBuffer();

        return new Response(forwardBody, {
            status: forwardRes.status,
            headers: { 'content-type': forwardContentType },
        });
    } catch (err: any) {
        console.error('Proxy create story error:', err);
        const msg = err?.message || (err?.cause && err.cause.message) || 'Proxy error';
        return NextResponse.json({ success: false, message: msg }, { status: 502 });
    }
}
