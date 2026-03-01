import { BL4Build, BL4CalculatorInput, HD2Build, HD2CalculatorInput, HD2MissionName } from "./types";
import { getBL4HybridInsight, getHD2HybridInsight } from "./hybrid-engine";

export const CURRENT_HD2_PATCH = "6.0.3";
export const CURRENT_BL4_PATCH = "1.030";

type HD2RecommendationOptions = {
  hiveLordMode?: boolean;
};

type MissionArchetype =
  | "wave-defense"
  | "speed-run"
  | "boss-hunt"
  | "escort"
  | "multi-step"
  | "recon"
  | "destroy-structures";

const creatorWeights: Record<string, number> = {
  OhDough: 1.2,
  "Sovereign Gene": 1.15,
  Claysthetics: 1.12,
  BuzzLiteBeer: 1.1,
  "Community Validated": 1.05,
};

function creatorCredibilityBonus(credibilityScore: number, verified: boolean) {
  return (verified ? 12 : 0) + credibilityScore * 0.15;
}

function creatorValidationMultiplier(creatorName: string) {
  return creatorWeights[creatorName] ?? 1;
}

function normalizeHD2Difficulty(inputDifficulty: HD2CalculatorInput["difficulty"]): HD2Build["difficulty"] {
  return inputDifficulty === "nightmare" ? "super-helldive" : "helldive";
}

function normalizeHD2Playstyle(inputPlaystyle: HD2CalculatorInput["playstyle"]): "aggressive" | "support" | "stealth" | "versatile" {
  return inputPlaystyle === "balanced" ? "versatile" : inputPlaystyle;
}

function missionTypeFromMissionName(missionName: HD2MissionName): HD2Build["missionType"] {
  const map: Record<HD2MissionName, HD2Build["missionType"]> = {
    "eradicate-terminid-swarm": "defense",
    "eradicate-automaton-forces": "defense",
    "eradicate-illuminate-forces": "defense",
    "repel-invasion-fleet": "defense",
    "blitz-search-destroy-terminids": "elimination",
    "blitz-search-destroy-automatons": "elimination",
    "eliminate-bile-titan": "elimination",
    "eliminate-charger": "elimination",
    "eliminate-brood-commander": "elimination",
    "eliminate-hulk": "elimination",
    "eliminate-devastator": "elimination",
    "emergency-evacuation": "extraction",
    "evacuate-high-value-assets": "defense",
    "launch-icbm": "defense",
    "pump-fuel-to-icbm": "defense",
    "activate-e-710-pumps": "defense",
    "enable-e-710-extraction": "extraction",
    "sabotage-supply-bases": "elimination",
    "destroy-command-bunkers": "elimination",
    "sabotage-air-base": "elimination",
    "destroy-transmission-network": "elimination",
    "destroy-warp-ships": "elimination",
    "conduct-geological-survey": "extraction",
    "retrieve-valuable-data": "extraction",
    "upload-escape-pod-data": "extraction",
    "terminate-illegal-broadcast": "elimination",
    "spread-democracy": "elimination",
    "purge-hatcheries": "elimination",
  };
  return map[missionName];
}

function missionArchetypeFromMissionName(missionName: HD2MissionName): MissionArchetype {
  const map: Record<HD2MissionName, MissionArchetype> = {
    "eradicate-terminid-swarm": "wave-defense",
    "eradicate-automaton-forces": "wave-defense",
    "eradicate-illuminate-forces": "wave-defense",
    "repel-invasion-fleet": "wave-defense",
    "blitz-search-destroy-terminids": "speed-run",
    "blitz-search-destroy-automatons": "speed-run",
    "eliminate-bile-titan": "boss-hunt",
    "eliminate-charger": "boss-hunt",
    "eliminate-brood-commander": "boss-hunt",
    "eliminate-hulk": "boss-hunt",
    "eliminate-devastator": "boss-hunt",
    "emergency-evacuation": "escort",
    "evacuate-high-value-assets": "escort",
    "launch-icbm": "multi-step",
    "pump-fuel-to-icbm": "multi-step",
    "activate-e-710-pumps": "multi-step",
    "enable-e-710-extraction": "multi-step",
    "sabotage-supply-bases": "multi-step",
    "destroy-command-bunkers": "multi-step",
    "sabotage-air-base": "multi-step",
    "destroy-transmission-network": "multi-step",
    "destroy-warp-ships": "multi-step",
    "conduct-geological-survey": "recon",
    "retrieve-valuable-data": "recon",
    "upload-escape-pod-data": "recon",
    "terminate-illegal-broadcast": "recon",
    "spread-democracy": "recon",
    "purge-hatcheries": "destroy-structures",
  };
  return map[missionName];
}

