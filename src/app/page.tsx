"use client";

import React, { useMemo, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/admin/Header";
import FiltersBar from "@/components/admin/FiltersBar";
import KpiGrid, { mapKpis } from "@/components/admin/KpiGrid";
import SectionHeader from "@/components/ui/SectionHeader";
import DAUArea from "@/components/admin/charts/DAUArea";
import WinLossPie from "@/components/admin/charts/WinLossPie";
import ByCategoryBar from "@/components/admin/charts/ByCategoryBar";
import PlayersTable from "@/components/admin/tables/PlayersTable";
import { useDashboard } from "@/hooks/useDashboard";
import { usePlayers } from "@/hooks/usePlayers";
import type { CategoryKey, RangeKey } from "@/types/dashboard";

export default function DashboardPage() {
  const [range, setRange] = useState<RangeKey>("7d");
  const [category, setCategory] = useState<CategoryKey>("all");
  const [search, setSearch] = useState("");

  const { data: dash, isLoading: ldDash, error: errDash, mutate: refDash } = useDashboard(range, category);
  const { data: players, isLoading: ldPlayers, error: errPlayers, mutate: refPlayers } = usePlayers(range, category, search);

  const kpis = useMemo(() => (dash?.kpis ? mapKpis(dash.kpis) : []), [dash?.kpis]);
  const handleRefresh = useCallback(() => { refDash(); refPlayers(); }, [refDash, refPlayers]);

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Header onRefresh={handleRefresh} />

        <Card className="filter-card">
          <CardContent className="p-6">
            <FiltersBar
              range={range}
              onRangeChange={setRange}
              category={category}
              onCategoryChange={setCategory}
              search={search}
              onSearchChange={setSearch}
            />
          </CardContent>
        </Card>

        <KpiGrid kpis={kpis} />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DAUArea data={dash?.series.dau} range={range} loading={ldDash} error={errDash} />
          </div>
          <WinLossPie wins={dash?.series.winLoss.wins} losses={dash?.series.winLoss.losses} loading={ldDash} error={errDash} />
        </div>

        <ByCategoryBar data={dash?.series.byCategory} range={range} loading={ldDash} error={errDash} />

        <Card className="card">
          <CardContent className="p-0">
            <SectionHeader title="Top Players" right={<Badge className="badge">{players?.total ?? 0} results</Badge>} />
            <PlayersTable data={players} loading={ldPlayers} error={errPlayers} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
