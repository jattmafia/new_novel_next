import { API_BASE } from '@/lib/config';
import { NextResponse } from 'next/server';

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

export async function GET(request: Request, context: any) {
    const params = context?.params instanceof Promise ? await context.params : context?.params;
    const { storyId } = params ?? {};

    if (!storyId) {
        return NextResponse.json({ message: 'Story ID is required' }, { status: 400 });
    }

    try {
        const auth = request.headers.get('authorization') || '';

        const forwardRes = await fetch(`${API_BASE}/stories/${storyId}/chapters`, {
            method: 'GET',
            headers: auth ? { Authorization: auth } : undefined,
        });

        const forwardBody = await forwardRes.json();

        return NextResponse.json(forwardBody, { status: forwardRes.status });
    } catch (err: any) {
        return NextResponse.json(
            { message: err?.message || 'Internal error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request, context: any) {
    const params = context?.params instanceof Promise ? await context.params : context?.params;
    const { storyId } = params ?? {};

    if (!storyId) {
        return NextResponse.json({ message: 'Story ID is required' }, { status: 400 });
    }

    console.log("[API Route] POST Creating chapter for storyId:", storyId);

    try {
        const auth = request.headers.get('authorization') || '';
        const reqContentType = (request.headers.get('content-type') || '').toLowerCase();

        console.log("[API Route] Request content-type:", reqContentType);
        console.log("[API Route] Auth header present:", !!auth);

        const forwardUrl = `${API_BASE}/stories/${storyId}/chapters`;
        console.log("[API Route] Forwarding to:", forwardUrl);

        // Parse FormData from request
        const formData = await request.formData();
        console.log("[API Route] Parsed FormData:");
        Array.from(formData.entries()).forEach(([key, value]) => {
            if (value instanceof File) {
                console.log(`  - ${key}: File(${value.name}, ${value.size} bytes, type: ${value.type})`);
            } else {
                console.log(`  - ${key}: ${value}`);
            }
        });

        // Forward FormData to backend - do NOT set Content-Type header
        // Let fetch() add it with the correct boundary
        const forwardHeaders = auth ? { Authorization: auth } : {};
        console.log("[API Route] Forward headers:", forwardHeaders);
        console.log("[API Route] Sending FormData to backend...");

        const forwardRes = await fetchWithTimeout(forwardUrl, {
            method: 'POST',
            headers: forwardHeaders,
            body: formData as unknown as BodyInit,
        }, 20000);

        console.log("[API Route] Backend response status:", forwardRes.status);

        const forwardContentType = forwardRes.headers.get('content-type') || 'application/json';
        const forwardBody = await forwardRes.arrayBuffer();

        if (!forwardRes.ok) {
            const text = new TextDecoder().decode(forwardBody);
            console.log("[API Route] Backend error response:", text);
        } else {
            console.log("[API Route] Backend success");
        }

        return new Response(forwardBody, {
            status: forwardRes.status,
            headers: { 'content-type': forwardContentType },
        });
    } catch (err: any) {
        console.error("[API Route] Error:", err.message, err);
        return NextResponse.json({ message: err?.message || 'Internal error' }, { status: 500 });
    }
}
