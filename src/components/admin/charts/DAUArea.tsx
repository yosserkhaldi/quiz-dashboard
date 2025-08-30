import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip } from "recharts";
import type { DAUPoint } from "@/types/dashboard";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "../../ui/SectionHeader";
import { ChartSkeleton } from "../../ui/Skeletons";
import { ErrorSmall } from "../../ui/ErrorStates";

export default function DAUArea({ data, range, loading, error }: {
    data?: DAUPoint[];
    range: string;
    loading?: boolean;
    error?: unknown;
}) {
    return (
        <div className="card">
            <div className="p-6">
                <SectionHeader title="Daily Active Users" right={<Badge className="badge badge-secondary">{range}</Badge>} />
                <div className="h-72">
                    {loading ? <ChartSkeleton /> : error || !data ? (
                        <ErrorSmall />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="dau" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="t" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} width={40} />
                                <RTooltip />
                                <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} fill="url(#dau)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}
