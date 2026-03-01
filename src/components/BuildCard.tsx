"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { BL4Build, HD2Build } from "@/lib/types";

import BuildDetail from "@/components/BuildDetail";

type BuildCardProps = {
  build: HD2Build | BL4Build;
  gameType: "helldivers2" | "borderlands4";
  isCompared?: boolean;
  onToggleCompare?: (buildId: string) => void;
  disableCompare?: boolean;
};

const hd2FactionColors: Record<HD2Build["faction"], string> = {
  automatons: "bg-blue-500/20 text-blue-200 border-blue-400/40",
  terminids: "bg-emerald-500/20 text-emerald-200 border-emerald-400/40",
  illuminate: "bg-purple-500/20 text-purple-200 border-purple-400/40",
  universal: "bg-slate-500/20 text-slate-200 border-slate-400/40",
};

const bl4RoleColors: Record<"damage" | "tank" | "support" | "speed", string> = {
  damage: "bg-red-500/20 text-red-200 border-red-400/40",
  tank: "bg-blue-500/20 text-blue-200 border-blue-400/40",
  support: "bg-emerald-500/20 text-emerald-200 border-emerald-400/40",
  speed: "bg-yellow-500/20 text-yellow-200 border-yellow-400/40",
};

function renderStars(rating: number) {
  const rounded = Math.round(rating * 2) / 2;
  const full = Math.floor(rounded);
  const half = rounded % 1 !== 0;

  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const isFull = i < full;
        const isHalf = i === full && half;
        return (
          <span key={`star-${i}`} className={isFull || isHalf ? "text-yellow-300" : "text-slate-600"}>
            {isHalf ? "⯪" : "★"}
          </span>
        );
      })}
      <span className="ml-1 text-xs font-semibold text-slate-300">{rating.toFixed(1)}</span>
    </div>
  );
}

function inferBl4Role(build: BL4Build): "damage" | "tank" | "support" | "speed" {
  const tags = new Set(build.tags.map((tag) => tag.toLowerCase()));
  if (tags.has("support") || tags.has("utility") || tags.has("co-op")) return "support";
  if (tags.has("tank") || tags.has("survivability")) return "tank";
  if (tags.has("speed") || build.buildType === "farming") return "speed";
  return "damage";
}

function isHD2Build(build: HD2Build | BL4Build): build is HD2Build {
  return "faction" in build;
}

