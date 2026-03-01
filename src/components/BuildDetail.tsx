"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { BL4Build, HD2Build } from "@/lib/types";

type BuildDetailProps = {
  build: HD2Build | BL4Build;
  gameType: "helldivers2" | "borderlands4";
  open: boolean;
  onClose: () => void;
  fromCalculator?: boolean;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results?: ArrayLike<ArrayLike<{ transcript?: string }>> }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
};

type FeedbackDifficulty = "trivial" | "easy" | "medium" | "challenging" | "hard" | "extreme" | "suicidal" | "helldive" | "super-helldive";
type FeedbackMissionResult = "success" | "partial" | "failed" | "extracted";

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
  const [feedbackRating, setFeedbackRating] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackDifficulty, setFeedbackDifficulty] = useState<FeedbackDifficulty>("helldive");
  const [feedbackResult, setFeedbackResult] = useState<FeedbackMissionResult>("success");
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const [voiceState, setVoiceState] = useState<"idle" | "listening" | "unsupported">("idle");

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
    const missionName = searchParams.get("mission") ?? "unknown-mission";
    const payload = {
      id: `${build.id}-${Date.now()}`,
      buildId: build.id,
      missionName,
      enemyType: build.faction,
      difficulty: feedbackDifficulty,
      missionResult: feedbackResult,
      performance: feedbackRating,
      textFeedback: feedbackText.trim(),
      userId: "anonymous",
      timestamp: new Date().toISOString(),
    };
    const key = "metaforge-feedback";
    const existing = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    const rows = existing ? (JSON.parse(existing) as typeof payload[]) : [];
    rows.push(payload);
    window.localStorage.setItem(key, JSON.stringify(rows));
    setFeedbackSaved(true);
    setTimeout(() => setFeedbackSaved(false), 1600);
  };

  const onVoiceInput = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognitionCtor =
      (window as Window & { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike })
        .SpeechRecognition ??
      (window as Window & { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setVoiceState("unsupported");
      return;
    }
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setVoiceState("listening");
    recognition.onresult = (event: { results?: ArrayLike<ArrayLike<{ transcript?: string }>> }) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      setFeedbackText((prev) => `${prev}${prev ? " " : ""}${transcript}`.trim());
    };
    recognition.onend = () => setVoiceState("idle");
    recognition.start();
  };

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
              Rate this build after your mission. Feedback is stored locally for future recommendation tuning.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={`${build.id}-feedback-${rating}`}
                  type="button"
                  onClick={() => setFeedbackRating(rating as 1 | 2 | 3 | 4 | 5)}
                  className={`h-9 w-9 rounded-lg border text-sm font-semibold ${
                    feedbackRating >= rating ? "border-blue-400 bg-blue-500/20 text-blue-100" : "border-slate-700 text-slate-300"
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <label className="text-xs text-slate-300">
                Difficulty
                <select
                  value={feedbackDifficulty}
                  onChange={(event) => setFeedbackDifficulty(event.target.value as FeedbackDifficulty)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                >
                  <option value="trivial">Trivial</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="challenging">Challenging</option>
                  <option value="hard">Hard</option>
                  <option value="extreme">Extreme</option>
                  <option value="suicidal">Suicidal</option>
                  <option value="helldive">Helldive</option>
                  <option value="super-helldive">Super Helldive</option>
                </select>
              </label>
              <label className="text-xs text-slate-300">
                Mission Result
                <select
                  value={feedbackResult}
                  onChange={(event) => setFeedbackResult(event.target.value as FeedbackMissionResult)}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                >
                  <option value="success">Complete Success</option>
                  <option value="partial">Partial Success</option>
                  <option value="failed">Failed Mission</option>
                  <option value="extracted">Early Extraction</option>
                </select>
              </label>
            </div>
            <textarea
              value={feedbackText}
              onChange={(event) => setFeedbackText(event.target.value)}
              rows={3}
              placeholder="How did this build perform on your mission?"
              className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onVoiceInput}
                className="inline-flex min-h-10 items-center rounded-lg border border-slate-600 px-3 py-2 text-xs font-semibold text-slate-100 hover:border-blue-400"
              >
                {voiceState === "listening" ? "Listening..." : "Add Voice Note"}
              </button>
              <button
                type="button"
                onClick={onSaveFeedback}
                className="inline-flex min-h-10 items-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500"
              >
                {feedbackSaved ? "Feedback Saved" : "Save Feedback"}
              </button>
              {voiceState === "unsupported" && <span className="text-xs text-rose-300">Voice input not supported on this browser.</span>}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
