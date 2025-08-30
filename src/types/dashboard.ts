export type RangeKey = "24h" | "7d" | "30d" | "90d";
export type CategoryKey =
    | "all"
    | "programming"
    | "science"
    | "geography"
    | "literature"
    | "mathematics"
    | "art";

export type KPI = {
    dau: number;
    dauDelta: number;
    games: number;
    gamesDelta: number;
    avgScore: number;   // 0..10
    revenue: number;    // $
    arppu: number;      // $
};

export type DAUPoint = { t: string; v: number };
export type ByCategoryPoint = { category: Exclude<CategoryKey, "all">; plays: number };

export type DashboardSeries = {
    dau: DAUPoint[];
    winLoss: { wins: number; losses: number }; // raw counts or period totals
    byCategory: ByCategoryPoint[];
};

export type DashboardResponse = {
    kpis: KPI;
    series: DashboardSeries;
};

export type PlayerRow = {
    id: string;
    name: string;
    category: Exclude<CategoryKey, "all">;
    games: number;
    avgScore: number;   // 0..10
    winRate: number;    // 0..1
    coins: number;
};

export type PlayersResponse = {
    total: number;
    items: PlayerRow[];
};
