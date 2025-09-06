// hooks/useUsers.ts
import { useSWR, swrConfig } from "@/lib/swr";
import type { UsersListResponse, UsersQuery } from "@/types/users";

export const buildUsersKey = (q: UsersQuery = {}) => {
    const u = new URLSearchParams();
    if (q.page) u.set("page", String(q.page));
    if (q.limit) u.set("limit", String(q.limit));
    if (q.search?.trim()) u.set("search", q.search.trim());
    if (typeof q.isGuest === "boolean") u.set("isGuest", String(q.isGuest));
    if (typeof q.isBanned === "boolean") u.set("isBanned", String(q.isBanned));
    if (q.role) u.set("role", q.role);
    if (q.sort) u.set("sort", q.sort);
    const qs = u.toString();
    return `/api/users${qs ? `?${qs}` : ""}`;
};

export function useUsers(query: UsersQuery) {
    const key = buildUsersKey(query);
    return useSWR<UsersListResponse>(key, swrConfig);
}
