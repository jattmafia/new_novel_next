import { API_BASE } from '@/lib/config';

export async function POST(request: Request, { params }: { params: { storyId: string } }) {
    const { storyId } = params;
    try {
        const formData = await request.formData();
        const auth = request.headers.get('authorization') || '';

        const forwardRes = await fetch(`${API_BASE}/stories/${storyId}/chapters`, {
            method: 'POST',
            headers: auth ? { Authorization: auth } : undefined,
            body: formData as unknown as BodyInit,
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
