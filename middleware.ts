// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
    "/admin/login",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
    "/_next",           // Next assets
    "/icons",           // your icons folder
    "/images",
];

export function middleware(req: NextRequest) {
    const { pathname, searchParams } = req.nextUrl;

    // Allow public paths without auth
    if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
        return NextResponse.next();
    }

    // Only guard the admin app; adapt matcher below if your app is elsewhere
    const isAdminApp = true;

    if (isAdminApp) {
        const authFlag = req.cookies.get("admin_auth")?.value === "1";
        if (!authFlag) {
            const url = req.nextUrl.clone();
            url.pathname = "/admin/login";
            url.searchParams.set("next", pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ""));
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

// Protect everything except Next.js API routes if you want
export const config = {
    matcher: ["/((?!api).*)"],
};
