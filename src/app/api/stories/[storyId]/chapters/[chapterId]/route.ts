import { API_BASE } from '@/lib/config';
import { NextResponse } from 'next/server';

export async function GET(request: Request, context: any) {
    const params = context?.params instanceof Promise ? await context.params : context?.params;
    const { storyId, chapterId } = params ?? {};

    if (!storyId || !chapterId) {
        return NextResponse.json(
            { message: 'Story ID and Chapter ID are required' },
            { status: 400 }
        );
    }

    try {
        const auth = request.headers.get('authorization') || '';

        console.log(`[API Route] GET /stories/${storyId}/chapters/${chapterId}`);
        console.log(`[API Route] Auth header present:`, !!auth);

        const forwardRes = await fetch(
            `${API_BASE}/stories/${storyId}/chapters/${chapterId}`,
            {
                method: 'GET',
                headers: auth ? { Authorization: auth } : undefined,
            }
        );

        const forwardBody = await forwardRes.json();

        console.log(`[API Route] Backend response status:`, forwardRes.status);
        console.log(`[API Route] Backend response body:`, JSON.stringify(forwardBody, null, 2));

        return NextResponse.json(forwardBody, { status: forwardRes.status });
    } catch (err: any) {
        console.error('[API Route] GET chapter error:', err);
        return NextResponse.json(
            { message: err?.message || 'Internal error' },
            { status: 500 }
        );
    }
}
