import type { HD2Build } from "@/lib/types";

export type RLEnemyType = "terminids" | "automatons" | "illuminate";

export type RLFeedbackMissionResult = "complete_success" | "partial_success" | "mission_failed" | "early_extraction";

export type RLFeedbackDifficulty =
  | "trivial"
  | "easy"
  | "medium"
  | "challenging"
  | "hard"
  | "extreme"
  | "suicidal"
  | "helldive"
  | "super-helldive";

export type UserSkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type ComprehensiveRLFeedback = {
  id: string;
  timestamp: string;
  sessionId: string;
  userId?: string;

  missionName: string;
  enemyType: RLEnemyType;
  difficulty: RLFeedbackDifficulty;
  teamSize: number;
  hiveLordPresent: boolean;

  buildId: string;
  buildName: string;
  creator: string;
  loadout: {
    primary: string;
    secondary: string;
    throwable: string;
    armor: string;
    stratagems: string[];
  };

  userRating: 1 | 2 | 3 | 4 | 5;
  missionResult: RLFeedbackMissionResult;
  timeToComplete?: number;
  casualties?: number;
  objectivesCompleted: number;
  totalObjectives: number;

  userSkillLevel?: UserSkillLevel;
  totalMissionsPlayed?: number;

  textFeedback?: string;
  issuesEncountered: string[];
  highlightsNoted: string[];

  mapType?: string;
  weatherConditions?: string;
  specialModifiers?: string[];

  isValidForTraining: boolean;
  confidenceScore: number;

  dailyDate: string;
  weeklyPeriod: string;
  monthlyPeriod: string;
};

export type RLFeedbackInput = {
  build: HD2Build;
  missionName: string;
  enemyType: RLEnemyType;
  difficulty: RLFeedbackDifficulty;
  teamSize: number;
  hiveLordPresent: boolean;
  userRating: 1 | 2 | 3 | 4 | 5;
  missionResult: RLFeedbackMissionResult;
  objectivesCompleted: number;
  totalObjectives: number;
  textFeedback?: string;
  timeToComplete?: number;
  casualties?: number;
  userSkillLevel?: UserSkillLevel;
  totalMissionsPlayed?: number;
  issuesEncountered?: string[];
  highlightsNoted?: string[];
  mapType?: string;
  weatherConditions?: string;
  specialModifiers?: string[];
};

export type RLTrainingData = {
  buildPerformance: Map<string, { sampleSize: number; avgRating: number; avgConfidence: number }>;
  missionOptimization: Map<string, { sampleSize: number; avgRating: number; successRate: number }>;
  dailyTrends: Map<string, { sampleSize: number; avgRating: number }>;
};

const MASTER_KEY = "metaforge-rl-feedback";
const EXPORT_KEY_PATTERNS = ["metaforge", "feedback", "rl-"];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function weekPeriod(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-${String(weekNo).padStart(2, "0")}`;
}

function getSessionId() {
  if (typeof window === "undefined") return "server-session";
  const key = "metaforge-session-id";
  const existing = window.sessionStorage.getItem(key);
  if (existing) return existing;
  const next = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  window.sessionStorage.setItem(key, next);
  return next;
}

export function exportFeedbackData(): ComprehensiveRLFeedback[] {
  if (typeof window === "undefined") return [];

  const keys = Object.keys(window.localStorage).filter((key) => EXPORT_KEY_PATTERNS.some((pattern) => key.includes(pattern)));
  const rows: ComprehensiveRLFeedback[] = [];

  for (const key of keys) {
    const raw = window.localStorage.getItem(key);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (
            item &&
            typeof item === "object" &&
            "buildId" in item &&
            "missionName" in item &&
            "userRating" in item &&
            "timestamp" in item
          ) {
            rows.push(item as ComprehensiveRLFeedback);
          }
        }
      }
    } catch {
      // Skip malformed localStorage segments.
    }
  }

  return rows;
}

export function downloadFeedbackExport(filenamePrefix = "metaforge-feedback") {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const data = exportFeedbackData();
  const stamp = new Date().toISOString().split("T")[0];
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${filenamePrefix}-${stamp}.json`;
  anchor.click();
  window.URL.revokeObjectURL(url);
}

export class RLFeedbackManager {
  private static instance: RLFeedbackManager;

  static getInstance() {
    if (!RLFeedbackManager.instance) {
      RLFeedbackManager.instance = new RLFeedbackManager();
    }
    return RLFeedbackManager.instance;
  }

