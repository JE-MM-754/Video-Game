"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { BL4Build, HD2Build } from "@/lib/types";
import {
  computeEffectivenessMetrics,
  type FeedbackEntry,
} from "@/lib/feedback-analytics";
import {
  RLFeedbackManager,
  type RLEnemyType,
  type RLFeedbackDifficulty,
} from "@/lib/rl-feedback";

type BuildDetailProps = {
  build: HD2Build | BL4Build;
  gameType: "helldivers2" | "borderlands4";
  open: boolean;
  onClose: () => void;
  fromCalculator?: boolean;
};

function isHD2Build(build: HD2Build | BL4Build): build is HD2Build {
  return "loadout" in build;
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
    badges.push({ label: "🎯 Community Tested", className: "border-emerald-500/40 bg-emerald-500/20 text-emerald-200" });
  }
  if (creator.includes("BuzzLiteBeer")) {
    badges.push({ label: "Meta Analysis", className: "border-orange-500/40 bg-orange-500/20 text-orange-200" });
  }
  if (creator.includes("Moxsy")) {
    badges.push({ label: "Moxsy Intelligence", className: "border-red-500/40 bg-red-500/20 text-red-200" });
  }
  if (isHD2Build(build) && Array.isArray(build.missionFocus) && build.missionFocus.length > 0) {
    badges.push({ label: "🎖️ Mission Optimized", className: "border-orange-500/40 bg-orange-500/20 text-orange-200" });
  }

  return badges;
}

