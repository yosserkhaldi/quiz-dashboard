"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Badge } from "./components/ui/badge";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";

import {
  TrendingUp,
  Users,
  Gamepad2,
  Star,
  Coins,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

/* ========= Types ========= */
type RangeKey = "24h" | "7d" | "30d" | "90d";
type CategoryKey =
  | "all"
  | "programming"
  | "science"
  | "geography"
  | "literature"
  | "mathematics"
  | "art";

type KPI = {
  dau: number;
  dauDelta: number;
  games: number;
  gamesDelta: number;
  avgScore: number;
  revenue: number;
  arppu: number;
};

type DAUPoint = { t: string; v: number };
type WinRatePoint = { name: string; value: number };
type ByCategoryPoint = { category: string; plays: number };
type PlayerRow = {
  name: string;
  category: Exclude<CategoryKey, "all">;
  games: number;
  avgScore: number;
  winRate: number; // 0..1
  coins: number;
};

type DashboardData = {
  kpis: KPI;
  series: {
    dau: DAUPoint[];
    winRate: WinRatePoint[];
    byCategory: ByCategoryPoint[];
  };
  topPlayers: PlayerRow[];
};

/* ========= Couleurs charts ========= */
const categoryColors: Record<string, string> = {
  programming: "#3b82f6", // bleu
  science: "#22c55e",     // vert
  geography: "#f59e0b",   // orange
  literature: "#a855f7",  // violet
  mathematics: "#ec4899", // rose
  art: "#e11d48",         // rouge foncé
};

/* ========= Page ========= */
export default function DashboardPage() {
  const [range, setRange] = useState<RangeKey>("7d");
  const [category, setCategory] = useState<CategoryKey>("all");
  const [search, setSearch] = useState("");
  const [demoSeed, setDemoSeed] = useState(1);

  const data = useMemo<DashboardData>(
    () => getData({ range, category, seed: demoSeed }),
    [range, category, demoSeed]
  );

  const kpis = [
    { label:"TOTAL USERS", value: formatNum(data.kpis.dau),   sub:`+${data.kpis.dauDelta}% vs prev`, icon: Users,   variant:"kpi--blue"   },
    { label:"GAMES PLAYED",value: formatNum(data.kpis.games), sub:`+${data.kpis.gamesDelta}% vs prev`, icon: Gamepad2, variant:"kpi--orange" },
    { label:"AVG. SCORE",  value: data.kpis.avgScore.toFixed(1), sub:"/ 10", icon: Star, variant:"kpi--red" },
    { label:"REVENUE",     value:`$${data.kpis.revenue.toFixed(2)}`, sub:`${data.kpis.arppu.toFixed(2)} ARPPU`, icon: Coins, variant:"kpi--purple" },
  ] as const;

  const filteredPlayers = useMemo(() => {
    return data.topPlayers.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (search.trim() === "" ||
          p.name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [data.topPlayers, category, search]);

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-purple-700 flex items-center gap-2">
              <span>🧠</span> Quiz Dashboard
            </h1>
            <p className="text-base text-gray-600 mt-1">
              Challenge your brain. Compete with friends. Get smarter every day.
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="border-blue-200" variant="outline" onClick={() => setDemoSeed((v) => v + 1)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Demo shuffle
            </Button>
          </div>
        </div>

        {/* Filtres */}
        <Card className="filter-card">
          <CardContent className="p-6">
            <div className="filter-grid">
              {/* Range */}
              <div className="flex items-center gap-3">
                <span className="filter-label">Range</span>
                <div className="tabs-box">
                  {(["24h","7d","30d","90d"] as RangeKey[]).map(r => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      className={`tabs-pill ${range === r ? "tabs-pill--active" : ""}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="flex items-center gap-3 justify-center">
                <span className="filter-label">Category</span>
                <Select value={category} onValueChange={(v?: string) => setCategory((v ?? "all") as CategoryKey)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="geography">Geography</SelectItem>
                    <SelectItem value="literature">Literature</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search */}
              <div className="flex items-center justify-end">
                <input
                  className="input-search"
                  placeholder="Search players…"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI tiles */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k, idx) => (
            <div key={idx} className={`card kpi ${k.variant}`}>
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

        {/* Charts */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Area: DAU */}
          <Card className="card lg:col-span-2">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Daily Active Users</h3>
                <Badge className="badge badge-secondary">{range}</Badge>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.series.dau} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dau" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="t" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} width={40} />
                    <RTooltip formatter={(v: number) => formatNum(v)} />
                    <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} fill="url(#dau)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pie: Win Rate */}
          <Card className="card">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Win / Lose Distribution</h3>
                <Badge className="badge badge-success">overall</Badge>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.series.winRate}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      label
                    >
                      {/* Wins / Loses */}
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Legend verticalAlign="bottom" height={24} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bar: Plays by Category */}
        <Card className="card">
          <CardContent className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Games by Category</h3>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger>
                    <Badge className="badge badge-blue">per {range}</Badge>
                  </TooltipTrigger>
                  <TooltipContent>Number of games started in each quiz category.</TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.series.byCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} width={40} />
                  <RTooltip />
                  <Bar dataKey="plays" radius={[10, 10, 0, 0]}>
                    {data.series.byCategory.map((entry, i) => (
                      <Cell key={i} fill={categoryColors[entry.category]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Table: Top Players */}
        <Card className="card">
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-6 py-5">
              <h3 className="text-lg font-semibold text-gray-800">Top Players</h3>
              <span className="text-sm text-gray-500">{filteredPlayers.length} results</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-6 py-3 font-medium text-gray-600">Player</th>
                    <th className="px-6 py-3 font-medium text-gray-600">Category</th>
                    <th className="px-6 py-3 font-medium text-gray-600">Games</th>
                    <th className="px-6 py-3 font-medium text-gray-600">Avg Score</th>
                    <th className="px-6 py-3 font-medium text-gray-600">Win Rate</th>
                    <th className="px-6 py-3 font-medium text-gray-600">Coins</th>
                  </tr>
                </thead>
                <tbody>
                     

                  {filteredPlayers.map((p, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="px-6 py-3 font-medium text-gray-800 flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                          {p.name[0]}
                        </span>
                        {p.name}
                      </td>
                      <td className="px-6 py-3">
                        <Badge className="badge badge-blue">{p.category}</Badge>
                      </td>
                      <td className="px-6 py-3">{p.games}</td>
                      <td className="px-6 py-3">{p.avgScore.toFixed(1)}</td>
                      <td className="px-6 py-3 flex items-center gap-1 text-gray-700">
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                        {Math.round(p.winRate * 100)}%
                      </td>
                      <td className="px-6 py-3">{p.coins}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ================= Demo Data Generator ================= */
function getData({
  range,
  category,
  seed = 1,
}: {
  range: RangeKey;
  category: CategoryKey;
  seed?: number;
}): DashboardData {
  const rng = mulberry32(hashCode(`${range}:${category}:${seed}`));

  const days = range === "24h" ? 24 : range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const labels = Array.from({ length: days }, (_, i) =>
    range === "24h" ? `${i}h` : `D${i + 1}`
  );

  const base = range === "24h" ? 180 : range === "7d" ? 1200 : range === "30d" ? 3400 : 5200;
  const dau: DAUPoint[] = labels.map((t, i) => ({
    t,
    v: Math.max(0, Math.round(base + noise(rng) * base * 0.18 + i * (range === "24h" ? 2 : 8))),
  }));

  const win = Math.max(0.3, Math.min(0.75, 0.55 + noise(rng) * 0.1));
  const lose = 1 - win;

  const categories: Exclude<CategoryKey, "all">[] = [
    "programming",
    "science",
    "geography",
    "literature",
    "mathematics",
    "art",
  ];
  const catFilter = category === "all" ? categories : [category as Exclude<CategoryKey, "all">];

  const byCategory: ByCategoryPoint[] = categories.map((c) => ({
    category: c,
    plays: Math.max(
      10,
      Math.round((range === "24h" ? 30 : 200) * (0.6 + rng()) * (catFilter.includes(c) ? 1.2 : 0.9))
    ),
  }));

  const topPlayers: PlayerRow[] = Array.from({ length: 28 }).map((_, i) => {
    const c = categories[Math.floor(rng() * categories.length)];
    return {
      name: pseudoName(rng, i),
      category: c,
      games: Math.round(10 + rng() * 120),
      avgScore: 5 + rng() * 5,
      winRate: 0.35 + rng() * 0.5,
      coins: Math.round(200 + rng() * 5000),
    };
  });

  const k: KPI = {
    dau: dau.at(-1)?.v ?? 0,
    dauDelta: Math.round(2 + rng() * 8),
    games: byCategory.reduce((a, b) => a + b.plays, 0),
    gamesDelta: Math.round(2 + rng() * 10),
    avgScore: 6 + rng() * 3,
    revenue: 120 + rng() * 980,
    arppu: 1 + rng() * 3,
  };

  return {
    kpis: k,
    series: {
      dau,
      winRate: [
        { name: "Wins", value: Math.round(win * 100) },
        { name: "Loses", value: Math.round(lose * 100) },
      ],
      byCategory,
    },
    topPlayers,
  };
}

/* ================= Utils ================= */
function pseudoName(rng: () => number, i: number) {
  const first = [
    "Amin","Nour","Yosser","Iheb","Sarah","Oussama","Maya","Karim",
    "Aya","Sami","Sirine","Rania","Ghada","Firas","Tarek","Walid",
  ];
  const last = ["K.","J.","M.","S.","A.","B.","H.","T.","R.","Z.","L."];
  return `${first[Math.floor(rng() * first.length)]} ${last[Math.floor(rng() * last.length)]}`;
}
function formatNum(n: number) { return Intl.NumberFormat().format(Math.round(n)); }
function hashCode(s: string) { let h = 0; for (let i=0;i<s.length;i++){ h=(h<<5)-h+s.charCodeAt(i); h|=0; } return h>>>0; }
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function noise(rng: () => number) { return (rng() - 0.5) * 2; }
