import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import type { PlayersResponse } from "@/types/dashboard";
import { TableSkeleton } from "../../ui/Skeletons";

function Th({ children }: { children: React.ReactNode }) {
    return <th className="px-6 py-3 font-medium text-gray-600">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <td className={`px-6 py-3 ${className}`}>{children}</td>;
}

export default function PlayersTable({
    data, loading, error,
}: { data?: PlayersResponse; loading?: boolean; error?: unknown }) {
    if (loading) return <TableSkeleton />;
    if (error || !data) return <div className="px-6 py-8 text-sm text-red-600">Failed to load players.</div>;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left">
                    <tr>
                        <Th>Player</Th><Th>Category</Th><Th>Games</Th><Th>Avg Score</Th><Th>Win Rate</Th><Th>Coins</Th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((p) => (
                        <tr key={p.id} className="border-b last:border-0">
                            <Td className="font-medium text-gray-800">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                                        {p.name[0]}
                                    </span>{p.name}
                                </div>
                            </Td>
                            <Td><Badge className="badge badge-blue">{p.category}</Badge></Td>
                            <Td>{p.games}</Td>
                            <Td>{p.avgScore.toFixed(1)}</Td>
                            <Td>
                                <div className="flex items-center gap-1 text-gray-700">
                                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                                    {Math.round(p.winRate * 100)}%
                                </div>
                            </Td>
                            <Td>{p.coins}</Td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
