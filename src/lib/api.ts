// src/lib/api.ts
const BASE = process.env.NEXT_PUBLIC_SOCKET_URL;

export async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json();
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}`);
  return res.json();
}


export async function request<T>(
  path: string,
  opts: RequestInit & { token?: string } = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts.token && { Authorization: `Bearer ${opts.token}` }),
      ...opts.headers,
    },
  });
   /* Try to parse JSON if possible */
  let body: any;
  const isJson = res.headers.get("content-type")?.includes("application/json");
  body = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    throw new Error(body?.message || body || "Unknown error");
  }
  return body as T;
}