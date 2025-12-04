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

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const username = url.searchParams.get('username');

        if (!username) {
            return NextResponse.json({ error: 'Username is required' }, { status: 400 });
        }

        const apiUrl = `${API_BASE}/profile/check-username?username=${encodeURIComponent(username)}`;

        try {
            const resp = await fetchWithTimeout(apiUrl, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }, 15000);

            const data = await resp.json().catch(() => ({ available: false }));
            return NextResponse.json(data, { status: resp.status });
        } catch (err) {
            // Retry with longer timeout
            const resp = await fetchWithTimeout(apiUrl, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }, 20000);

            const data = await resp.json().catch(() => ({ available: false }));
            return NextResponse.json(data, { status: resp.status });
        }
    } catch (err: any) {
        console.error('Proxy check-username error:', err);
        const msg = err?.message || (err?.cause && err.cause.message) || 'Proxy error';
        return NextResponse.json({ error: msg }, { status: 502 });
    }
}
