import { NextResponse } from "next/server";
import type { PlayersResponse } from "@/types/dashboard";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim().toLowerCase() ?? "";
    const range = url.searchParams.get("range");
    const category = url.searchParams.get("category");

    const data: PlayersResponse = { total: 0, items: [] };
    return NextResponse.json(data);
}