function includesAny(source: string[], needles: string[]) {
  return needles.some((needle) => source.some((item) => item.includes(needle)));
}

function missionArchetypeScore(build: HD2Build, input: HD2CalculatorInput) {
  const archetype = missionArchetypeFromMissionName(input.missionName);
  const stratagems = build.loadout.stratagems.map((s) => s.toLowerCase());
  const loadout = [
    build.loadout.primary.toLowerCase(),
    build.loadout.secondary.toLowerCase(),
    build.loadout.grenade.toLowerCase(),
    build.loadout.armor.toLowerCase(),
    ...stratagems,
    ...build.tags.map((tag) => tag.toLowerCase()),
    ...build.whyThisWorks.map((line) => line.toLowerCase()),
    ...build.whenToUse.map((line) => line.toLowerCase()),
    build.strategicContext.toLowerCase(),
  ];

  let score = 0;

  if (archetype === "wave-defense") {
    if (includesAny(stratagems, ["sentry"])) score += 30;
    if (includesAny(loadout, ["stamina enhancement"])) score += 18;
    if (input.faction === "terminids" && includesAny(loadout, ["flamethrower"])) score += 22;
    if (input.faction === "automatons" && includesAny(loadout, ["railgun"])) score += 22;
    if (includesAny(loadout, ["orbital gas strike"])) score += 20;
  }

  if (archetype === "speed-run") {
    if (includesAny(loadout, ["jump pack", "lift-850"])) score += 28;
    if (includesAny(loadout, ["eagle airstrike"])) score += 22;
    if (includesAny(loadout, ["grenade pistol", "gp-31"])) score += 20;
    if (includesAny(loadout, ["skip enemies", "run objectives"])) score += 12;
  }

  if (archetype === "boss-hunt") {
    if (includesAny(loadout, ["quasar cannon", "railgun"])) score += 28;
    if (includesAny(loadout, ["orbital precision strike"])) score += 22;
    if (includesAny(loadout, ["shield generator pack"])) score += 20;
    if (includesAny(loadout, ["eagle 500kg"])) score += 20;
  }

  if (archetype === "escort") {
    if (includesAny(loadout, ["shield generator pack"])) score += 25;
    if (includesAny(stratagems, ["sentry"])) score += 20;
    if (includesAny(loadout, ["orbital gas strike"])) score += 18;
    if (includesAny(loadout, ["supply pack"])) score += 20;
  }

  if (archetype === "multi-step") {
    if (includesAny(loadout, ["ems mortar"])) score += 26;
    if (includesAny(loadout, ["autocannon"])) score += 24;
    if (includesAny(loadout, ["guard dog rover"])) score += 20;
    if (includesAny(loadout, ["stamina enhancement"])) score += 18;
  }

  if (archetype === "recon") {
    if (includesAny(loadout, ["jump pack", "mobility", "trailblazer"])) score += 22;
    if (includesAny(loadout, ["objective", "efficiency", "fast"])) score += 16;
  }

  if (archetype === "destroy-structures") {
    if (includesAny(loadout, ["eagle airstrike", "500kg", "orbital laser", "explosive", "demolition"])) score += 30;
    if (includesAny(loadout, ["aoe", "area"])) score += 14;
  }

  return score;
}

function matchesHD2Team(buildTeamSize: HD2Build["teamSize"], inputTeamSize: HD2CalculatorInput["teamSize"]) {
  if (inputTeamSize === "randoms") {
    return buildTeamSize === "solo" || buildTeamSize === "duo" || buildTeamSize === "any";
  }

  return buildTeamSize === inputTeamSize || buildTeamSize === "any";
}

