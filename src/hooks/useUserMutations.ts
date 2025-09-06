// hooks/useUserMutations.ts
import { fetcher, globalMutate } from "@/lib/swr";
import type { Role } from "@/types/users";

const base = "/api/users";
const revalidateAllUsers = async () => {
    await globalMutate((key) => typeof key === "string" && key.startsWith("/api/users"));
};

export function useUserMutations(listKey?: string) {
    const refetch = async () => {
        if (listKey) await globalMutate(listKey);
        else await revalidateAllUsers();
    };

    const createUser = async (payload: { username: string; email?: string; roles?: Role[] }) => {
        const res = await fetcher(base, { method: "POST", body: JSON.stringify(payload) });
        await refetch();
        return res;
    };

    const updateUser = async (id: string, payload: Partial<{ username: string; email: string; xp: number; streak: number; roles: Role[]; isBanned: boolean }>) => {
        const res = await fetcher(`${base}/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
        await refetch();
        return res;
    };

    const deleteUser = async (id: string) => {
        await fetcher(`${base}/${id}`, { method: "DELETE" });
        await refetch();
    };

    const toggleBan = async (id: string, banned: boolean) => {
        const res = await fetcher(`${base}/${id}/ban`, { method: "PATCH", body: JSON.stringify({ banned }) });
        await refetch();
        return res;
    };

    const setRoles = async (id: string, roles: Role[]) => {
        const res = await fetcher(`${base}/${id}/role`, { method: "PATCH", body: JSON.stringify({ roles }) });
        await refetch();
        return res;
    };

    const equipAvatar = async (id: string, cosmeticId: string) => {
        const res = await fetcher(`${base}/${id}/equip/avatar`, {
            method: "PATCH",
            body: JSON.stringify({ cosmeticId }),
        });
        await refetch();
        return res;
    };

    return { createUser, updateUser, deleteUser, toggleBan, setRoles, equipAvatar };
}
