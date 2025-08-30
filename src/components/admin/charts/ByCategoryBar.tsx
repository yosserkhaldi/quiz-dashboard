import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip as RTooltip, Cell } from "recharts";
import SectionHeader from "../../ui/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_COLORS } from "@/lib/constants";
import type { ByCategoryPoint } from "@/types/dashboard";
import { ChartSkeleton } from "../../ui/Skeletons";
import { ErrorSmall } from "../../ui/ErrorStates";

export default function ByCategoryBar({
    data, range, loading, error,
}: { data?: ByCategoryPoint[]; range: string; loading?: boolean; error?: unknown }) {
    return (
        <div className="card">
            <div className="p-6">
                <SectionHeader title="Games by Category" right={<Badge className="badge badge-blue">per {range}</Badge>} />
                <div className="h-80">
                    {loading ? <ChartSkeleton /> : error || !data ? <ErrorSmall /> : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} width={40} />
                                <RTooltip />
                                <Bar dataKey="plays" radius={[10, 10, 0, 0]}>
                                    {data.map((entry) => <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}