  saveFeedback(input: RLFeedbackInput): ComprehensiveRLFeedback {
    const now = new Date();
    const dailyDate = now.toISOString().split("T")[0];

    const feedback: ComprehensiveRLFeedback = {
      id: `feedback_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      timestamp: now.toISOString(),
      sessionId: getSessionId(),
      userId: "anonymous",

      missionName: input.missionName,
      enemyType: input.enemyType,
      difficulty: input.difficulty,
      teamSize: input.teamSize,
      hiveLordPresent: input.hiveLordPresent,

      buildId: input.build.id,
      buildName: input.build.name,
      creator: input.build.creator.name,
      loadout: {
        primary: input.build.loadout.primary,
        secondary: input.build.loadout.secondary,
        throwable: input.build.loadout.grenade,
        armor: input.build.loadout.armor,
        stratagems: [...input.build.loadout.stratagems],
      },

      userRating: input.userRating,
      missionResult: input.missionResult,
      timeToComplete: input.timeToComplete,
      casualties: input.casualties,
      objectivesCompleted: input.objectivesCompleted,
      totalObjectives: input.totalObjectives,

      userSkillLevel: input.userSkillLevel,
      totalMissionsPlayed: input.totalMissionsPlayed,

      textFeedback: input.textFeedback?.trim() || undefined,
      issuesEncountered: input.issuesEncountered ?? [],
      highlightsNoted: input.highlightsNoted ?? [],

      mapType: input.mapType,
      weatherConditions: input.weatherConditions,
      specialModifiers: input.specialModifiers,

      isValidForTraining: false,
      confidenceScore: 0,

      dailyDate,
      weeklyPeriod: weekPeriod(now),
      monthlyPeriod: dailyDate.slice(0, 7),
    };

    feedback.isValidForTraining = this.validateFeedbackQuality(feedback);
    feedback.confidenceScore = this.calculateConfidenceScore(feedback);

    const all = this.getAllFeedback();
    all.push(feedback);
    this.write(MASTER_KEY, all);

    this.storeForDailyAnalysis(feedback);
    this.storeForBuildAnalysis(feedback);
    this.storeForMissionAnalysis(feedback);
    this.storeForUserAnalysis(feedback);

    this.storeLegacyAnalyticsCompat(feedback);

    return feedback;
  }

  getAllFeedback(): ComprehensiveRLFeedback[] {
    return this.read<ComprehensiveRLFeedback[]>(MASTER_KEY, []);
  }

  getBuildFeedback(buildId: string) {
    return this.getAllFeedback().filter((entry) => entry.buildId === buildId);
  }

  getRLTrainingData(): RLTrainingData {
    return {
      buildPerformance: this.aggregateBuildPerformance(),
      missionOptimization: this.aggregateMissionData(),
      dailyTrends: this.aggregateDailyTrends(),
    };
  }

  private storeForDailyAnalysis(feedback: ComprehensiveRLFeedback) {
    const key = `rl-daily-${feedback.dailyDate}`;
    const rows = this.read<ComprehensiveRLFeedback[]>(key, []);
    rows.push(feedback);
    this.write(key, rows);
  }

  private storeForBuildAnalysis(feedback: ComprehensiveRLFeedback) {
    const key = `rl-build-${feedback.buildId}`;
    const rows = this.read<
      Array<{
        rating: number;
        mission: string;
        result: RLFeedbackMissionResult;
        context: { difficulty: RLFeedbackDifficulty; enemy: RLEnemyType; hiveLord: boolean };
        confidenceScore: number;
        timestamp: string;
      }>
    >(key, []);

    rows.push({
      rating: feedback.userRating,
      mission: feedback.missionName,
      result: feedback.missionResult,
      context: {
        difficulty: feedback.difficulty,
        enemy: feedback.enemyType,
        hiveLord: feedback.hiveLordPresent,
      },
      confidenceScore: feedback.confidenceScore,
      timestamp: feedback.timestamp,
    });

    this.write(key, rows);
  }

  private storeForMissionAnalysis(feedback: ComprehensiveRLFeedback) {
    const key = `rl-mission-${feedback.missionName}-${feedback.enemyType}`;
    const rows = this.read<
      Array<{
        buildId: string;
        rating: number;
        result: RLFeedbackMissionResult;
        performance: { objectives: number; time?: number; casualties?: number };
        confidenceScore: number;
        timestamp: string;
      }>
    >(key, []);

    rows.push({
      buildId: feedback.buildId,
      rating: feedback.userRating,
      result: feedback.missionResult,
      performance: {
        objectives: feedback.totalObjectives > 0 ? feedback.objectivesCompleted / feedback.totalObjectives : 0,
        time: feedback.timeToComplete,
        casualties: feedback.casualties,
      },
      confidenceScore: feedback.confidenceScore,
      timestamp: feedback.timestamp,
    });

    this.write(key, rows);
  }

  private storeForUserAnalysis(feedback: ComprehensiveRLFeedback) {
    const key = `rl-user-${feedback.sessionId}`;
    const rows = this.read<ComprehensiveRLFeedback[]>(key, []);
    rows.push(feedback);
    this.write(key, rows);
  }

  private validateFeedbackQuality(feedback: ComprehensiveRLFeedback) {
    if (!feedback.missionName || !feedback.buildId || !feedback.enemyType) return false;
    if (feedback.userRating < 1 || feedback.userRating > 5) return false;
    if (!feedback.missionResult || !feedback.difficulty) return false;
    if (feedback.objectivesCompleted > feedback.totalObjectives) return false;
    if (feedback.totalObjectives <= 0) return false;

    if (feedback.textFeedback && feedback.textFeedback.length > 0 && feedback.textFeedback.length < 10) {
      return false;
    }

    return true;
  }

  private calculateConfidenceScore(feedback: ComprehensiveRLFeedback) {
    let confidence = 0.5;

    if ((feedback.textFeedback?.length ?? 0) > 50) confidence += 0.1;
    if (feedback.issuesEncountered.length > 0) confidence += 0.1;
    if (feedback.highlightsNoted.length > 0) confidence += 0.05;
    if (feedback.timeToComplete !== undefined) confidence += 0.1;
    if (feedback.objectivesCompleted !== undefined) confidence += 0.05;

    if (feedback.userSkillLevel) confidence += 0.05;
    if ((feedback.totalMissionsPlayed ?? 0) > 10) confidence += 0.05;

    if (!feedback.isValidForTraining) confidence -= 0.2;

    return clamp(confidence, 0.1, 1);
  }

  private aggregateBuildPerformance() {
    const map = new Map<string, { sampleSize: number; avgRating: number; avgConfidence: number }>();
    const grouped = new Map<string, ComprehensiveRLFeedback[]>();

    for (const entry of this.getAllFeedback()) {
      if (!grouped.has(entry.buildId)) grouped.set(entry.buildId, []);
      grouped.get(entry.buildId)?.push(entry);
    }

    grouped.forEach((rows, buildId) => {
      const sampleSize = rows.length;
      const avgRating = rows.reduce((sum, row) => sum + row.userRating, 0) / sampleSize;
      const avgConfidence = rows.reduce((sum, row) => sum + row.confidenceScore, 0) / sampleSize;
      map.set(buildId, { sampleSize, avgRating, avgConfidence });
    });

    return map;
  }

  private aggregateMissionData() {
    const map = new Map<string, { sampleSize: number; avgRating: number; successRate: number }>();
    const grouped = new Map<string, ComprehensiveRLFeedback[]>();

    for (const entry of this.getAllFeedback()) {
      const key = `${entry.missionName}-${entry.enemyType}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)?.push(entry);
    }

