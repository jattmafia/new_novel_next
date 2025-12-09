import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost";

    // Get hostname from headers for reliability, fallback to nextUrl
    const hostHeader = request.headers.get("host") || "";
    const hostname = hostHeader.split(":")[0] || request.nextUrl.hostname;

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
        // If it's the root path "/", rewrite to "/[username]"
        if (url.pathname === "/") {
            console.log(`[Middleware] Rewriting / to /${subdomain}`);
            url.pathname = `/${subdomain}`;
            return NextResponse.rewrite(url);
        }

        // 5. Allow other paths (e.g. /[username]/post/1) to work gracefully?
        // If I visit "user.domain.com/some-post", we might want to rewrite to "/user/some-post"
        // But the current app structure is /src/app/[username]/... ? 
        // If the structure is SINGLE profile page, we might not need this.
        // Assuming the file is `src/app/[username]/page.tsx`, accessing `/` works.
        // If there are sub-routes like `src/app/[username]/stories`, we should handle them.

        // For now, let's try to rewrite EVERYTHING to include the username if the path doesn't already have it?
        // No, `NextResponse.rewrite` keeps the URL in the browser bar but renders the target path.
        // If I visit `user.com/story`, I want to render `/user/story`.

        // Let's stick to the user's specific complaint: "showing landing page".
        // This usually means `rewrite` didn't happen for `/`.

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|_next/data).*)",
};
