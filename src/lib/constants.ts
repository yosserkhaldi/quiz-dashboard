import type { CategoryKey, RangeKey } from "@/types/dashboard";

export const RANGES: RangeKey[] = ["24h", "7d", "30d", "90d"];

export const CATEGORIES: Exclude<CategoryKey, "all">[] = [
    "programming", "science", "geography", "literature", "mathematics", "art",
];

export const CATEGORY_LABEL: Record<CategoryKey, string> = {
    all: "All",
    programming: "Programming",
    science: "Science",
    geography: "Geography",
    literature: "Literature",
    mathematics: "Mathematics",
    art: "Art",
};

export const CATEGORY_COLORS: Record<Exclude<CategoryKey, "all">, string> = {
    programming: "#3b82f6",
    science: "#22c55e",
    geography: "#f59e0b",
    literature: "#a855f7",
    mathematics: "#ec4899",
    art: "#e11d48",
};

export const formatNum = (n: number) => Intl.NumberFormat().format(Math.round(n));