function formatMissionLabel(mission: string) {
  return mission
    .split("-")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

function getCreatorBadges(build: HD2Build | BL4Build) {
  const badges: { label: string; className: string }[] = [];
  const creator = build.creator.name;

  if (creator.includes("OhDough")) {
    badges.push({ label: "OhDough Optimized", className: "border-purple-500/40 bg-purple-500/20 text-purple-200" });
  }
  if (creator.includes("Sovereign Gene")) {
    badges.push({ label: "Tier List Validated", className: "border-blue-500/40 bg-blue-500/20 text-blue-200" });
  }
  if (creator.includes("Claysthetics")) {
    badges.push({ label: "Community Tested", className: "border-emerald-500/40 bg-emerald-500/20 text-emerald-200" });
  }
  if (creator.includes("BuzzLiteBeer")) {
    badges.push({ label: "Meta Analysis", className: "border-orange-500/40 bg-orange-500/20 text-orange-200" });
  }
  if (creator.includes("Moxsy")) {
    badges.push({ label: "Moxsy Intelligence", className: "border-red-500/40 bg-red-500/20 text-red-200" });
  }

  if (isHD2Build(build) && build.metaRating?.february2026 && build.metaRating.february2026 >= 90) {
    badges.push({ label: "Meta S-Tier", className: "border-amber-400/40 bg-amber-500/20 text-amber-200" });
  }
  if (isHD2Build(build) && Array.isArray(build.missionFocus) && build.missionFocus.length > 0) {
    badges.push({ label: "Mission Optimized", className: "border-orange-500/40 bg-orange-500/20 text-orange-200" });
  }

  return badges;
}

export default function BuildCard({ build, gameType, isCompared, onToggleCompare, disableCompare }: BuildCardProps) {
  const searchParams = useSearchParams();
  const [detailOpen, setDetailOpen] = useState(false);
  const successBarColor =
    build.successRate >= 85 ? "bg-emerald-400" : build.successRate >= 75 ? "bg-blue-400" : "bg-yellow-400";
  const creatorBadges = getCreatorBadges(build);

  useEffect(() => {
    const queryBuild = searchParams.get("build");
    if (queryBuild === build.id) setDetailOpen(true);
  }, [build.id, searchParams]);

  return (
    <article
      id={build.id}
      className="h-full scroll-mt-28 rounded-2xl border border-slate-700 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/40"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-bold leading-tight text-slate-100">{build.name}</h2>
        <div className="flex flex-col items-end gap-1">
          <span className="rounded-full border border-amber-300/40 bg-amber-500/20 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-200">
            {build.metaTier}-Tier
          </span>
          <span
            className={`rounded-full border px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${
              build.patchCompatible
                ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-200"
                : "border-red-400/40 bg-red-500/20 text-red-200"
            }`}
          >
            {build.patchCompatible ? `Patch ${build.patchVersion}` : "Outdated"}
          </span>
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-300">{build.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {isHD2Build(build) ? (
          <>
            <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${hd2FactionColors[build.faction]}`}>
              {build.faction}
            </span>
            <span className="rounded-full border border-slate-600 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200">
              {formatMissionLabel(build.missionFocus?.[0] ?? build.missionType)}
            </span>
            <span className="rounded-full border border-slate-600 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200">
              {build.difficulty}
            </span>
          </>
        ) : (
          <>
            <span className="rounded-full border border-indigo-400/40 bg-indigo-500/20 px-2.5 py-1 text-xs font-semibold text-indigo-200">
              {build.class}
            </span>
            <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${bl4RoleColors[inferBl4Role(build)]}`}>
              {inferBl4Role(build)}
            </span>
            <span className="rounded-full border border-slate-600 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200">
              {build.buildType}
            </span>
            {build.damageBenchmark && (
              <span className="rounded-full border border-red-400/40 bg-red-500/20 px-2.5 py-1 text-xs font-semibold text-red-200">
                {build.damageBenchmark}
              </span>
            )}
          </>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">Why this works</p>
        <p className="mt-1 text-sm text-slate-300">{build.whyThisWorks[0]}</p>
      </div>

      <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">When to use</p>
        <p className="mt-1 text-sm text-slate-300">{build.whenToUse.slice(0, 2).join(" • ")}</p>
        {build.whenToAvoid && build.whenToAvoid.length > 0 && (
          <p className="mt-1 text-xs text-rose-200/80">Avoid: {build.whenToAvoid[0]}</p>
        )}
      </div>

      {isHD2Build(build) && build.strategyPhases && (
        <div className="mt-3 rounded-xl border border-blue-500/30 bg-blue-900/20 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-200">Boss Strategy</p>
          <p className="mt-1 text-xs text-slate-200">Phase 1: {build.strategyPhases.phase1}</p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        {renderStars(build.rating)}
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{build.views.toLocaleString()} views</p>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-300">
          <span>Success Rate</span>
          <span>{build.successRate}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-800">
          <div className={`h-2 rounded-full ${successBarColor}`} style={{ width: `${build.successRate}%` }} />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
        <p className="truncate text-sm font-semibold text-slate-100">
          {build.creator.name}
          {build.creator.verified && <span className="ml-1 text-blue-300">✓ Verified</span>}
        </p>
        <p className="text-xs uppercase tracking-wide text-slate-400">
          {build.creator.platform} • Credibility {build.creator.credibilityScore}
        </p>
        {creatorBadges.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {creatorBadges.map((badge) => (
              <span key={`${build.id}-${badge.label}`} className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${badge.className}`}>
                {badge.label === "Community Tested" ? "🎯 Community Tested" : badge.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setDetailOpen(true)}
          className="inline-flex min-h-11 items-center rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-blue-200 transition hover:bg-slate-700"
        >
          View Full Build Details
        </button>
        {onToggleCompare && (
          <button
            type="button"
            disabled={disableCompare && !isCompared}
            onClick={() => onToggleCompare(build.id)}
            className="inline-flex min-h-11 items-center rounded-lg border border-slate-600 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-400 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isCompared ? "Remove Compare" : "Compare"}
          </button>
        )}
      </div>

      <BuildDetail build={build} gameType={gameType} open={detailOpen} onClose={() => setDetailOpen(false)} />
    </article>
  );
}
