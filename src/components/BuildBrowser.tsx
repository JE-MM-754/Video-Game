"use client";

import { useMemo, useState } from "react";

import type { BL4Build, HD2Build, HD2MissionName } from "@/lib/types";

import BuildCard from "@/components/BuildCard";
import BuildFilter from "@/components/BuildFilter";

type SortOption = "rating" | "date" | "popularity" | "successRate";

type BuildBrowserProps =
  | {
      gameType: "helldivers2";
      builds: HD2Build[];
    }
  | {
      gameType: "borderlands4";
      builds: BL4Build[];
    };

type Option = { value: string; label: string };

function sortBuilds<T extends HD2Build | BL4Build>(builds: T[], sortBy: SortOption) {
  return [...builds].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "popularity") return b.views - a.views;
    if (sortBy === "successRate") return b.successRate - a.successRate;
    return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
  });
}

function isHD2Build(build: HD2Build | BL4Build): build is HD2Build {
  return "faction" in build;
}

export default function BuildBrowser(props: BuildBrowserProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [primaryValue, setPrimaryValue] = useState("all");
  const [secondaryValue, setSecondaryValue] = useState("all");
  const [difficultyValue, setDifficultyValue] = useState("all");
  const [comparedBuildIds, setComparedBuildIds] = useState<string[]>([]);

  const filterConfig = useMemo(() => {
    if (props.gameType === "helldivers2") {
      return {
        primaryLabel: "Faction",
        secondaryLabel: "Mission",
        primaryOptions: [
          { value: "all", label: "All" },
          { value: "terminids", label: "Terminids" },
          { value: "automatons", label: "Automatons" },
          { value: "illuminate", label: "Illuminate" },
          { value: "universal", label: "Universal" },
        ] as Option[],
        secondaryOptions: [
          { value: "all", label: "All" },
          { value: "spread-democracy", label: "Spread Democracy" },
          { value: "secure-area", label: "Secure Area" },
          { value: "evacuate-high-value-assets", label: "Evacuate High-Value Assets" },
          { value: "launch-icbm", label: "Launch ICBM" },
          { value: "retrieve-essential-personnel", label: "Retrieve Essential Personnel" },
          { value: "eliminate-chargers", label: "Eliminate Chargers" },
        ] as Option[],
        difficultyOptions: [
          { value: "all", label: "All" },
          { value: "helldive", label: "Helldive" },
          { value: "super-helldive", label: "Super Helldive" },
        ] as Option[],
      };
    }

    return {
      primaryLabel: "Class",
      secondaryLabel: "Build Type",
      primaryOptions: [
        { value: "all", label: "All" },
        { value: "vex", label: "Vex" },
        { value: "rafa", label: "Rafa" },
        { value: "amon", label: "Amon" },
        { value: "harlowe", label: "Harlowe" },
      ] as Option[],
      secondaryOptions: [
        { value: "all", label: "All" },
        { value: "leveling", label: "Leveling" },
        { value: "endgame", label: "Endgame" },
        { value: "boss-killing", label: "Boss Killing" },
        { value: "farming", label: "Farming" },
      ] as Option[],
      difficultyOptions: [
        { value: "all", label: "All" },
        { value: "normal", label: "Normal" },
        { value: "uvh", label: "UVH" },
        { value: "uvh6", label: "UVH6" },
      ] as Option[],
    };
  }, [props.gameType]);

  const filteredBuilds = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = props.builds.filter((build) => {
      const matchesSearch =
        query.length === 0 ||
        build.name.toLowerCase().includes(query) ||
        build.creator.name.toLowerCase().includes(query) ||
        build.description.toLowerCase().includes(query) ||
        build.strategicContext.toLowerCase().includes(query) ||
        ("damageBenchmark" in build && (build.damageBenchmark ?? "").toLowerCase().includes(query));

      const matchesPrimary =
        primaryValue === "all" ||
        (props.gameType === "helldivers2"
          ? (build as HD2Build).faction === primaryValue
          : (build as BL4Build).class === primaryValue);

      const matchesSecondary =
        secondaryValue === "all" ||
        (props.gameType === "helldivers2"
          ? (build as HD2Build).missionFocus?.includes(secondaryValue as HD2MissionName)
          : (build as BL4Build).buildType === secondaryValue);

      const matchesDifficulty = difficultyValue === "all" || build.difficulty === difficultyValue;

      return matchesSearch && matchesPrimary && matchesSecondary && matchesDifficulty;
    });

    return sortBuilds(filtered, sortBy);
  }, [props.builds, props.gameType, difficultyValue, primaryValue, searchTerm, secondaryValue, sortBy]);

  const comparedBuilds = useMemo(
    () => props.builds.filter((build) => comparedBuildIds.includes(build.id)).slice(0, 2),
    [comparedBuildIds, props.builds],
  );

  const toggleCompare = (buildId: string) => {
    setComparedBuildIds((current) => {
      if (current.includes(buildId)) {
        return current.filter((id) => id !== buildId);
      }

      if (current.length >= 2) {
        return [current[1], buildId];
      }

      return [...current, buildId];
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("rating");
    setPrimaryValue("all");
    setSecondaryValue("all");
    setDifficultyValue("all");
  };

  if (!props.builds || props.builds.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center">
        <p className="text-sm text-slate-300">No builds available right now. Check back after data sync.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <BuildFilter
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        primaryLabel={filterConfig.primaryLabel}
        primaryValue={primaryValue}
        onPrimaryValueChange={setPrimaryValue}
        primaryOptions={filterConfig.primaryOptions}
        secondaryLabel={filterConfig.secondaryLabel}
        secondaryValue={secondaryValue}
        onSecondaryValueChange={setSecondaryValue}
        secondaryOptions={filterConfig.secondaryOptions}
        difficultyValue={difficultyValue}
        onDifficultyValueChange={setDifficultyValue}
        difficultyOptions={filterConfig.difficultyOptions}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        totalCount={props.builds.length}
        filteredCount={filteredBuilds.length}
        onClear={clearFilters}
      />

      {comparedBuilds.length > 0 && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-100">Build Comparison</h3>
            <button
              type="button"
              onClick={() => setComparedBuildIds([])}
              className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-blue-400"
            >
              Clear Compare
            </button>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {comparedBuilds.map((build) => (
              <article key={`compare-${build.id}`} className="rounded-xl border border-slate-700 bg-slate-950/70 p-3">
                <p className="text-sm font-semibold text-slate-100">{build.name}</p>
                <p className="text-xs text-slate-400">{build.metaTier}-Tier • {build.creator.name}</p>
                <p className="mt-2 text-xs text-slate-300">Rating: {build.rating.toFixed(1)} • Success: {build.successRate}%</p>
                <p className="text-xs text-slate-300">Patch: {build.patchVersion} • Team coordination: {build.teamCoordination}</p>
                {isHD2Build(build) ? (
                  <p className="text-xs text-slate-300">
                    Faction: {build.faction} • Mission: {(build.missionFocus ?? []).slice(0, 2).join(", ") || build.missionType}
                  </p>
                ) : (
                  <p className="text-xs text-slate-300">Class: {build.class} • Type: {build.buildType}</p>
                )}
                <p className="mt-2 text-xs text-slate-400">{build.whyThisWorks[0]}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {filteredBuilds.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center">
          <p className="text-sm text-slate-300">No builds match your current filters. Try widening your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBuilds.map((build) => (
            <BuildCard
              key={build.id}
              build={build}
              gameType={props.gameType}
              isCompared={comparedBuildIds.includes(build.id)}
              onToggleCompare={toggleCompare}
              disableCompare={comparedBuildIds.length >= 2 && !comparedBuildIds.includes(build.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
