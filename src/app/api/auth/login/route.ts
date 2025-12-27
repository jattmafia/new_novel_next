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

async function proxyPost(path: string, body: any) {
    const url = `${API_BASE}${path}`;
    try {
        return await fetchWithTimeout(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        }, 15000);
    } catch (err) {
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

        const resp = await proxyPost('/auth/login', body);

        const data = await resp.json().catch(() => ({ success: false }));

        return NextResponse.json(data, { status: resp.status });
    } catch (err: any) {
        console.error('Proxy login error:', err);
        const msg = err?.message || (err?.cause && err.cause.message) || 'Proxy error';
        return NextResponse.json({ success: false, message: msg }, { status: 502 });
    }
}
