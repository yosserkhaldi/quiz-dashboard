import { Users, Gamepad2, Star, Coins } from "lucide-react";
import type { KPI } from "@/types/dashboard";
import { formatNum } from "@/lib/constants";
import { KpiSkeleton } from "../ui/Skeletons";

type KpiItem = {
    label: string;
    value: string;
    sub: string;
    icon: React.ComponentType<{ className?: string }>;
    variant: "kpi--blue" | "kpi--orange" | "kpi--red" | "kpi--purple";
};

export default function KpiGrid({ kpis }: { kpis: KpiItem[] }) {
    if (!kpis?.length) return <KpiSkeleton />;
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((k) => (
                <div key={k.label} className={`card kpi ${k.variant}`}>
                    <div className="meta">
                        <p className="text-xs uppercase tracking-wide text-gray-500">{k.label}</p>
                        <div className="value">{k.value}</div>
                        <p className="sub">{k.sub}</p>
                    </div>
                    <div className="icon">
                        <k.icon className="h-6 w-6" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function mapKpis(k: KPI): KpiItem[] {
    return [
        { label: "TOTAL USERS", value: formatNum(k.dau), sub: `+${k.dauDelta}% vs prev`, icon: Users, variant: "kpi--blue" },
        { label: "GAMES PLAYED", value: formatNum(k.games), sub: `+${k.gamesDelta}% vs prev`, icon: Gamepad2, variant: "kpi--orange" },
        { label: "AVG. SCORE", value: k.avgScore.toFixed(1), sub: "/ 10", icon: Star, variant: "kpi--red" },
        { label: "REVENUE", value: `$${k.revenue.toFixed(2)}`, sub: `${k.arppu.toFixed(2)} ARPPU`, icon: Coins, variant: "kpi--purple" },
    ];
}
