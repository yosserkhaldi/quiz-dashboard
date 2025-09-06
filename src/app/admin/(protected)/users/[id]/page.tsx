"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "@/components/ui/SectionHeader";
import { useUser } from "@/hooks/userUser";        // ⬅️ ensure correct path/name
import { useUserMutations } from "@/hooks/useUserMutations";
import type { Role } from "@/types/users";        // ← use Role

export default function UserDetailsPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const id = params?.id;

    const { data, isLoading, error, mutate } = useUser(id);
    const u = data?.user;                          // ⬅️ unwrap profile
    const w = data?.wallet;                        // ⬅️ wallet if you need coins

    const winRate = useMemo(() => {
        const g = u?.stats?.totalGames ?? 0;
        const wns = u?.stats?.totalWins ?? 0;
        return g > 0 ? Math.round((wns / g) * 100) : 0;
    }, [u]);

    if (!id) return <div className="p-8">Invalid user id</div>;
    if (isLoading) return <div className="p-8">Loading…</div>;
    if (error) return <div className="p-8 text-red-600">Failed to load user.</div>;
    if (!u) return <div className="p-8">User not found.</div>;

    const { toggleBan, setRoles, deleteUser } = useUserMutations(`/api/users/${id}`);

    const onToggleBan = async () => {
        await toggleBan(u._id, !u.isBanned);
        await mutate();
    };
    const onRoleChange = async (role: Role) => { await setRoles(u._id, [role]); await mutate(); };
    const onDelete = async () => {
        if (!confirm("Delete this user? This cannot be undone.")) return;
        await deleteUser(u._id);
        router.replace("/admin/users");
    };
    const avatarLabel = (v: unknown) => {
        if (!v) return "—";
        if (typeof v === "string") return v;
        if (typeof v === "object") {
            const o = v as any;
            return o.name ?? o._id ?? "—";
        }
        return String(v);
    };

    const createdAt = u.createdAt ? new Date(u.createdAt).toLocaleString() : "—";
    const updatedAt = u.updatedAt ? new Date(u.updatedAt).toLocaleString() : "—";

    return (
        <div className="min-h-screen px-6 py-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <SectionHeader
                    title={
                        <div className="flex items-center gap-3">
                            <Link href="/admin/users" className="text-gray-500 hover:underline">← Users</Link>
                            <span className="font-semibold">{u.username ?? u.email ?? u._id}</span>
                            {u.isGuest && <Badge>Guest</Badge>}
                            {u.isBanned && <Badge variant="destructive">Banned</Badge>}
                        </div>
                    }
                    right={
                        <div className="flex items-center gap-2">
                            <button onClick={onToggleBan} className={`rounded px-3 py-1 text-sm ${u.isBanned ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                                {u.isBanned ? "Unban" : "Ban"}
                            </button>
                            <button onClick={onDelete} className="rounded bg-gray-900 px-3 py-1 text-sm text-white">
                                Delete
                            </button>
                        </div>
                    }
                />

                {/* Profile */}
                <Card className="card">
                    <CardContent className="p-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-3">
                                <h2 className="text-lg font-semibold">Profile</h2>
                                <div className="text-sm">
                                    <div><span className="font-medium">ID:</span> {u._id}</div>
                                    <div><span className="font-medium">Username:</span> {u.username ?? "—"}</div>
                                    <div><span className="font-medium">Email:</span> {u.email ?? "—"}</div>
                                    <div>
                                        <span className="font-medium">Roles:</span>{" "}
                                        {u.roles?.length ? u.roles.map((r: string) => <Badge key={r} className="mr-1">{r}</Badge>) : "—"}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="role" className="text-gray-600">Quick set role:</label>
                                        <select
                                            id="role"
                                            className="rounded border px-2 py-1 text-sm"
                                            defaultValue=""
                                            onChange={(e) => e.target.value && onRoleChange(e.target.value as Role)}
                                        >
                                            <option value="" disabled>Choose…</option>
                                            <option value="admin">admin</option>
                                            <option value="moderator">moderator</option>
                                            <option value="user">user</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-lg font-semibold">Meta</h2>
                                <div className="text-sm">
                                    <div><span className="font-medium">Created:</span> {createdAt}</div>
                                    <div><span className="font-medium">Updated:</span> {updatedAt}</div>
                                    <div><span className="font-medium">Guest Key:</span> {u.guestKey ?? "—"}</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card><CardContent className="p-6">
                        <div className="text-sm text-gray-500">Total Games</div>
                        <div className="text-3xl font-semibold">{u.stats?.totalGames ?? 0}</div>
                    </CardContent></Card>
                    <Card><CardContent className="p-6">
                        <div className="text-sm text-gray-500">Total Wins</div>
                        <div className="text-3xl font-semibold">{u.stats?.totalWins ?? 0}</div>
                    </CardContent></Card>
                    <Card><CardContent className="p-6">
                        <div className="text-sm text-gray-500">Win Rate</div>
                        <div className="text-3xl font-semibold">{winRate}%</div>
                    </CardContent></Card>
                </div>

                {/* Coins / Wallet / Progress */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card><CardContent className="p-6">
                        <div className="text-sm text-gray-500">Coins</div>
                        <div className="text-3xl font-semibold">{u.stats?.totalCoins ?? w?.balance ?? 0}</div>
                    </CardContent></Card>
                    <Card><CardContent className="p-6">
                        <div className="text-sm text-gray-500">XP</div>
                        <div className="text-3xl font-semibold">{u.xp ?? 0}</div>
                    </CardContent></Card>
                    <Card><CardContent className="p-6">
                        <div className="text-sm text-gray-500">Current Streak</div>
                        <div className="text-3xl font-semibold">{u.streak ?? 0}</div>
                    </CardContent></Card>
                </div>

                {/* Achievements / Cosmetics */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card><CardContent className="p-6">
                        <h2 className="mb-3 text-lg font-semibold">Achievements</h2>
                        {u.achievements?.length ? (
                            <ul className="list-disc pl-6 text-sm">
                                {u.achievements.map((a: any, i: number) => (
                                    <li key={a?._id ?? i}>{a?.name ?? JSON.stringify(a)}</li>
                                ))}
                            </ul>
                        ) : <div className="text-sm text-gray-500">No achievements</div>}
                    </CardContent></Card>

                    <Card>
                        <CardContent className="p-6">
                            <h2 className="mb-3 text-lg font-semibold">Cosmetics</h2>
                            <div className="text-sm">
                                <div>
                                    <span className="font-medium">Equipped avatar:</span>{" "}
                                    {avatarLabel(u.cosmetics?.equipped?.avatar)}
                                </div>

                                <div className="mt-2">
                                    <span className="font-medium">Owned:</span>{" "}
                                    {Array.isArray(u.cosmetics?.owned) ? u.cosmetics!.owned.length : 0}
                                </div>

                                {/* Optional: list names instead of just count */}
                                {Array.isArray(u.cosmetics?.owned) && u.cosmetics!.owned.length > 0 && (
                                    <ul className="mt-2 list-disc pl-6">
                                        {u.cosmetics!.owned.map((c: any) => (
                                            <li key={c?._id}>{c?.name ?? c?._id ?? "[unknown item]"}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Raw JSON (debug) */}
                <details className="rounded border p-4">
                    <summary className="cursor-pointer font-medium">Raw JSON</summary>
                    <pre className="mt-3 overflow-x-auto text-xs">{JSON.stringify(data, null, 2)}</pre>
                </details>
            </div>
        </div>
    );
}
