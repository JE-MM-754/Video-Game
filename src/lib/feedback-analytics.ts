export type FeedbackDifficulty =
  | "trivial"
  | "easy"
  | "medium"
  | "challenging"
  | "hard"
  | "extreme"
  | "suicidal"
  | "helldive"
  | "super-helldive";

export type FeedbackMissionResult = "success" | "partial" | "failed" | "extracted";

export type FeedbackEntry = {
  id: string;
  buildId: string;
  missionName: string;
  enemyType: string;
  difficulty: FeedbackDifficulty;
  missionResult: FeedbackMissionResult;
  performance: 1 | 2 | 3 | 4 | 5;
  textFeedback: string;
  timestamp: string;
  userId?: string;
  confidenceWeight?: number;
  normalizedScore?: number;
};

export type EffectivenessMetrics = {
  meanEffectiveness: number;
  confidenceInterval: [number, number];
  sampleSize: number;
  reliabilityScore: number;
  outlierRate: number;
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

export function normalizeFeedbackScore(performance: FeedbackEntry["performance"]) {
  return (performance - 1) / 4;
}

function detailScore(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return clamp(words / 40);
}

function completionScore(result: FeedbackMissionResult) {
  if (result === "success") return 1;
  if (result === "partial") return 0.8;
  if (result === "extracted") return 0.7;
  return 0.55;
}

function difficultyWeight(difficulty: FeedbackDifficulty) {
  if (difficulty === "super-helldive") return 1;
  if (difficulty === "helldive") return 0.95;
  if (difficulty === "suicidal") return 0.9;
  if (difficulty === "extreme") return 0.85;
  if (difficulty === "hard") return 0.8;
  if (difficulty === "challenging") return 0.75;
  return 0.65;
}

export function calculateFeedbackConfidence(entry: Omit<FeedbackEntry, "confidenceWeight" | "normalizedScore">) {
  const confidence =
    0.35 * detailScore(entry.textFeedback) +
    0.3 * completionScore(entry.missionResult) +
    0.2 * difficultyWeight(entry.difficulty) +
    0.15 * 1;

  return clamp(confidence, 0.1, 1);
}

export function detectOutlierMask(entries: FeedbackEntry[]): boolean[] {
  if (entries.length < 4) return entries.map(() => false);

  const values = entries.map((entry) => normalizeFeedbackScore(entry.performance));
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  const std = Math.sqrt(variance);

  if (std === 0) return entries.map(() => false);

  return values.map((value) => Math.abs((value - mean) / std) > 2.5);
}

export function computeEffectivenessMetrics(entries: FeedbackEntry[]): EffectivenessMetrics {
  if (entries.length === 0) {
    return {
      meanEffectiveness: 0,
      confidenceInterval: [0, 0],
      sampleSize: 0,
      reliabilityScore: 0,
      outlierRate: 0,
    };
  }

  const outlierMask = detectOutlierMask(entries);
  const usable = entries.filter((_, index) => !outlierMask[index]);
  const pool = usable.length > 0 ? usable : entries;

  const weighted = pool.map((entry) => {
    const confidenceWeight = entry.confidenceWeight ?? calculateFeedbackConfidence(entry);
    const normalizedScore = entry.normalizedScore ?? normalizeFeedbackScore(entry.performance);
    return { confidenceWeight, normalizedScore };
  });

  const totalWeight = weighted.reduce((sum, item) => sum + item.confidenceWeight, 0);
  const mean = totalWeight
    ? weighted.reduce((sum, item) => sum + item.normalizedScore * item.confidenceWeight, 0) / totalWeight
    : 0;

  const variance = totalWeight
    ? weighted.reduce((sum, item) => sum + item.confidenceWeight * (item.normalizedScore - mean) ** 2, 0) / totalWeight
    : 0;

  const stderr = Math.sqrt(variance / Math.max(pool.length, 1));
  const margin = 1.96 * stderr;

  const reliabilityScore = weighted.reduce((sum, item) => sum + item.confidenceWeight, 0) / weighted.length;

  return {
    meanEffectiveness: mean,
    confidenceInterval: [clamp(mean - margin), clamp(mean + margin)],
    sampleSize: entries.length,
    reliabilityScore,
    outlierRate: (entries.length - pool.length) / entries.length,
  };
}
