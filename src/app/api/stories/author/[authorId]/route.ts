import { API_BASE } from '@/lib/config';

export async function GET(request: Request, { params }: { params: { authorId: string } }) {
    const { authorId } = params;
    try {
        const url = new URL(request.url);
        const qs = url.search || '';
        const forwardUrl = `${API_BASE}/stories/author/${encodeURIComponent(authorId)}${qs}`;

        const auth = request.headers.get('authorization') || '';

        const forwardRes = await fetch(forwardUrl, {
            method: 'GET',
            headers: auth ? { Authorization: auth } : undefined,
        });

        const forwardContentType = forwardRes.headers.get('content-type') || 'application/json';
        const forwardBody = await forwardRes.arrayBuffer();

        return new Response(forwardBody, {
            status: forwardRes.status,
            headers: { 'content-type': forwardContentType },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ message: err?.message || 'Internal error' }), { status: 500, headers: { 'content-type': 'application/json' } });
    }
}
