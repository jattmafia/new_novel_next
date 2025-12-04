import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://209.74.81.116/api';

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
        const body = await request.json();

        // Forward the Authorization header if present
        const auth = request.headers.get('authorization') || '';

        const resp = await proxyPost('/profile/create', body, auth ? { Authorization: auth } : {});

        const data = await resp.json().catch(() => ({ success: false }));

        return NextResponse.json(data, { status: resp.status });
    } catch (err: any) {
        console.error('Proxy profile create error:', err);
        const msg = err?.message || (err?.cause && err.cause.message) || 'Proxy error';
        return NextResponse.json({ success: false, message: msg }, { status: 502 });
    }
}
