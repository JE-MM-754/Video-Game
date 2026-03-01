"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  calculateBL4BuildScore,
  calculateHD2BuildScore,
  getBL4Recommendations,
  getHD2Recommendations,
} from "@/lib/calculator-logic";
import { getBL4HybridInsight, getHD2HybridInsight } from "@/lib/hybrid-engine";
import type { BL4Build, BL4CalculatorInput, HD2Build, HD2CalculatorInput } from "@/lib/types";

import BuildDetail from "@/components/BuildDetail";

type HD2FormState = Partial<HD2CalculatorInput>;
type BL4FormState = Partial<BL4CalculatorInput>;

type BuildCalculatorProps =
  | {
      gameType: "helldivers2";
      builds: HD2Build[];
    }
  | {
      gameType: "borderlands4";
      builds: BL4Build[];
    };

type Option = {
  value: string;
  label: string;
  help: string;
};

const hd2DifficultyLevels: { value: HD2CalculatorInput["difficulty"]; label: string; subtitle: string }[] = [
  { value: "easy", label: "Easy", subtitle: "Quickplay warm-up" },
  { value: "medium", label: "Medium", subtitle: "Steady pressure" },
  { value: "hard", label: "Hard", subtitle: "Demanding waves" },
  { value: "expert", label: "Expert", subtitle: "Helldive" },
  { value: "nightmare", label: "Nightmare", subtitle: "Super Helldive" },
];

const hd2Keys = {
  faction: ["terminids", "automatons", "illuminate"] as const,
  missionName: [
    "eradicate-terminid-swarm",
    "eradicate-automaton-forces",
    "eradicate-illuminate-forces",
    "repel-invasion-fleet",
    "blitz-search-destroy-terminids",
    "blitz-search-destroy-automatons",
    "eliminate-bile-titan",
    "eliminate-charger",
    "eliminate-brood-commander",
    "eliminate-hulk",
    "eliminate-devastator",
    "emergency-evacuation",
    "evacuate-high-value-assets",
    "launch-icbm",
    "pump-fuel-to-icbm",
    "activate-e-710-pumps",
    "enable-e-710-extraction",
    "sabotage-supply-bases",
    "destroy-command-bunkers",
    "sabotage-air-base",
    "destroy-transmission-network",
    "destroy-warp-ships",
    "conduct-geological-survey",
    "retrieve-valuable-data",
    "upload-escape-pod-data",
    "terminate-illegal-broadcast",
    "spread-democracy",
    "purge-hatcheries",
  ] as const,
  difficulty: ["easy", "medium", "hard", "expert", "nightmare"] as const,
  teamSize: ["solo", "duo", "squad", "randoms"] as const,
  playstyle: ["balanced", "aggressive", "support", "stealth"] as const,
};

const bl4Keys = {
  class: ["vex", "rafa", "amon", "harlowe"] as const,
  buildType: ["leveling", "endgame", "boss-killing", "farming"] as const,
  difficulty: ["normal", "uvh", "uvh6"] as const,
  playstyle: ["damage", "tank", "support", "speed"] as const,
};

