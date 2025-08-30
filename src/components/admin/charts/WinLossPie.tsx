import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import SectionHeader from "../../ui/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { ChartSkeleton } from "../../ui/Skeletons";
import { ErrorSmall } from "../../ui/ErrorStates";

export default function WinLossPie({ wins, losses, loading, error }: {
    wins?: number; losses?: number; loading?: boolean; error?: unknown;
}) {
    const total = Math.max(1, (wins ?? 0) + (losses ?? 0));
    const data = [
        { name: "Wins", value: Math.round(((wins ?? 0) / total) * 100) },
        { name: "Losses", value: Math.round(((losses ?? 0) / total) * 100) },
    ];

    return (
        <div className="card">
            <div className="p-6">
                <SectionHeader title="Win / Loss Distribution" right={<Badge className="badge badge-success">overall</Badge>} />
                <div className="h-72">
                    {loading ? <ChartSkeleton /> : error ? <ErrorSmall /> : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3} label>
                                    <Cell fill="#10b981" /><Cell fill="#ef4444" />
                                </Pie>
                                <Legend verticalAlign="bottom" height={24} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}
