"use client";

type FilterOption = {
  value: string;
  label: string;
};

type SortOption = "rating" | "date" | "popularity" | "successRate";

type BuildFilterProps = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  primaryLabel: string;
  primaryValue: string;
  onPrimaryValueChange: (value: string) => void;
  primaryOptions: FilterOption[];
  secondaryLabel: string;
  secondaryValue: string;
  onSecondaryValueChange: (value: string) => void;
  secondaryOptions: FilterOption[];
  difficultyValue: string;
  onDifficultyValueChange: (value: string) => void;
  difficultyOptions: FilterOption[];
  sortBy: SortOption;
  onSortByChange: (value: SortOption) => void;
  totalCount: number;
  filteredCount: number;
  onClear: () => void;
};

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "rating", label: "Top Rated" },
  { value: "date", label: "Newest" },
  { value: "popularity", label: "Most Viewed" },
  { value: "successRate", label: "Best Success Rate" },
];

function isActiveFilter(value: string) {
  return value !== "all";
}

export default function BuildFilter({
  searchTerm,
  onSearchTermChange,
  primaryLabel,
  primaryValue,
  onPrimaryValueChange,
  primaryOptions,
  secondaryLabel,
  secondaryValue,
  onSecondaryValueChange,
  secondaryOptions,
  difficultyValue,
  onDifficultyValueChange,
  difficultyOptions,
  sortBy,
  onSortByChange,
  totalCount,
  filteredCount,
  onClear,
}: BuildFilterProps) {
  const hasFilters = Boolean(searchTerm.trim()) || [primaryValue, secondaryValue, difficultyValue].some(isActiveFilter);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-slate-100">Find Your Build</h2>
        <p className="text-sm text-slate-300">
          Showing <span className="font-semibold text-blue-300">{filteredCount}</span> of {totalCount}
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="sm:col-span-2 lg:col-span-2">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Search</span>
          <input
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            placeholder="Build name or creator"
            className="min-h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none ring-blue-400 transition focus:ring-2"
          />
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Sort By</span>
          <select
            value={sortBy}
            onChange={(event) => onSortByChange(event.target.value as SortOption)}
            className="min-h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none ring-blue-400 transition focus:ring-2"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onClear}
            disabled={!hasFilters}
            className="min-h-11 w-full rounded-lg border border-slate-700 px-3 text-sm font-semibold text-slate-200 transition hover:border-blue-400 hover:text-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-300">{primaryLabel}</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {primaryOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onPrimaryValueChange(option.value)}
                className={`min-h-11 shrink-0 rounded-full border px-3 py-2 text-sm font-semibold capitalize transition ${
                  primaryValue === option.value
                    ? "border-blue-400 bg-blue-500/20 text-blue-200"
                    : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">{secondaryLabel}</span>
          <select
            value={secondaryValue}
            onChange={(event) => onSecondaryValueChange(event.target.value)}
            className="min-h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none ring-blue-400 transition focus:ring-2"
          >
            {secondaryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Difficulty</span>
          <select
            value={difficultyValue}
            onChange={(event) => onDifficultyValueChange(event.target.value)}
            className="min-h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none ring-blue-400 transition focus:ring-2"
          >
            {difficultyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
