import { RANGES, CATEGORIES, CATEGORY_LABEL } from "@/lib/constants";
import type { CategoryKey, RangeKey } from "@/types/dashboard";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function FiltersBar(props: {
    range: RangeKey;
    onRangeChange: (r: RangeKey) => void;
    category: CategoryKey;
    onCategoryChange: (c: CategoryKey) => void;
    search: string;
    onSearchChange: (q: string) => void;
}) {
    const { range, onRangeChange, category, onCategoryChange, search, onSearchChange } = props;
    return (
        <div className="filter-grid">
            <div className="flex items-center gap-3">
                <span className="filter-label">Range</span>
                <div className="tabs-box">
                    {RANGES.map((r) => (
                        <button
                            key={r}
                            onClick={() => onRangeChange(r)}
                            className={`tabs-pill ${range === r ? "tabs-pill--active" : ""}`}
                            aria-pressed={range === r}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-3 justify-center">
                <span className="filter-label">Category</span>
                <Select value={category} onValueChange={(v) => onCategoryChange((v ?? "all") as CategoryKey)}>
                    <SelectTrigger aria-label="Select category">
                        <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {CATEGORIES.map((c) => (
                            <SelectItem key={c} value={c}>{CATEGORY_LABEL[c]}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center justify-end">
                <input
                    className="input-search"
                    placeholder="Search players…"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    aria-label="Search players"
                />
            </div>
        </div>
    );
}
