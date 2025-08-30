import { useSWR, swrConfig } from "@/lib/swr";
import type { DashboardResponse, RangeKey, CategoryKey } from "@/types/dashboard";

export function useDashboard(range: RangeKey, category: CategoryKey) {
    const key = `/api/admin/dashboard?range=${range}&category=${category}`;
    return useSWR<DashboardResponse>(key, swrConfig);
}
