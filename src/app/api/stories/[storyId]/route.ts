import { NextResponse } from 'next/server';
import { API_BASE } from '@/lib/config';

export async function GET(
    request: Request,
    context: any
) {
    const params = context?.params instanceof Promise ? await context.params : context?.params;
    const { storyId } = params ?? {};

    if (!storyId) {
        return NextResponse.json({ message: 'Story ID is required' }, { status: 400 });
    }

    try {
        const auth = request.headers.get('authorization') || '';

        const forwardRes = await fetch(`${API_BASE}/stories/${storyId}`, {
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
