// lib/auth-client.ts
const API = process.env.NEXT_PUBLIC_API_URL!;

export async function logoutClient() {
    // Optional: call backend logout to clear its cookie
    try {
        await fetch(`${API}/api/auth/logout`, { method: "POST", credentials: "include" });
    } catch { }
    // Remove front-domain flag so middleware blocks again
    document.cookie = "admin_auth=; Path=/; Max-Age=0; SameSite=Lax";
    // Hard redirect to login
    window.location.href = "/admin/login";
}
