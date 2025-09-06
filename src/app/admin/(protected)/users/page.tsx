// app/admin/users/page.tsx (example)
"use client";

import React, { useMemo, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "@/components/ui/SectionHeader";
import { useUsers, buildUsersKey } from "@/hooks/useUsers";
import { useUserMutations } from "@/hooks/useUserMutations";
import type { UsersQuery, Role } from "@/types/users";
import UsersTable from "@/components/admin/tables/UsersTable"; // see sketch below
// app/admin/users/page.tsx

// ...

export default function UsersPage() {
    const [query, setQuery] = useState<UsersQuery>({ page: 1, limit: 10, sort: "-createdAt" });
    const key = buildUsersKey(query);
    const { data, isLoading, error } = useUsers(query);
    const { createUser, updateUser, deleteUser, toggleBan, setRoles, equipAvatar } = useUserMutations(key);


    const total = data?.total ?? 0;

    const onSearch = useCallback((s: string) => setQuery(q => ({ ...q, search: s, page: 1 })), []);
    const onPage = useCallback((p: number) => setQuery(q => ({ ...q, page: p })), []);
    const onRoleFilter = useCallback((r: Role | "") => setQuery(q => ({ ...q, role: r, page: 1 })), []);
    const onSort = useCallback((s: UsersQuery["sort"]) => setQuery(q => ({ ...q, sort: s })), []);

    return (
        <div className="min-h-screen px-6 py-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <Card className="card">
                    <CardContent className="p-0">
                        <SectionHeader title="Users" right={<Badge className="badge">{total} results</Badge>} />
                        <UsersTable
                            data={data}
                            loading={isLoading}
                            error={error}
                            page={query.page ?? 1}
                            pageSize={query.limit ?? 10}
                            onPageChange={onPage}
                            onSearch={onSearch}
                            onSort={onSort}
                            onRoleFilter={onRoleFilter}
                            // mutations
                            onCreate={createUser}
                            onUpdate={updateUser}
                            onDelete={deleteUser}
                            onToggleBan={toggleBan}
                            onSetRoles={setRoles}
                            onEquipAvatar={equipAvatar}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
