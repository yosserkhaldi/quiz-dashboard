// components/admin/tables/UsersTable.tsx
import React from "react";
import type { UsersListResponse, Role } from "@/types/users";
import Link from "next/link";

type Props = {
    data?: UsersListResponse;
    loading?: boolean;
    error?: any;
    page: number;
    pageSize: number;
    onPageChange: (p: number) => void;
    onSearch: (s: string) => void;
    onSort: (s: "-createdAt" | "createdAt" | "username" | "-username") => void;
    onRoleFilter: (r: Role | "") => void;
    onCreate: (p: { username: string; email?: string; roles?: Role[] }) => Promise<any>;
    onUpdate: (id: string, p: any) => Promise<any>;
    onDelete: (id: string) => Promise<void>;
    onToggleBan: (id: string, banned: boolean) => Promise<any>;
    onSetRoles: (id: string, roles: Role[]) => Promise<any>;
    onEquipAvatar: (id: string, cosmeticId: string) => Promise<any>;
};

const fmtDate = (iso?: string) => {
    if (!iso) return "—";
    try { return new Date(iso).toISOString().slice(0, 10); } catch { return "—"; }
};

export default function UsersTable({
    data, loading, error, page, pageSize,
    onPageChange, onSearch, onSort, onRoleFilter,
    onCreate, onUpdate, onDelete, onToggleBan, onSetRoles, onEquipAvatar,
}: Props) {
    if (loading) return <div className="p-6">Loading…</div>;
    if (error) return <div className="p-6 text-red-500">Failed to load users.</div>;

    return (
        <div className="p-6 space-y-4">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
                <input
                    className="input"
                    placeholder="Search username / email…"
                    onChange={(e) => onSearch(e.target.value)}
                />
                <select className="select" onChange={(e) => onRoleFilter(e.target.value as Role | "")}>
                    <option value="">All roles</option>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                </select>
                <select className="select" onChange={(e) => onSort(e.target.value as any)}>
                    <option value="-createdAt">Newest</option>
                    <option value="createdAt">Oldest</option>
                    <option value="username">A–Z</option>
                    <option value="-username">Z–A</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left border-b">
                            <th className="py-2 pr-3">Username</th>
                            <th className="py-2 pr-3">Email</th>
                            <th className="py-2 pr-3">Role(s)</th>
                            <th className="py-2 pr-3">Guest</th>
                            <th className="py-2 pr-3">Banned</th>
                            <th className="py-2 pr-3">Stats</th>
                            <th className="py-2 pr-3">Created</th>
                            <th className="py-2 pr-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.rows?.map((u) => (
                            <tr key={u._id} className="border-b">{
                                [
                                    <td key="name" className="whitespace-nowrap px-4 py-2">
                                        <Link href={`/admin/users/${u._id}`} className="text-blue-600 hover:underline">
                                            {u.username || u.email || u._id}
                                        </Link>
                                    </td>,
                                    <td key="email" className="py-2 pr-3">{u.email ?? "—"}</td>,
                                    <td key="roles" className="py-2 pr-3">{u.roles?.join(", ") || "user"}</td>,
                                    <td key="guest" className="py-2 pr-3">{u.isGuest ? "Yes" : "No"}</td>,
                                    <td key="ban" className="py-2 pr-3">
                                        <button className="btn-ghost" onClick={() => onToggleBan(u._id, (u as any).isBanned ? false : true)}>
                                            {(u as any).isBanned ? "Unban" : "Ban"}
                                        </button>
                                    </td>,
                                    <td key="stats" className="py-2 pr-3">{u.stats?.totalWins ?? 0}/{u.stats?.totalGames ?? 0}</td>,
                                    <td key="created" className="py-2 pr-3">{fmtDate(u.createdAt)}</td>,
                                    <td key="actions" className="py-2 pr-3 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button className="btn" onClick={() => onUpdate(u._id, { roles: ["admin"] })}>Make admin</button>
                                            <button className="btn" onClick={() => onDelete(u._id)}>Delete</button>
                                        </div>
                                    </td>,
                                ]
                            }</tr>
                        ))}
                        {!data?.rows?.length && (
                            <tr>
                                <td className="py-6 text-center text-muted-foreground" colSpan={8}>No users</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end gap-2">
                <button className="btn-outline" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Prev</button>
                <span className="text-sm text-muted-foreground">
                    Page {page} / {data?.pages ?? 1}
                </span>
                <button className="btn-outline" disabled={page >= (data?.pages ?? 1)} onClick={() => onPageChange(page + 1)}>Next</button>
            </div>
        </div>
    );
}
