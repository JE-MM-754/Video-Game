import type { BL4Build, BL4CalculatorInput, Creator, HD2Build, HD2CalculatorInput } from "@/lib/types";

type CredibilityContext = {
  domain?: "hd2" | "bl4";
  missionName?: string;
  faction?: string;
  buildType?: string;
};

export type CredibilityBreakdown = {
  expertise: number;
  validation: number;
  trackRecord: number;
  specialization: number;
  recency: number;
  decay: number;
  score: number;
};

export type HybridInsight = {
  credibility: number;
  consensus: number;
  confidence: number;
  reasons: string[];
};

const EXPERTISE_WEIGHTS: Record<string, number> = {
  "OhDough": 0.9,
  "Sovereign Gene": 0.88,
  Claysthetics: 0.85,
  BuzzLiteBeer: 0.84,
  Moxsy: 0.92,
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function daysSince(dateIso: string) {
  const then = new Date(dateIso).getTime();
  if (Number.isNaN(then)) return 365;
  const ms = Date.now() - then;
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

function creatorSpecializationBoost(creator: Creator, context?: CredibilityContext) {
  const name = creator.name;
  if (!context) return 1;

  if (context.domain === "hd2" && name.includes("OhDough")) return 1.08;
  if (context.domain === "hd2" && name.includes("Claysthetics")) return 1.06;
  if (context.domain === "hd2" && name.includes("Sovereign Gene")) return 1.07;
  if (context.domain === "bl4" && name.includes("Moxsy")) return 1.1;

  return 1;
}

export function calculateCreatorCredibility(creator: Creator, lastUpdated: string, context?: CredibilityContext): CredibilityBreakdown {
  const expertise = clamp((EXPERTISE_WEIGHTS[creator.name] ?? 0.75) * creatorSpecializationBoost(creator, context));
  const validation = clamp(creator.verified ? 0.9 : 0.6);
  const trackRecord = clamp(creator.credibilityScore / 100);

  const specialization = clamp(0.7 * creatorSpecializationBoost(creator, context));

  const ageDays = daysSince(lastUpdated);
  const recency = clamp(1 - ageDays / 180);
  const decay = clamp(ageDays / 365, 0, 0.5);

  const score = clamp(
    0.25 * expertise +
      0.2 * validation +
      0.25 * trackRecord +
      0.15 * specialization +
      0.1 * recency +
      0.05 * (1 - decay),
  );

  return {
    expertise,
    validation,
    trackRecord,
    specialization,
    recency,
    decay,
    score,
  };
}

function tokenSet(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter((x) => x.length > 2),
  );
}

function jaccard(a: Set<string>, b: Set<string>) {
  const union = new Set([...a, ...b]);
  if (union.size === 0) return 0;
  let overlap = 0;
  for (const item of a) {
    if (b.has(item)) overlap += 1;
  }
  return overlap / union.size;
}

function buildSignature(build: HD2Build | BL4Build) {
  if ("loadout" in build) {
    return `${build.loadout.primary} ${build.loadout.secondary} ${build.loadout.grenade} ${build.loadout.stratagems.join(" ")} ${build.loadout.armor} ${build.tags.join(" ")}`;
  }
  return `${build.gear.weapons.join(" ")} ${build.gear.shield} ${build.gear.grenadeMod} ${build.gear.classMod} ${build.gear.artifact} ${build.tags.join(" ")}`;
}

export function calculateConsensusWeight(target: HD2Build | BL4Build, cohort: Array<HD2Build | BL4Build>) {
  const targetTokens = tokenSet(buildSignature(target));
  const peers = cohort.filter((b) => b.id !== target.id);
  if (peers.length === 0) return 1;

  const similarities = peers.map((other) => jaccard(targetTokens, tokenSet(buildSignature(other))));
  const agreeing = similarities.filter((s) => s >= 0.25).length;
  const consensusMultiplier = 1 + Math.log(agreeing + 1) * 0.2;

  const noveltyFactor = agreeing === 0 ? (target.communityValidation > 3000 ? 1.12 : 0.75) : 1;
  return Math.min(consensusMultiplier * noveltyFactor, 2);
}

function missionSuitability(build: HD2Build, input: Partial<HD2CalculatorInput>, hiveLordMode: boolean) {
  let fit = 0;
  let factors = 0;

  if (input.faction) {
    factors += 1;
    fit += build.faction === input.faction || build.faction === "universal" ? 1 : 0;
  }

  if (input.missionName) {
    factors += 1;
    if (build.missionFocus?.includes(input.missionName)) fit += 1;
    else if (!build.missionFocus?.length) fit += 0.55;
  }

  if (input.teamSize) {
    factors += 1;
    if (input.teamSize === "randoms") {
      fit += ["solo", "duo", "any"].includes(build.teamSize) ? 1 : 0.35;
    } else {
      fit += build.teamSize === input.teamSize || build.teamSize === "any" ? 1 : 0.3;
    }
  }

  if (input.playstyle) {
    factors += 1;
    const normalized = input.playstyle === "balanced" ? "versatile" : input.playstyle;
    fit += build.tags.includes(normalized) ? 1 : 0.4;
  }

  if (hiveLordMode) {
    factors += 1;
    fit += (build.effectiveness?.hivelord ?? 50) / 100;
  }

  if (factors === 0) return 0.5;
  return clamp(fit / factors);
}

export function getHD2HybridInsight(
  build: HD2Build,
  input: Partial<HD2CalculatorInput>,
  cohort: HD2Build[],
  hiveLordMode: boolean,
): HybridInsight {
  const credibility = calculateCreatorCredibility(build.creator, build.lastUpdated, {
    domain: "hd2",
    faction: input.faction,
    missionName: input.missionName,
  }).score;
  const consensus = calculateConsensusWeight(build, cohort);
  const missionFit = missionSuitability(build, input, hiveLordMode);

  const confidence = clamp(0.45 * credibility + 0.3 * missionFit + 0.25 * clamp(consensus / 2));

  const reasons: string[] = [
    `Creator credibility ${(credibility * 100).toFixed(0)}% based on validation, recency, and track record.`,
    `Community consensus ${(consensus * 50).toFixed(0)}% across similar high-performing loadouts.`,
    `Mission-context fit ${(missionFit * 100).toFixed(0)}% for your selected filters.`,
  ];

  return { credibility, consensus, confidence, reasons };
}

function bl4Suitability(build: BL4Build, input: Partial<BL4CalculatorInput>) {
  let fit = 0;
  let factors = 0;

  if (input.class) {
    factors += 1;
    fit += build.class === input.class ? 1 : 0;
  }

  if (input.buildType) {
    factors += 1;
    fit += build.buildType === input.buildType ? 1 : 0.35;
  }

  if (input.difficulty) {
    factors += 1;
    fit += build.difficulty === input.difficulty || build.difficulty === "normal" ? 1 : 0.45;
  }

  if (input.playstyle) {
    factors += 1;
    fit += build.tags.includes(input.playstyle) ? 1 : 0.45;
  }

  return factors === 0 ? 0.5 : clamp(fit / factors);
}

export function getBL4HybridInsight(build: BL4Build, input: Partial<BL4CalculatorInput>, cohort: BL4Build[]): HybridInsight {
  const credibility = calculateCreatorCredibility(build.creator, build.lastUpdated, {
    domain: "bl4",
    buildType: input.buildType,
  }).score;
  const consensus = calculateConsensusWeight(build, cohort);
  const missionFit = bl4Suitability(build, input);
  const confidence = clamp(0.48 * credibility + 0.32 * missionFit + 0.2 * clamp(consensus / 2));

  const reasons: string[] = [
    `Creator credibility ${(credibility * 100).toFixed(0)}% weighted for BL4 specialization and update recency.`,
    `Community consensus ${(consensus * 50).toFixed(0)}% from overlapping high-performing archetypes.`,
    `Build-context fit ${(missionFit * 100).toFixed(0)}% for your selected objective and difficulty.`,
  ];

  return { credibility, consensus, confidence, reasons };
}