function buildCopyText(build: HD2Build | BL4Build) {
  const header = `${build.name} (${build.patchVersion})`;

  if (isHD2Build(build)) {
    return [
      header,
      `Primary: ${build.loadout.primary}`,
      `Secondary: ${build.loadout.secondary}`,
      `Grenade: ${build.loadout.grenade}`,
      `Stratagems: ${build.loadout.stratagems.join(", ")}`,
      `Armor: ${build.loadout.armor}`,
      build.loadout.cape ? `Cape: ${build.loadout.cape}` : undefined,
      `When to use: ${build.whenToUse.join(" | ")}`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    header,
    `Action Skill: ${build.skillTree.actionSkill}`,
    `Key Skills: ${build.skillTree.keySkills.join(", ")}`,
    `Weapons: ${build.gear.weapons.join(", ")}`,
    `Shield: ${build.gear.shield}`,
    `Grenade Mod: ${build.gear.grenadeMod}`,
    `Class Mod: ${build.gear.classMod}`,
    `Artifact: ${build.gear.artifact}`,
    `When to use: ${build.whenToUse.join(" | ")}`,
  ].join("\n");
}

export default function BuildDetail({ build, gameType, open, onClose, fromCalculator = false }: BuildDetailProps) {
  const searchParams = useSearchParams();
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const creatorBadges = useMemo(() => getCreatorBadges(build), [build]);
  const [feedbackRating, setFeedbackRating] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackResult, setFeedbackResult] = useState<"success" | "failed">("success");
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const [issuesEncountered, setIssuesEncountered] = useState<string[]>([]);
  const [highlightsNoted, setHighlightsNoted] = useState<string[]>([]);
  const [feedbackSummary, setFeedbackSummary] = useState<{
    sampleSize: number;
    meanEffectiveness: number;
    reliabilityScore: number;
  } | null>(null);

  const issueOptions = ["Low Damage", "Died Too Much", "Ran Out of Ammo", "Too Slow", "Bad vs Boss", "Team Problems"];
  const highlightOptions = ["High Damage", "Good Survivability", "Team Synergy", "Mobility", "Ammo Efficiency", "Boss Killing"];

  const toggleArrayValue = (value: string, setter: (updater: (prev: string[]) => string[]) => void) => {
    setter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  const copyText = useMemo(() => buildCopyText(build), [build]);

  const onCopyLoadout = async () => {
    const nav = typeof window !== "undefined" ? window.navigator : undefined;

    try {
      if (!nav?.clipboard) return;
      await nav.clipboard.writeText(copyText);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 1600);
    } catch {
      setCopyState("idle");
    }
  };

  const onSaveFeedback = () => {
    if (!isHD2Build(build)) return;
    if (feedbackRating === 0) return;
    const missionName = searchParams?.get("mission") ?? "unknown-mission";
    const enemyFromQuery = searchParams?.get("faction");
    const teamFromQuery = searchParams?.get("team");
    const hiveLordFromQuery = searchParams?.get("hiveLord");
    const difficultyFromQuery = searchParams?.get("difficulty");
    const teamSize =
      teamFromQuery === "squad" ? 4 : teamFromQuery === "duo" ? 2 : teamFromQuery === "solo" ? 1 : teamFromQuery === "randoms" ? 1 : 1;
    const enemyType: RLEnemyType =
      enemyFromQuery === "automatons" || enemyFromQuery === "illuminate" || enemyFromQuery === "terminids"
        ? enemyFromQuery
        : build.faction === "universal"
          ? "terminids"
          : build.faction;
    const derivedDifficulty: RLFeedbackDifficulty =
      difficultyFromQuery === "easy" ||
      difficultyFromQuery === "medium" ||
      difficultyFromQuery === "hard" ||
      difficultyFromQuery === "challenging" ||
      difficultyFromQuery === "extreme" ||
      difficultyFromQuery === "suicidal" ||
      difficultyFromQuery === "helldive" ||
      difficultyFromQuery === "super-helldive" ||
      difficultyFromQuery === "trivial"
        ? difficultyFromQuery
        : "helldive";

    const manager = RLFeedbackManager.getInstance();
    const stored = manager.saveFeedback({
      build,
      missionName,
      enemyType,
      difficulty: derivedDifficulty,
      teamSize,
      hiveLordPresent: hiveLordFromQuery === "1",
      userRating: feedbackRating,
      missionResult: feedbackResult === "success" ? "complete_success" : "mission_failed",
      objectivesCompleted: feedbackResult === "success" ? 1 : 0,
      totalObjectives: 1,
      textFeedback: feedbackText.trim(),
      issuesEncountered,
      highlightsNoted,
      specialModifiers: [],
    });

    console.info(
      `RL feedback stored: ${stored.buildName} on ${stored.missionName} (${stored.enemyType}) rating ${stored.userRating}/5 confidence ${stored.confidenceScore.toFixed(2)}`,
    );

    const key = "metaforge-feedback";
    const existing = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    const rows = existing ? (JSON.parse(existing) as FeedbackEntry[]) : [];
    const buildRows = rows.filter((entry) => entry.buildId === build.id);
    const metrics = computeEffectivenessMetrics(buildRows);
    setFeedbackSummary({
      sampleSize: metrics.sampleSize,
      meanEffectiveness: metrics.meanEffectiveness,
      reliabilityScore: metrics.reliabilityScore,
    });
    setFeedbackSaved(true);
    setTimeout(() => setFeedbackSaved(false), 1600);
  };

  useEffect(() => {
    if (!isHD2Build(build)) return;
    const key = "metaforge-feedback";
    const existing = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    const rows = existing ? (JSON.parse(existing) as FeedbackEntry[]) : [];
    const buildRows = rows.filter((entry) => entry.buildId === build.id);
    if (buildRows.length === 0) {
      setFeedbackSummary(null);
      return;
    }
    const metrics = computeEffectivenessMetrics(buildRows);
    setFeedbackSummary({
      sampleSize: metrics.sampleSize,
      meanEffectiveness: metrics.meanEffectiveness,
      reliabilityScore: metrics.reliabilityScore,
    });
  }, [build]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/90 p-2 sm:p-4" role="dialog" aria-modal="true" aria-label={`${build.name} details`}>
      <div className="max-h-[96vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              {fromCalculator ? "Calculator > Results > Build Detail" : "Build Browser > Build Detail"}
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-100 sm:text-3xl">{build.name}</h2>
            <p className="mt-2 max-w-3xl text-base text-slate-300">{build.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-blue-400"
          >
            Back to Results
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
            <p className="text-xs uppercase text-slate-400">Creator</p>
            <p className="mt-1 text-base font-semibold text-slate-100">
              {build.creator.name}
              {build.creator.verified && <span className="ml-1 text-blue-300">✓</span>}
            </p>
            {creatorBadges.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {creatorBadges.map((badge) => (
                  <span key={`${build.id}-${badge.label}`} className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${badge.className}`}>
                    {badge.label}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
            <p className="text-xs uppercase text-slate-400">Patch</p>
            <p className="mt-1 text-base font-semibold text-slate-100">{build.patchVersion}</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
            <p className="text-xs uppercase text-slate-400">Success Rate</p>
            <p className="mt-1 text-base font-semibold text-slate-100">{build.successRate}%</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
            <p className="text-xs uppercase text-slate-400">Validation</p>
            <p className="mt-1 text-base font-semibold text-slate-100">{build.communityValidation.toLocaleString()}</p>
          </div>
        </div>

        <section className="mt-4 rounded-xl border border-slate-700 bg-slate-950/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Why This Works</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-200">
            {build.whyThisWorks.map((item) => (
              <li key={`${build.id}-why-${item}`}>• {item}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-slate-300">{build.strategicContext}</p>
        </section>

        {isHD2Build(build) && build.strategyPhases && (
          <section className="mt-4 rounded-xl border border-blue-500/30 bg-blue-900/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Boss Fight Strategy</p>
            <div className="mt-2 space-y-2 text-sm text-slate-100">
              <p><span className="font-semibold text-blue-200">Phase 1:</span> {build.strategyPhases.phase1}</p>
              <p><span className="font-semibold text-blue-200">Phase 2:</span> {build.strategyPhases.phase2}</p>
              <p><span className="font-semibold text-blue-200">Phase 3:</span> {build.strategyPhases.phase3}</p>
              <p><span className="font-semibold text-blue-200">Phase 4:</span> {build.strategyPhases.phase4}</p>
            </div>
          </section>
        )}

        {isHD2Build(build) && build.effectiveness && (
          <section className="mt-4 rounded-xl border border-slate-700 bg-slate-950/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Meta Effectiveness</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <p className="text-sm text-slate-200">Hive Lord: {build.effectiveness.hivelord ?? "N/A"}%</p>
              <p className="text-sm text-slate-200">Chargers: {build.effectiveness.chargers ?? "N/A"}%</p>
              <p className="text-sm text-slate-200">Swarms: {build.effectiveness.swarms ?? "N/A"}%</p>
              <p className="text-sm text-slate-200">Sustainability: {build.effectiveness.sustainability ?? "N/A"}%</p>
            </div>
          </section>
        )}

        {!isHD2Build(build) && (
          <section className="mt-4 rounded-xl border border-slate-700 bg-slate-950/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Build Performance</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <p className="text-sm text-slate-200">Damage Benchmark: {build.damageBenchmark ?? "N/A"}</p>
              <p className="text-sm text-slate-200">Patch Status: {build.patchStatus ?? "current"}</p>
              <p className="text-sm text-slate-200">Complexity: {build.complexity ?? "intermediate"}</p>
              <p className="text-sm text-slate-200">Gear Dependency: {build.gearDependency ?? "medium"}</p>
            </div>
            {!!build.performanceNotes?.length && (
              <ul className="mt-3 space-y-1 text-sm text-slate-300">
                {build.performanceNotes.map((note) => (
                  <li key={`${build.id}-perf-${note}`}>• {note}</li>
                ))}
              </ul>
            )}
          </section>
        )}

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Complete Loadout</p>
            {isHD2Build(build) ? (
              <div className="mt-2 space-y-2 text-sm text-slate-200">
                <p><span className="font-semibold">Primary:</span> {build.loadout.primary}</p>
                <p><span className="font-semibold">Secondary:</span> {build.loadout.secondary}</p>
                <p><span className="font-semibold">Grenade:</span> {build.loadout.grenade}</p>
                <p><span className="font-semibold">Stratagems:</span> {build.loadout.stratagems.join(", ")}</p>
                <p><span className="font-semibold">Armor:</span> {build.loadout.armor}</p>
                {build.loadout.cape && <p><span className="font-semibold">Cape:</span> {build.loadout.cape}</p>}
              </div>
            ) : (
              <div className="mt-2 space-y-2 text-sm text-slate-200">
                <p><span className="font-semibold">Action Skill:</span> {build.skillTree.actionSkill}</p>
                <p><span className="font-semibold">Key Skills:</span> {build.skillTree.keySkills.join(", ")}</p>
                <p><span className="font-semibold">Weapons:</span> {build.gear.weapons.join(", ")}</p>
                <p><span className="font-semibold">Shield:</span> {build.gear.shield}</p>
                <p><span className="font-semibold">Grenade Mod:</span> {build.gear.grenadeMod}</p>
                <p><span className="font-semibold">Class Mod:</span> {build.gear.classMod}</p>
                <p><span className="font-semibold">Artifact:</span> {build.gear.artifact}</p>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Tactical Advice</p>
            <p className="mt-2 text-sm font-semibold text-emerald-200">When to use</p>
            <ul className="mt-1 space-y-1 text-sm text-slate-200">
              {build.whenToUse.map((item) => (
                <li key={`${build.id}-use-${item}`}>• {item}</li>
              ))}
            </ul>
            {!!build.whenToAvoid?.length && (
              <>
                <p className="mt-3 text-sm font-semibold text-rose-200">When to avoid</p>
                <ul className="mt-1 space-y-1 text-sm text-slate-200">
                  {build.whenToAvoid.map((item) => (
                    <li key={`${build.id}-avoid-${item}`}>• {item}</li>
                  ))}
                </ul>
              </>
            )}
            {!!build.advancedTactics?.length && (
              <>
                <p className="mt-3 text-sm font-semibold text-blue-200">Advanced tactics</p>
                <ul className="mt-1 space-y-1 text-sm text-slate-200">
                  {build.advancedTactics.map((item) => (
                    <li key={`${build.id}-advanced-${item}`}>• {item}</li>
                  ))}
                </ul>
              </>
            )}
            {!!build.optimizationTips?.length && (
              <>
                <p className="mt-3 text-sm font-semibold text-cyan-200">Optimization tips</p>
                <ul className="mt-1 space-y-1 text-sm text-slate-200">
                  {build.optimizationTips.map((item) => (
                    <li key={`${build.id}-tips-${item}`}>• {item}</li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onCopyLoadout}
            className="inline-flex min-h-11 items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            {copyState === "copied" ? "Loadout Copied" : "Copy Loadout"}
          </button>
          <a
            href={build.creator.channelUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-blue-400"
          >
            Creator Channel
          </a>
          {fromCalculator && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-11 items-center rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-blue-400"
            >
              Try Another Build
            </button>
          )}
          <span className="inline-flex min-h-11 items-center rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-slate-300">
            {gameType === "helldivers2" ? "Helldivers 2" : "Borderlands 4"} • {build.metaTier}-Tier
          </span>
        </div>

        {isHD2Build(build) && (
          <section className="mt-4 rounded-xl border border-slate-700 bg-slate-950/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Post-Mission Feedback</p>
            <p className="mt-1 text-sm text-slate-300">
              Quick feedback helps tune future recommendations. Only star rating is required.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={`${build.id}-feedback-${rating}`}
                  type="button"
                  onClick={() => setFeedbackRating(rating as 1 | 2 | 3 | 4 | 5)}
                  className={`h-10 w-10 rounded-lg border text-base font-semibold ${
                    feedbackRating >= rating ? "border-blue-400 bg-blue-500/20 text-blue-100" : "border-slate-700 text-slate-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-xs text-slate-300">Mission outcome</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setFeedbackResult("success")}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                    feedbackResult === "success"
                      ? "border-emerald-400 bg-emerald-500/20 text-emerald-100"
                      : "border-slate-700 bg-slate-900 text-slate-200"
                  }`}
                >
                  Mission Success
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackResult("failed")}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                    feedbackResult === "failed"
                      ? "border-rose-400 bg-rose-500/20 text-rose-100"
                      : "border-slate-700 bg-slate-900 text-slate-200"
                  }`}
                >
                  Mission Failed
                </button>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-slate-300">What worked well? (Optional)</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {highlightOptions.map((option) => (
                  <button
                    key={`${build.id}-highlight-${option}`}
                    type="button"
                    onClick={() => toggleArrayValue(option, setHighlightsNoted)}
                    className={`rounded-full border px-3 py-1 text-xs ${
                      highlightsNoted.includes(option)
                        ? "border-emerald-400 bg-emerald-500/20 text-emerald-100"
                        : "border-slate-700 bg-slate-900 text-slate-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-slate-300">Any issues? (Optional)</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {issueOptions.map((option) => (
                  <button
                    key={`${build.id}-issue-${option}`}
                    type="button"
                    onClick={() => toggleArrayValue(option, setIssuesEncountered)}
                    className={`rounded-full border px-3 py-1 text-xs ${
                      issuesEncountered.includes(option)
                        ? "border-rose-400 bg-rose-500/20 text-rose-100"
                        : "border-slate-700 bg-slate-900 text-slate-200"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={feedbackText}
              onChange={(event) => setFeedbackText(event.target.value)}
              rows={3}
              placeholder="Quick note (optional)"
              className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
              maxLength={200}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onSaveFeedback}
                disabled={feedbackRating === 0}
                className="inline-flex min-h-10 items-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {feedbackSaved ? "Feedback Saved" : feedbackRating === 0 ? "Rate The Build First" : "Save Feedback"}
              </button>
            </div>
            {feedbackSummary && (
              <div className="mt-3 rounded-lg border border-cyan-500/30 bg-cyan-900/20 p-3 text-xs text-cyan-100">
                <p>Community sample: {feedbackSummary.sampleSize} reports</p>
                <p>Weighted effectiveness: {Math.round(feedbackSummary.meanEffectiveness * 100)}%</p>
                <p>Feedback reliability: {Math.round(feedbackSummary.reliabilityScore * 100)}%</p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