    grouped.forEach((rows, key) => {
      const sampleSize = rows.length;
      const avgRating = rows.reduce((sum, row) => sum + row.userRating, 0) / sampleSize;
      const successRate =
        rows.filter((row) => row.missionResult === "complete_success" || row.missionResult === "partial_success").length / sampleSize;
      map.set(key, { sampleSize, avgRating, successRate });
    });

    return map;
  }

  private aggregateDailyTrends() {
    const map = new Map<string, { sampleSize: number; avgRating: number }>();
    const grouped = new Map<string, ComprehensiveRLFeedback[]>();

    for (const entry of this.getAllFeedback()) {
      if (!grouped.has(entry.dailyDate)) grouped.set(entry.dailyDate, []);
      grouped.get(entry.dailyDate)?.push(entry);
    }

    grouped.forEach((rows, day) => {
      const sampleSize = rows.length;
      const avgRating = rows.reduce((sum, row) => sum + row.userRating, 0) / sampleSize;
      map.set(day, { sampleSize, avgRating });
    });

    return map;
  }

  private storeLegacyAnalyticsCompat(feedback: ComprehensiveRLFeedback) {
    const key = "metaforge-feedback";
    const legacy = this.read<
      Array<{
        id: string;
        buildId: string;
        missionName: string;
        enemyType: string;
        difficulty: RLFeedbackDifficulty;
        missionResult: "success" | "partial" | "failed" | "extracted";
        performance: 1 | 2 | 3 | 4 | 5;
        textFeedback: string;
        userId: string;
        timestamp: string;
        confidenceWeight: number;
        normalizedScore: number;
      }>
    >(key, []);

    legacy.push({
      id: feedback.id,
      buildId: feedback.buildId,
      missionName: feedback.missionName,
      enemyType: feedback.enemyType,
      difficulty: feedback.difficulty,
      missionResult:
        feedback.missionResult === "complete_success"
          ? "success"
          : feedback.missionResult === "partial_success"
            ? "partial"
            : feedback.missionResult === "mission_failed"
              ? "failed"
              : "extracted",
      performance: feedback.userRating,
      textFeedback: feedback.textFeedback ?? "",
      userId: feedback.userId ?? "anonymous",
      timestamp: feedback.timestamp,
      confidenceWeight: feedback.confidenceScore,
      normalizedScore: (feedback.userRating - 1) / 4,
    });

    this.write(key, legacy);
  }

  private read<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;

    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  private write<T>(key: string, value: T) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}
