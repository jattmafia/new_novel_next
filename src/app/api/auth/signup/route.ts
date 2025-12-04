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

async function proxyPost(path: string, body: any) {
    // retry once on timeout/connect issues
    const url = `${API_BASE}${path}`;
    try {
        const resp = await fetchWithTimeout(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        }, 15000);
        return resp;
    } catch (err) {
        // second attempt
        return await fetchWithTimeout(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        }, 20000);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const resp = await proxyPost('/auth/signup', body);

        const data = await resp.json().catch(() => ({ success: false }));

        return NextResponse.json(data, { status: resp.status });
    } catch (err: any) {
        console.error('Proxy signup error:', err);
        const msg = err?.message || (err?.cause && err.cause.message) || 'Proxy error';
        return NextResponse.json({ success: false, message: msg }, { status: 502 });
    }
}
