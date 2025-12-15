import { NextRequest, NextResponse } from "next/server";

// Static file extensions that should NOT be rewritten
const STATIC_FILE_EXTENSIONS = /\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot|css|js|json|mp4|webm|ogg|mp3|wav)$/i;

export function middleware(request: NextRequest) {
    const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost";

    // Get hostname from headers for reliability, fallback to nextUrl
    const hostHeader = request.headers.get("host") || "";
    const hostname = hostHeader.split(":")[0] || request.nextUrl.hostname;
    const pathname = request.nextUrl.pathname;

    // Skip static files - check if pathname has a file extension
    const hasFileExtension = pathname.includes('.') && pathname.split('/').pop()?.includes('.');
    if (hasFileExtension) {
        console.log(`[Middleware] Skipping static file: ${pathname}`);
        return NextResponse.next();
    }

    console.log(`[Middleware] ${request.method} ${request.url} | Host: ${hostname} | AppDomain: ${appDomain}`);

    // 1. Skip if current hostname matches the appDomain (Root Domain)
    if (hostname === appDomain || hostname === "localhost" || hostname === "127.0.0.1") {
        return NextResponse.next();
    }

    // 2. Check for subdomain
    // We expect hostname to end with .appDomain
    // e.g. "user.localhost" ends with ".localhost"
    // OR if appDomain is "rowllr.com", "user.rowllr.com" ends with ".rowllr.com"
    const isSubdomain = hostname.endsWith(`.${appDomain}`);

    if (isSubdomain) {
        // Extract subdomain
        const subdomain = hostname.slice(0, -1 * (appDomain.length + 1)); // remove .appDomain
        console.log(`[Middleware] Subdomain detected: ${subdomain}`);

        // Validate subdomain
        if (!subdomain || ["www", "app", "api", "auth"].includes(subdomain)) {
            console.log(`[Middleware] Skipping reserved subdomain: ${subdomain}`);
            return NextResponse.next();
        }

        const url = request.nextUrl.clone();

        // 3. Handle Auth redirects (Login/Signup should be on Root Domain)
        const isAuthPath = url.pathname.startsWith("/login") ||
            url.pathname.startsWith("/signup") ||
            url.pathname.startsWith("/auth");

        if (isAuthPath) {
            console.log(`[Middleware] Redirecting auth path ${url.pathname} to root domain`);
            const dest = new URL(url.pathname, `http://${appDomain}:${url.port || ""}`);
            if (url.search) dest.search = url.search;
            return NextResponse.redirect(dest);
        }

        // 4. Rewrite logic for Subdomain
        // Rewrite ALL paths to include the subdomain as username prefix
        // e.g., /discover on user.localhost becomes /user/discover
        // e.g., / on user.localhost becomes /user
        console.log(`[Middleware] Rewriting ${url.pathname} to /${subdomain}${url.pathname === '/' ? '' : url.pathname}`);
        url.pathname = `/${subdomain}${url.pathname === '/' ? '' : url.pathname}`;
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all paths except:
         * - api routes
         * - _next (static files, images, data)
         * - Static files with common extensions
         */
        "/((?!api|_next|favicon.ico|sitemap.xml|robots.txt|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico|.*\\.webp|.*\\.css|.*\\.js|.*\\.woff|.*\\.woff2).*)",
    ],
};
