// lib/swr.ts
import useSWR, { SWRConfiguration, SWRResponse, mutate as globalMutate } from "swr";

const API = process.env.NEXT_PUBLIC_API_URL!; // http://localhost:3001 in dev

function buildHeaders(init?: RequestInit): Headers {
    const h = new Headers(init?.headers as HeadersInit);
    if (!h.has("Content-Type")) h.set("Content-Type", "application/json");

    // Read JWT from localStorage (no cookies)
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && !h.has("Authorization")) h.set("Authorization", `Bearer ${token}`);

    return h;
}

const toURL = (key: string) => (key.startsWith("http") ? key : `${API}${key}`);

export const fetcher = async (key: string, init?: RequestInit) => {
    const res = await fetch(toURL(key), {
        // IMPORTANT: no credentials here (so ACAO:* is okay)
        // credentials: "same-origin" is the default; leave it out
        ...init,
        headers: buildHeaders(init),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.status === 204 ? null : res.json();
};

export const swrConfig: SWRConfiguration = {
    fetcher,
    revalidateOnFocus: false,
    keepPreviousData: true,
};

export { useSWR, globalMutate };
export type { SWRResponse };