function OptionChips({
  label,
  description,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  options: Option[];
  value?: string;
  onChange: (next: string) => void;
  disabled?: boolean;
}) {
  return (
    <section className={`rounded-2xl border p-4 sm:p-5 ${disabled ? "border-slate-800/60 bg-slate-900/30" : "border-slate-800 bg-slate-900/70"}`}>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">{label}</p>
      <p className="mt-1 text-base text-slate-200">{description}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={`min-h-14 rounded-xl border px-3 py-2 text-left text-base transition ${
                active
                  ? "border-blue-400 bg-blue-500/20 text-blue-100"
                  : "border-slate-700 bg-slate-950 text-slate-100 hover:border-slate-500"
              } disabled:cursor-not-allowed disabled:opacity-45`}
            >
              <span className="block font-semibold">{option.label}</span>
              <span className="mt-1 block text-sm text-slate-300">{option.help}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function isAllowed<T extends readonly string[]>(value: string | null, allowed: T): value is T[number] {
  return !!value && allowed.includes(value);
}

function getProgress(total: number, selected: number) {
  return Math.round((selected / total) * 100);
}

function isCompleteHD2(input: HD2FormState): input is HD2CalculatorInput {
  return Boolean(input.missionName && input.faction && input.difficulty && input.teamSize && input.playstyle);
}

function isCompleteBL4(input: BL4FormState): input is BL4CalculatorInput {
  return Boolean(input.class && input.buildType && input.difficulty && input.playstyle);
}

function normalizeHD2Difficulty(difficulty: HD2CalculatorInput["difficulty"]) {
  return difficulty === "nightmare" ? "super-helldive" : "helldive";
}

function normalizeHD2Playstyle(playstyle: HD2CalculatorInput["playstyle"]) {
  return playstyle === "balanced" ? "versatile" : playstyle;
}

function prettyMissionName(missionName: HD2CalculatorInput["missionName"]) {
  const labels: Record<HD2CalculatorInput["missionName"], string> = {
    "eradicate-terminid-swarm": "Eradicate Terminid Swarm",
    "eradicate-automaton-forces": "Eradicate Automaton Forces",
    "eradicate-illuminate-forces": "Eradicate Illuminate Forces",
    "repel-invasion-fleet": "Repel Invasion Fleet",
    "blitz-search-destroy-terminids": "Blitz: Search & Destroy (Terminids)",
    "blitz-search-destroy-automatons": "Blitz: Search & Destroy (Automatons)",
    "eliminate-bile-titan": "Eliminate Bile Titan",
    "eliminate-charger": "Eliminate Charger",
    "eliminate-brood-commander": "Eliminate Brood Commander",
    "eliminate-hulk": "Eliminate Hulk",
    "eliminate-devastator": "Eliminate Devastator",
    "emergency-evacuation": "Emergency Evacuation",
    "evacuate-high-value-assets": "Evacuate High-Value Assets",
    "launch-icbm": "Launch ICBM",
    "pump-fuel-to-icbm": "Pump Fuel to ICBM",
    "activate-e-710-pumps": "Activate E-710 Pumps",
    "enable-e-710-extraction": "Enable E-710 Extraction",
    "sabotage-supply-bases": "Sabotage Supply Bases",
    "destroy-command-bunkers": "Destroy Command Bunkers",
    "sabotage-air-base": "Sabotage Air Base",
    "destroy-transmission-network": "Destroy Transmission Network",
    "destroy-warp-ships": "Destroy Warp Ships (Illuminate)",
    "conduct-geological-survey": "Conduct Geological Survey",
    "retrieve-valuable-data": "Retrieve Valuable Data",
    "upload-escape-pod-data": "Upload Escape Pod Data",
    "terminate-illegal-broadcast": "Terminate Illegal Broadcast",
    "spread-democracy": "Spread Democracy",
    "purge-hatcheries": "Purge Hatcheries",
  };
  return labels[missionName];
}

function buildHD2Reasons(build: HD2Build, input: HD2FormState, hiveLordMode: boolean): string[] {
  const reasons: string[] = [];
  const normalizedDifficulty = input.difficulty ? normalizeHD2Difficulty(input.difficulty) : null;
  const normalizedPlaystyle = input.playstyle ? normalizeHD2Playstyle(input.playstyle) : null;

  if (input.faction) {
    reasons.push(`Faction fit: ${build.faction === input.faction ? "exact" : "universal fallback"}.`);
  }
  if (input.missionName) {
    reasons.push(`Mission fit: optimized for ${prettyMissionName(input.missionName)} objectives.`);
  }
  if (input.missionName && build.missionFocus?.includes(input.missionName)) {
    reasons.push(`Exact mission profile match for ${prettyMissionName(input.missionName)}.`);
  }

  if (input.teamSize === "randoms") {
    reasons.push("YOLO mode compatibility: self-sufficient without strict premade coordination.");
  } else if (input.teamSize) {
    reasons.push(`Team fit: tuned for ${input.teamSize} or flexible any-size usage.`);
  }

  if (normalizedDifficulty && (build.difficulty === normalizedDifficulty || build.difficulty === "all")) {
    reasons.push(`Difficulty compatibility confirmed for ${input.difficulty}.`);
  }

  if (normalizedPlaystyle && build.tags.includes(normalizedPlaystyle)) {
    reasons.push(`Playstyle match on ${input.playstyle} priority.`);
  }

  if (hiveLordMode) {
    if (build.effectiveness?.hivelord) {
      reasons.push(`Hive Lord effectiveness: ${build.effectiveness.hivelord}/100 with phase-ready tools.`);
    }
    if (build.strategyPhases) {
      reasons.push("Includes full 4-phase boss strategy guidance for execution consistency.");
    }
    if (build.category === "hive-lord-specialist") {
      reasons.push("Tagged as Hive Lord specialist for current Terminid boss meta.");
    }
  }

  reasons.push(`${build.rating.toFixed(1)}★ rating, ${build.successRate}% success, ${build.creator.credibilityScore} creator credibility.`);
  return reasons;
}

function buildBL4Reasons(build: BL4Build, input: BL4FormState): string[] {
  const reasons: string[] = [];

  if (input.class) {
    reasons.push(`${build.class.toUpperCase()} class match confirmed.`);
  }

  if (input.buildType && build.buildType === input.buildType) {
    reasons.push(`Direct objective match for ${input.buildType}.`);
  }

  if (input.difficulty && (build.difficulty === input.difficulty || build.difficulty === "normal")) {
    reasons.push(`Difficulty compatibility confirmed for ${input.difficulty.toUpperCase()}.`);
  }

  if (input.playstyle && build.tags.includes(input.playstyle)) {
    reasons.push(`Playstyle match on ${input.playstyle}.`);
  }

  if (build.moxsyValidated) {
    reasons.push("Moxsy-validated build intelligence with active community adoption.");
  }
  if (build.damageBenchmark) {
    reasons.push(`Performance benchmark: ${build.damageBenchmark}.`);
  }
  if (build.patchStatus === "adapted") {
    reasons.push("Post-nerf adapted for stronger patch resilience.");
  }

  reasons.push(`${build.rating.toFixed(1)}★ rating, ${build.successRate}% success, ${build.creator.credibilityScore} creator credibility.`);
  return reasons;
}

function scoreHD2Partial(build: HD2Build, input: HD2FormState, hiveLordMode: boolean) {
  let score = build.rating * 8 + build.successRate * 0.35;
  if (input.faction && (build.faction === input.faction || build.faction === "universal")) score += 70;
  if (input.missionName && build.missionFocus?.includes(input.missionName)) score += 55;
  if (input.difficulty && (build.difficulty === normalizeHD2Difficulty(input.difficulty) || build.difficulty === "all")) score += 30;
  if (input.teamSize && (build.teamSize === input.teamSize || build.teamSize === "any")) score += 25;
  if (input.playstyle && build.tags.includes(normalizeHD2Playstyle(input.playstyle))) score += 20;
  if (hiveLordMode && build.tags.some((tag) => ["boss-fight", "hive-lord"].includes(tag.toLowerCase()))) score += 50;
  if (hiveLordMode) score += (build.effectiveness?.hivelord ?? 0) * 0.6;
  return score;
}

function scoreBL4Partial(build: BL4Build, input: BL4FormState) {
  let score = build.rating * 8 + build.successRate * 0.35;
  if (input.class && build.class === input.class) score += 70;
  if (input.buildType && build.buildType === input.buildType) score += 50;
  if (input.difficulty && (build.difficulty === input.difficulty || build.difficulty === "normal")) score += 30;
  if (input.playstyle && build.tags.includes(input.playstyle)) score += 20;
  if (build.moxsyValidated) score += 8;
  return score;
}

export default function BuildCalculator(props: BuildCalculatorProps) {
  const searchParams = useSearchParams();

  const [hd2Input, setHd2Input] = useState<HD2FormState>({});
  const [bl4Input, setBl4Input] = useState<BL4FormState>({});
  const [selectedBuildId, setSelectedBuildId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hiveLordMode, setHiveLordMode] = useState(false);
  const initializedRef = useRef(false);

  const preserveScrollPosition = (update: () => void) => {
    const scrollPosition = typeof window !== "undefined" ? window.scrollY : 0;
    update();
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => window.scrollTo({ top: scrollPosition, behavior: "auto" }));
    }
  };

  const setHD2Field = <K extends keyof HD2FormState>(field: K, value: HD2FormState[K]) => {
    preserveScrollPosition(() => {
      setHd2Input((prev) => ({ ...prev, [field]: value }));
    });
  };

  const setBL4Field = <K extends keyof BL4FormState>(field: K, value: BL4FormState[K]) => {
    preserveScrollPosition(() => {
      setBl4Input((prev) => ({ ...prev, [field]: value }));
    });
  };

  const updateBuildQueryParam = (buildId: string | null) => {
    if (typeof window === "undefined") return;
    const currentUrl = new URL(window.location.href);
    if (buildId) currentUrl.searchParams.set("build", buildId);
    else currentUrl.searchParams.delete("build");
    window.history.replaceState({}, "", currentUrl.toString());
  };

  const openBuildDetail = (buildId: string) => {
    setSelectedBuildId(buildId);
    updateBuildQueryParam(buildId);
  };

  const closeBuildDetail = () => {
    setSelectedBuildId(null);
    updateBuildQueryParam(null);
  };

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (props.gameType === "helldivers2") {
      const next: HD2FormState = {};

      const faction = searchParams?.get("faction") || null;
      const missionName = searchParams?.get("mission") || null;
      const difficulty = searchParams?.get("difficulty") || null;
      const teamSize = searchParams?.get("team") || null;
      const playstyle = searchParams?.get("style") || null;
      const hiveLordFromQuery = searchParams?.get("hiveLord") || null;

      if (isAllowed(faction, hd2Keys.faction)) next.faction = faction;
      if (isAllowed(missionName, hd2Keys.missionName)) next.missionName = missionName;
      if (isAllowed(difficulty, hd2Keys.difficulty)) next.difficulty = difficulty;
      if (isAllowed(teamSize, hd2Keys.teamSize)) next.teamSize = teamSize;
      if (isAllowed(playstyle, hd2Keys.playstyle)) next.playstyle = playstyle;

      setHd2Input(next);
      setHiveLordMode(hiveLordFromQuery === "1");
    } else {
      const next: BL4FormState = {};

      const playerClass = searchParams?.get("class") || null;
      const buildType = searchParams?.get("type") || null;
      const difficulty = searchParams?.get("difficulty") || null;
      const playstyle = searchParams?.get("style") || null;

      if (isAllowed(playerClass, bl4Keys.class)) next.class = playerClass;
      if (isAllowed(buildType, bl4Keys.buildType)) next.buildType = buildType;
      if (isAllowed(difficulty, bl4Keys.difficulty)) next.difficulty = difficulty;
      if (isAllowed(playstyle, bl4Keys.playstyle)) next.playstyle = playstyle;

      setBl4Input(next);
    }
  }, [props.gameType, searchParams]);

  useEffect(() => {
    const queryBuild = searchParams?.get("build") || null;
    setSelectedBuildId(queryBuild ?? null);
  }, [searchParams]);

  const hd2Selections = [hd2Input.faction, hd2Input.missionName, hd2Input.difficulty, hd2Input.teamSize, hd2Input.playstyle].filter(Boolean)
    .length;
  const bl4Selections = [bl4Input.class, bl4Input.buildType, bl4Input.difficulty, bl4Input.playstyle].filter(Boolean).length;

  const selectedCount = props.gameType === "helldivers2" ? hd2Selections : bl4Selections;
  const totalSteps = props.gameType === "helldivers2" ? 5 : 4;
  const progress = getProgress(totalSteps, selectedCount);
  const missingData = !props.builds || props.builds.length === 0;

  const recommendations = useMemo(() => {
    if (props.gameType === "helldivers2") {
      if (isCompleteHD2(hd2Input)) {
        const topBuilds = getHD2Recommendations(hd2Input, props.builds, { hiveLordMode });
        return topBuilds.map((build) => ({
          ...(() => {
            const insight = getHD2HybridInsight(build, hd2Input, props.builds, hiveLordMode);
            return {
              build,
              score: calculateHD2BuildScore(build, hd2Input, { hiveLordMode }) + insight.confidence * 20,
              confidence: insight.confidence,
              reasons: [...buildHD2Reasons(build, hd2Input, hiveLordMode), ...insight.reasons],
            };
          })(),
        }));
      }

      return props.builds
        .map((build) => {
          const insight = getHD2HybridInsight(build, hd2Input, props.builds, hiveLordMode);
          return {
            build,
            score: scoreHD2Partial(build, hd2Input, hiveLordMode) + insight.confidence * 18,
            confidence: insight.confidence,
            reasons: [...buildHD2Reasons(build, hd2Input, hiveLordMode), ...insight.reasons],
          };
        })
        .filter((item) => item.score > 60)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    }

    if (isCompleteBL4(bl4Input)) {
      const topBuilds = getBL4Recommendations(bl4Input, props.builds);
      return topBuilds.map((build) => ({
        ...(() => {
          const insight = getBL4HybridInsight(build, bl4Input, props.builds);
          return {
            build,
            score: calculateBL4BuildScore(build, bl4Input) + insight.confidence * 20,
            confidence: insight.confidence,
            reasons: [...buildBL4Reasons(build, bl4Input), ...insight.reasons],
          };
        })(),
      }));
    }

    return props.builds
      .map((build) => {
        const insight = getBL4HybridInsight(build, bl4Input, props.builds);
        return {
          build,
          score: scoreBL4Partial(build, bl4Input) + insight.confidence * 18,
          confidence: insight.confidence,
          reasons: [...buildBL4Reasons(build, bl4Input), ...insight.reasons],
        };
      })
      .filter((item) => item.score > 55)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [bl4Input, hd2Input, hiveLordMode, props]);

  const activeBuild = useMemo(
    () => (selectedBuildId ? props.builds.find((build) => build.id === selectedBuildId) ?? null : null),
    [props.builds, selectedBuildId],
  );

  useEffect(() => {
    const ready = props.gameType === "helldivers2" ? isCompleteHD2(hd2Input) : isCompleteBL4(bl4Input);
    if (!ready) {
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    const timer = setTimeout(() => setIsProcessing(false), 220);
    return () => clearTimeout(timer);
  }, [props.gameType, hd2Input, bl4Input]);

  const hd2DifficultyIndex = hd2Input.difficulty
    ? Math.max(
        0,
        hd2DifficultyLevels.findIndex((level) => level.value === hd2Input.difficulty),
      )
    : 0;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Guided Calculator</p>
            <h2 className="mt-1 text-3xl font-black text-slate-100">Find The Exact Build For This Mission</h2>
            <p className="mt-2 text-sm text-slate-300">
              Meta updated for Patch 6.0.3. Post-Jan 2026 meta favors anti-heavy tools, crowd control, and mobility backpacks over raw DPS.
              New: Bastion Tank available. Illuminate now a full 3rd faction.
            </p>
          </div>
          <p className="text-base text-slate-200">Step completion: {selectedCount}/{totalSteps}</p>
        </div>
        <div className="mt-3 h-2 rounded-full bg-slate-800">
          <div className="h-2 rounded-full bg-blue-400 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </section>

      {props.gameType === "helldivers2" ? (
        <div className="space-y-4">
          <OptionChips
            label="Step 1"
            description="Pick the enemy you are about to fight."
            options={[
              { value: "terminids", label: "Terminids", help: "Swarm control and nest-clearing efficiency." },
              { value: "automatons", label: "Automatons", help: "Armor-heavy bot suppression and anti-ranged safety." },
              { value: "illuminate", label: "Illuminate", help: "Shield-break and disruption resistance." },
            ]}
            value={hd2Input.faction}
            onChange={(faction) => setHD2Field("faction", faction as HD2CalculatorInput["faction"])}
          />

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Step 2</p>
            <p className="mt-1 text-base text-slate-200">Choose your mission objective.</p>
            <div className="mt-3 space-y-4">
              <OptionChips
                label="Wave Defense"
                description="You are locked in while waves keep coming. Archetype: crowd control + sentries build."
                options={[
                  { value: "eradicate-terminid-swarm", label: "Eradicate Terminid Swarm", help: "Bug wave suppression with area denial." },
                  { value: "eradicate-automaton-forces", label: "Eradicate Automaton Forces", help: "Heavy bot lanes with sustained sentry cover." },
                  { value: "eradicate-illuminate-forces", label: "Eradicate Illuminate Forces", help: "Shield break plus crowd clear under pressure." },
                  { value: "repel-invasion-fleet", label: "Repel Invasion Fleet", help: "Illuminate wave defense with anti-ship pressure." },
                ]}
                value={hd2Input.missionName}
                onChange={(missionName) => setHD2Field("missionName", missionName as HD2CalculatorInput["missionName"])}
              />

              <OptionChips
                label="Speed Run"
                description="12-minute objective races. Archetype: mobility + AoE build."
                options={[
                  { value: "blitz-search-destroy-terminids", label: "Blitz: Search & Destroy (Terminids)", help: "Close bug holes fast and keep moving." },
                  { value: "blitz-search-destroy-automatons", label: "Blitz: Search & Destroy (Automatons)", help: "Destroy fabricators without overfighting patrols." },
                ]}
                value={hd2Input.missionName}
                onChange={(missionName) => setHD2Field("missionName", missionName as HD2CalculatorInput["missionName"])}
              />

              <OptionChips
                label="Boss Hunt"
                description="Eliminate a priority target. Archetype: anti-heavy + precision build."
                options={[
                  { value: "eliminate-bile-titan", label: "Eliminate Bile Titan", help: "Heavy anti-armor and weak-point deletes." },
                  { value: "eliminate-charger", label: "Eliminate Charger", help: "Burst anti-heavy tools with backup control." },
                  { value: "eliminate-brood-commander", label: "Eliminate Brood Commander", help: "Priority target removal with swarm handling." },
                  { value: "eliminate-hulk", label: "Eliminate Hulk", help: "Bot heavy killer with precision support." },
                  { value: "eliminate-devastator", label: "Eliminate Devastator", help: "Strip armor and disable ranged pressure." },
                ]}
                value={hd2Input.missionName}
                onChange={(missionName) => setHD2Field("missionName", missionName as HD2CalculatorInput["missionName"])}
              />

              <OptionChips
                label="Escort / Evacuation"
                description="Protect moving targets. Archetype: shield + sustained fire build."
                options={[
                  { value: "emergency-evacuation", label: "Emergency Evacuation", help: "Stabilize lanes and protect evac routes." },
                  { value: "evacuate-high-value-assets", label: "Evacuate High-Value Assets", help: "Shielded convoy defense under pressure." },
                ]}
                value={hd2Input.missionName}
                onChange={(missionName) => setHD2Field("missionName", missionName as HD2CalculatorInput["missionName"])}
              />

              <OptionChips
                label="Multi-Step Objective"
                description="Terminals, valves, and hold points. Archetype: versatile + stun build."
                options={[
                  { value: "launch-icbm", label: "Launch ICBM", help: "Progressive terminals with defense windows." },
                  { value: "pump-fuel-to-icbm", label: "Pump Fuel to ICBM", help: "Route fuel points while controlling waves." },
                  { value: "activate-e-710-pumps", label: "Activate E-710 Pumps", help: "Rapid site clears with terminal uptime." },
                  { value: "enable-e-710-extraction", label: "Enable E-710 Extraction", help: "Pressure management across activation points." },
                  { value: "sabotage-supply-bases", label: "Sabotage Supply Bases", help: "Objective chaining under active resistance." },
                  { value: "destroy-command-bunkers", label: "Destroy Command Bunkers", help: "Bunker breach with controlled rotations." },
                  { value: "sabotage-air-base", label: "Sabotage Air Base", help: "Disable base systems while holding lanes." },
                  { value: "destroy-transmission-network", label: "Destroy Transmission Network", help: "Fast terminal-to-terminal objective control." },
                  { value: "destroy-warp-ships", label: "Destroy Warp Ships (Illuminate)", help: "Explosive anti-ship runs with shield survival." },
                ]}
                value={hd2Input.missionName}
                onChange={(missionName) => setHD2Field("missionName", missionName as HD2CalculatorInput["missionName"])}
              />

              <OptionChips
                label="Recon / Data"
                description="Run between points and call strategems. Archetype: mobility + efficiency build."
                options={[
                  { value: "conduct-geological-survey", label: "Conduct Geological Survey", help: "Point-to-point objective tempo and scans." },
                  { value: "retrieve-valuable-data", label: "Retrieve Valuable Data", help: "Fast data retrieval with objective-first pacing." },
                  { value: "upload-escape-pod-data", label: "Upload Escape Pod Data", help: "Uplink windows that demand lane control." },
                  { value: "terminate-illegal-broadcast", label: "Terminate Illegal Broadcast", help: "High-mobility objective disruption." },
                  { value: "spread-democracy", label: "Spread Democracy", help: "Objective progression with rotating pressure." },
                ]}
                value={hd2Input.missionName}
                onChange={(missionName) => setHD2Field("missionName", missionName as HD2CalculatorInput["missionName"])}
              />

              <OptionChips
                label="Destroy Structures"
                description="Demolish hard objectives quickly. Archetype: explosive + AoE build."
                options={[
                  { value: "purge-hatcheries", label: "Purge Hatcheries", help: "Explosive structure deletion with swarm containment." },
                ]}
                value={hd2Input.missionName}
                onChange={(missionName) => setHD2Field("missionName", missionName as HD2CalculatorInput["missionName"])}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Step 3</p>
            <p className="mt-1 text-base text-slate-200">Set difficulty from Easy to Nightmare (maps to Helldive tiers behind the scenes).</p>
            <input
              type="range"
              min={0}
              max={4}
              step={1}
              value={hd2DifficultyIndex}
              onChange={(event) => {
                const idx = Number(event.target.value);
                const next = hd2DifficultyLevels[idx]?.value ?? "easy";
                setHD2Field("difficulty", next);
              }}
              className="mt-4 w-full accent-blue-500"
              aria-label="Difficulty slider"
            />
            <div className="mt-3 grid gap-2 sm:grid-cols-5">
              {hd2DifficultyLevels.map((level) => {
                const active = hd2Input.difficulty === level.value;
                return (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setHD2Field("difficulty", level.value)}
                    className={`min-h-14 rounded-lg border px-2 py-2 text-left ${
                      active
                        ? "border-blue-400 bg-blue-500/20 text-blue-100"
                        : "border-slate-700 bg-slate-950 text-slate-100 hover:border-slate-500"
                    } disabled:cursor-not-allowed disabled:opacity-45`}
                  >
                    <span className="block text-sm font-semibold">{level.label}</span>
                    <span className="block text-xs text-slate-300">{level.subtitle}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <OptionChips
            label="Step 4"
            description="Choose your team reality, including random lobbies."
            options={[
              { value: "solo", label: "Solo", help: "Independent survivability and utility." },
              { value: "duo", label: "Duo", help: "Two-player role overlap and pace." },
              { value: "squad", label: "Squad", help: "4-player coordinated role split." },
              {
                value: "randoms",
                label: "YOLO Mode - Solo/Random Ready",
                help: "Self-sufficient setups that still play well with random teammates.",
              },
            ]}
            value={hd2Input.teamSize}
            onChange={(teamSize) => setHD2Field("teamSize", teamSize as HD2CalculatorInput["teamSize"])}
          />

          <OptionChips
            label="Step 5"
            description="Pick how you want the build to feel in-game."
            options={[
              { value: "balanced", label: "Balanced", help: "All-around effectiveness across objective phases." },
              { value: "aggressive", label: "Aggressive", help: "High damage, high risk, tempo-first gameplay." },
              { value: "support", label: "Support", help: "Keep team alive with utility and control." },
              { value: "stealth", label: "Stealth", help: "Lower detection and tactical positioning." },
            ]}
            value={hd2Input.playstyle}
            onChange={(playstyle) => setHD2Field("playstyle", playstyle as HD2CalculatorInput["playstyle"])}
          />

          <section className="rounded-2xl border border-red-500/30 bg-red-900/20 p-4 sm:p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-200">Hive Lord Check</p>
            <p className="mt-1 text-base text-red-100">Turn this on when the mission includes a Hive Lord encounter.</p>
            <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-red-400/30 bg-slate-950/40 px-3 py-2 text-sm text-slate-100">
              <input
                type="checkbox"
                checked={hiveLordMode}
                onChange={(event) =>
                  preserveScrollPosition(() => {
                    setHiveLordMode(event.target.checked);
                  })
                }
                className="h-4 w-4 accent-red-500"
              />
              Fighting Hive Lord?
            </label>
          </section>
        </div>
      ) : (
        <div className="space-y-4">
          <OptionChips
            label="Step 1"
            description="Pick your Vault Hunter class."
            options={[
              { value: "vex", label: "Vex", help: "Elemental chaining and spell pressure." },
              { value: "rafa", label: "Rafa", help: "Precision gunplay and movement." },
              { value: "amon", label: "Amon", help: "Frontline durability and brawling." },
              { value: "harlowe", label: "Harlowe", help: "Utility control and team support." },
            ]}
            value={bl4Input.class}
            onChange={(playerClass) => setBL4Field("class", playerClass as BL4CalculatorInput["class"])}
          />

          <OptionChips
            label="Step 2"
            description="Select your current objective."
            options={[
              { value: "leveling", label: "Leveling", help: "Campaign tempo and progression consistency." },
              { value: "endgame", label: "Endgame", help: "Broadly strong high-tier setup." },
              { value: "boss-killing", label: "Boss Killing", help: "Single-target burst and windows." },
              { value: "farming", label: "Farming", help: "Repeatable speed for loot loops." },
            ]}
            value={bl4Input.buildType}
            onChange={(buildType) => setBL4Field("buildType", buildType as BL4CalculatorInput["buildType"])}
          />

          <OptionChips
            label="Step 3"
            description="Set your expected challenge tier."
            options={[
              { value: "normal", label: "Normal", help: "Baseline campaign pressure." },
              { value: "uvh", label: "UVH", help: "Optimized scaling and damage checks." },
              { value: "uvh6", label: "UVH6", help: "Peak challenge and gear stress." },
            ]}
            value={bl4Input.difficulty}
            onChange={(difficulty) => setBL4Field("difficulty", difficulty as BL4CalculatorInput["difficulty"])}
          />

          <OptionChips
            label="Step 4"
            description="Choose your playstyle emphasis."
            options={[
              { value: "damage", label: "Damage", help: "Highest DPS and burst windows." },
              { value: "tank", label: "Tank", help: "Durability and survivability uptime." },
              { value: "support", label: "Support", help: "Buffs, control, and team reliability." },
              { value: "speed", label: "Speed", help: "Fast clears and movement tempo." },
            ]}
            value={bl4Input.playstyle}
            onChange={(playstyle) => setBL4Field("playstyle", playstyle as BL4CalculatorInput["playstyle"])}
          />
        </div>
      )}

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
        <h3 className="text-2xl font-bold text-slate-100">Live Recommendations</h3>

        {missingData ? (
          <p className="mt-3 text-base text-slate-200">Build data is currently unavailable. Check your data source and retry.</p>
        ) : isProcessing ? (
          <div className="mt-3 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
            <p className="text-base text-blue-100">Analyzing your mission profile and validating patch-compatible builds...</p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-base text-slate-200">
              {selectedCount < totalSteps
                ? "Complete all steps to generate recommendations instantly."
                : "No builds matched this exact profile. Try relaxing difficulty or playstyle."}
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recommendations.map((item) => (
              <article key={item.build.id} className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-xl font-bold text-slate-100">{item.build.name}</h4>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs font-semibold text-blue-200">
                      Score {Math.round(item.score)}
                    </span>
                    <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2 py-1 text-xs font-semibold text-cyan-200">
                      Confidence {Math.round((item.confidence ?? 0.5) * 100)}%
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-base text-slate-200">{item.build.description}</p>
                <p className="mt-2 text-sm font-semibold text-blue-200">Why this was recommended:</p>
                <ul className="mt-1 space-y-1 text-sm text-slate-200">
                  {item.reasons.map((reason) => (
                    <li key={`${item.build.id}-${reason}`}>• {reason}</li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => openBuildDetail(item.build.id)}
                    className="inline-flex min-h-11 items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                  >
                    View Full Build Details
                  </button>
                  <a
                    href={item.build.creator.channelUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center rounded-lg border border-slate-600 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-blue-400"
                  >
                    Creator
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {activeBuild && (
        <BuildDetail
          build={activeBuild}
          gameType={props.gameType}
          open
          fromCalculator
          onClose={closeBuildDetail}
        />
      )}
    </div>
  );
}