export function calculateHD2BuildScore(build: HD2Build, input: HD2CalculatorInput, options?: HD2RecommendationOptions): number {
  if (!build.patchCompatible || build.patchVersion !== CURRENT_HD2_PATCH) return 0;
  const derivedMissionType = missionTypeFromMissionName(input.missionName);
  if (!(build.faction === input.faction || build.faction === "universal")) return 0;
  if (!(build.missionType === derivedMissionType || build.missionType === "universal")) return 0;
  if (!matchesHD2Team(build.teamSize, input.teamSize)) return 0;

  const normalizedDifficulty = normalizeHD2Difficulty(input.difficulty);
  const normalizedPlaystyle = normalizeHD2Playstyle(input.playstyle);

  let score = 0;

  if (build.faction === input.faction || build.faction === "universal") {
    score += 100;
  }

  if (build.missionType === derivedMissionType || build.missionType === "universal") {
    score += 50;
  }
  if (build.missionFocus?.includes(input.missionName)) {
    score += 40;
  } else if (build.missionType === derivedMissionType || build.missionType === "universal") {
    score += 10;
  }

  if (input.teamSize === "randoms") {
    score += build.teamSize === "solo" ? 45 : build.teamSize === "duo" ? 35 : 25;
  } else if (build.teamSize === input.teamSize || build.teamSize === "any") {
    score += 30;
  }

  if (build.difficulty === normalizedDifficulty || build.difficulty === "all") {
    score += 40;
  }

  if (build.tags.includes(normalizedPlaystyle)) {
    score += 20;
  }
  if (
    input.teamSize === "randoms" &&
    build.tags.some((tag) => ["solo", "versatile", "self-sufficient", "utility"].includes(tag.toLowerCase()))
  ) {
    score += 20;
  }

  score += build.rating * 10 + build.successRate * 0.5;
  score += creatorCredibilityBonus(build.creator.credibilityScore, build.creator.verified);
  score += build.metaTier.startsWith("S") ? 12 : build.metaTier === "A" ? 6 : 0;

  if (options?.hiveLordMode) {
    if (build.tags.some((tag) => ["boss-fight", "hive-lord", "heavy-armor"].includes(tag.toLowerCase()))) {
      score += 70;
    }
    score += (build.effectiveness?.hivelord ?? 0) * 0.8;
    score += (build.effectiveness?.sustainability ?? 0) * 0.35;
    if (build.category === "hive-lord-specialist") score += 35;
    if (build.strategyPhases) score += 20;
  }

  score += missionArchetypeScore(build, input);

  score *= creatorValidationMultiplier(build.creator.name);

  return score;
}

export function calculateHD2HybridScore(build: HD2Build, input: Partial<HD2CalculatorInput>, builds: HD2Build[], options?: HD2RecommendationOptions): number {
  const base = input.missionName && input.faction && input.difficulty && input.teamSize && input.playstyle
    ? calculateHD2BuildScore(build, input as HD2CalculatorInput, options)
    : build.rating * 8 + build.successRate * 0.35;

  const insight = getHD2HybridInsight(build, input, builds, Boolean(options?.hiveLordMode));
  return base + insight.confidence * 20 + insight.consensus * 3 + insight.credibility * 12;
}

export function calculateBL4BuildScore(build: BL4Build, input: BL4CalculatorInput): number {
  if (!build.patchCompatible || build.patchVersion !== CURRENT_BL4_PATCH) return 0;

  let score = 0;

  if (build.class !== input.class) return 0;

  if (build.buildType === input.buildType) {
    score += 80;
  }

  if (build.difficulty === input.difficulty || build.difficulty === "normal") {
    score += 50;
  }

  if (build.tags.includes(input.playstyle)) {
    score += 30;
  }

  score += build.rating * 10 + build.successRate * 0.5;
  score += creatorCredibilityBonus(build.creator.credibilityScore, build.creator.verified);
  score += build.metaTier.startsWith("S") ? 12 : build.metaTier === "A" ? 6 : 0;
  if (build.moxsyValidated) score += 10;
  if (build.damageBenchmark?.includes("20M+")) score += 6;
  if (build.patchStatus === "adapted") score += 4;

  return score;
}

export function calculateBL4HybridScore(build: BL4Build, input: Partial<BL4CalculatorInput>, builds: BL4Build[]): number {
  const base = input.class && input.buildType && input.difficulty && input.playstyle
    ? calculateBL4BuildScore(build, input as BL4CalculatorInput)
    : build.rating * 8 + build.successRate * 0.35;

  const insight = getBL4HybridInsight(build, input, builds);
  return base + insight.confidence * 20 + insight.consensus * 3 + insight.credibility * 12;
}

export function getHD2Recommendations(input: HD2CalculatorInput, builds: HD2Build[], options?: HD2RecommendationOptions): HD2Build[] {
  return builds
    .map((build) => ({
      build,
      score: calculateHD2BuildScore(build, input, options),
    }))
    .filter((item) => item.score > (options?.hiveLordMode ? 110 : 120))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((item) => item.build);
}

export function getBL4Recommendations(input: BL4CalculatorInput, builds: BL4Build[]): BL4Build[] {
  return builds
    .map((build) => ({
      build,
      score: calculateBL4BuildScore(build, input),
    }))
    .filter((item) => item.score > 45)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((item) => item.build);
}
