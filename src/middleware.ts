import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN;
    if (!appDomain) return NextResponse.next();

    const hostname = request.nextUrl.hostname; // excludes port

    // Allow local and bare domain to pass through
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === appDomain) {
        return NextResponse.next();
    }

    if (hostname.endsWith(appDomain)) {
        const suffix = `.${appDomain}`;
        const subdomain = hostname.slice(0, hostname.length - suffix.length);

        // Skip reserved or empty subdomains
        if (!subdomain || ["www", "app", "api"].includes(subdomain)) {
            return NextResponse.next();
        }

        const url = request.nextUrl.clone();

        // Only rewrite the root of the subdomain to the user's profile page.
        // e.g. https://alice.localhost:3000/ -> /alice
        if (url.pathname === "/" || url.pathname === "") {
            url.pathname = `/${encodeURIComponent(subdomain)}`;
            return NextResponse.rewrite(url);
        }

        // If the subdomain request is to an auth/login/signup path, redirect to the base domain
        // so login/signup live only on the root domain (no subdomain auth pages).
        const authPrefixes = ["/login", "/signup", "/auth"];
        for (const prefix of authPrefixes) {
            if (url.pathname.startsWith(prefix)) {
                // Build destination URL on the base domain (preserve protocol, port, pathname, and search)
                const dest = new URL(request.url);
                dest.hostname = appDomain;
                // Preserve port when present (dev mode)
                if (request.nextUrl.port) dest.port = request.nextUrl.port;
                return NextResponse.redirect(dest);
            }
        }

        // For any other pathname (e.g. /about, /posts/123), do not rewrite — let the app handle the path normally.
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|_next/data).*)",
};
