import { useSWR, swrConfig } from "@/lib/swr";
import type { PlayersResponse, RangeKey, CategoryKey } from "@/types/dashboard";

export function usePlayers(range: RangeKey, category: CategoryKey, q: string) {
    const qs = new URLSearchParams({ range, category, q: q.trim() }).toString();
    const key = `/api/admin/players?${qs}`;
    return useSWR<PlayersResponse>(key, swrConfig);
}
