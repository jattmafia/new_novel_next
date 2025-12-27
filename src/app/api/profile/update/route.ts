import { NextResponse } from "next/server";
import { API_BASE } from "@/lib/config";

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

async function handleFormForward(req: Request, method: string) {
    try {
        const formData = await req.formData();
        const auth = req.headers.get("authorization") || "";

        // Log basic request info for debugging (do not log file contents)
        console.log(`[proxy:/api/profile/update] method=${method} Authorization=${auth}`);
        try {
            const keys: string[] = [];
            // Iterate formData keys to log field names
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            for (const key of (formData as any).keys()) {
                keys.push(key);
            }
            console.log("[proxy:/api/profile/update] form fields:", keys.join(", "));
        } catch (e) {
            // ignore formData iteration errors
        }

        const url = `${API_BASE}/profile/update`;

        const res = await fetchWithTimeout(url, {
            method,
            headers: auth ? { Authorization: auth } : {},
            body: formData as any,
        }, 15000);

        const contentType = res.headers.get("content-type") || "application/json";

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            const detail = text || res.statusText || "Backend error";
            console.error("[proxy:/api/profile/update] backend error status=", res.status, "detail=", detail);
            return NextResponse.json({ error: detail }, { status: res.status });
        }

        const body = await res.arrayBuffer();

        return new NextResponse(Buffer.from(body), {
            status: res.status,
            headers: { "content-type": contentType },
        });
    } catch (err: any) {
        console.error("Proxy profile update error:", err);
        const msg = err?.message || (err?.cause && err.cause.message) || "Proxy error";
        return NextResponse.json({ success: false, message: msg }, { status: 502 });
    }
}

export async function PUT(req: Request) {
    return handleFormForward(req, "PUT");
}

export async function POST(req: Request) {
    // Some clients or tools may send POST for create; support both.
    return handleFormForward(req, "POST");
}
