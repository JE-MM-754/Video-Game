import { BL4Build, BL4CalculatorInput, HD2Build, HD2CalculatorInput } from "./types";

export const CURRENT_HD2_PATCH = "6.0.3";
export const CURRENT_BL4_PATCH = "1.030";

type HD2RecommendationOptions = {
  bossMode?: boolean;
  selectedBoss?: "hive-lord" | "bile-titan" | null;
};

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

function matchesHD2Team(buildTeamSize: HD2Build["teamSize"], inputTeamSize: HD2CalculatorInput["teamSize"]) {
  if (inputTeamSize === "randoms") {
    return buildTeamSize === "solo" || buildTeamSize === "duo" || buildTeamSize === "any";
  }

  return buildTeamSize === inputTeamSize || buildTeamSize === "any";
}

export function calculateHD2BuildScore(build: HD2Build, input: HD2CalculatorInput, options?: HD2RecommendationOptions): number {
  if (!build.patchCompatible || build.patchVersion !== CURRENT_HD2_PATCH) return 0;
  if (!(build.faction === input.faction || build.faction === "universal")) return 0;
  if (!(build.missionType === input.missionType || build.missionType === "universal")) return 0;
  if (!matchesHD2Team(build.teamSize, input.teamSize)) return 0;

  const normalizedDifficulty = normalizeHD2Difficulty(input.difficulty);
  const normalizedPlaystyle = normalizeHD2Playstyle(input.playstyle);

  let score = 0;

  if (build.faction === input.faction || build.faction === "universal") {
    score += 100;
  }

  if (build.missionType === input.missionType || build.missionType === "universal") {
    score += 50;
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

  if (options?.bossMode && options.selectedBoss === "hive-lord") {
    if (build.tags.some((tag) => ["boss-fight", "hive-lord", "heavy-armor"].includes(tag.toLowerCase()))) {
      score += 70;
    }
    score += (build.effectiveness?.hivelord ?? 0) * 0.8;
    score += (build.effectiveness?.sustainability ?? 0) * 0.35;
    if (build.category === "hive-lord-specialist") score += 35;
    if (build.strategyPhases) score += 20;
  }

  score *= creatorValidationMultiplier(build.creator.name);

  return score;
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

  return score;
}

export function getHD2Recommendations(input: HD2CalculatorInput, builds: HD2Build[], options?: HD2RecommendationOptions): HD2Build[] {
  return builds
    .map((build) => ({
      build,
      score: calculateHD2BuildScore(build, input, options),
    }))
    .filter((item) => item.score > (options?.bossMode ? 110 : 120))
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
