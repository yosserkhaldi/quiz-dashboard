import { NextResponse } from "next/server";
import type { DashboardResponse } from "@/types/dashboard";

// TODO: replace with real DB calls
export async function GET(req: Request) {
    const url = new URL(req.url);
    const range = url.searchParams.get("range");
    const category = url.searchParams.get("category");
    // validate range/category if needed

    const data: DashboardResponse = {
        kpis: { dau: 0, dauDelta: 0, games: 0, gamesDelta: 0, avgScore: 0, revenue: 0, arppu: 0 },
        series: { dau: [], winLoss: { wins: 0, losses: 0 }, byCategory: [] },
    };

    return NextResponse.json(data);
}
