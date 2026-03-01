export type GameType = "helldivers2" | "borderlands4";

export type MetaTier = "S+" | "S" | "A" | "B" | "C";

export interface Creator {
  id: string;
  name: string;
  platform: "youtube" | "twitch" | "reddit" | "community" | "website";
  channelUrl: string;
  verified: boolean;
  avatar?: string;
  credibilityScore: number; // 1-100 credibility weighting for recommendation logic
}

export interface StrategicIntel {
  whyThisWorks: string[];
  strategicContext: string;
  whenToUse: string[];
  whenToAvoid?: string[];
  advancedTactics?: string[];
  optimizationTips?: string[];
  strategyPhases?: {
    phase1: string;
    phase2: string;
    phase3: string;
    phase4: string;
  };
}

export interface HD2Build extends StrategicIntel {
  id: string;
  name: string;
  description: string;
  creator: Creator;
  createdAt: string;
  lastUpdated: string;
  patchVersion: string;

  faction: "terminids" | "automatons" | "illuminate" | "universal";
  difficulty: "helldive" | "super-helldive" | "all";
  missionType: "extraction" | "defense" | "elimination" | "universal";
  teamSize: "solo" | "duo" | "squad" | "any";

  loadout: {
    primary: string;
    secondary: string;
    grenade: string;
    stratagems: [string, string, string, string];
    armor: string;
    cape?: string;
  };

  tags: string[];
  metaTier: MetaTier;
  teamCoordination: "low" | "medium" | "high";
  rating: number;
  successRate: number;
  views: number;
  communityValidation: number; // number of reports/votes/test runs
  sourceUrl?: string;
  patchCompatible: boolean;
  category?: "hive-lord-specialist" | "general";
  missionFocus?: HD2MissionName[];
  effectiveness?: {
    hivelord?: number;
    chargers?: number;
    swarms?: number;
    sustainability?: number;
  };
  metaRating?: {
    february2026?: number;
    trending?: "up" | "stable" | "down";
    lastUpdated?: string;
  };
}

export type HD2MissionName =
  | "eradicate-terminid-swarm"
  | "eradicate-automaton-forces"
  | "eradicate-illuminate-forces"
  | "repel-invasion-fleet"
  | "blitz-search-destroy-terminids"
  | "blitz-search-destroy-automatons"
  | "eliminate-bile-titan"
  | "eliminate-charger"
  | "eliminate-brood-commander"
  | "eliminate-hulk"
  | "eliminate-devastator"
  | "emergency-evacuation"
  | "evacuate-high-value-assets"
  | "launch-icbm"
  | "pump-fuel-to-icbm"
  | "activate-e-710-pumps"
  | "enable-e-710-extraction"
  | "sabotage-supply-bases"
  | "destroy-command-bunkers"
  | "sabotage-air-base"
  | "destroy-transmission-network"
  | "destroy-warp-ships"
  | "conduct-geological-survey"
  | "retrieve-valuable-data"
  | "upload-escape-pod-data"
  | "terminate-illegal-broadcast"
  | "spread-democracy"
  | "purge-hatcheries";

export interface BL4Build extends StrategicIntel {
  id: string;
  name: string;
  description: string;
  creator: Creator;
  createdAt: string;
  lastUpdated: string;
  patchVersion: string;

  class: "vex" | "rafa" | "amon" | "harlowe";
  buildType: "leveling" | "endgame" | "boss-killing" | "farming";
  difficulty: "normal" | "uvh" | "uvh6";

  skillTree: {
    actionSkill: string;
    keySkills: string[];
    capstone?: string;
    skillPoints: number;
  };

  gear: {
    weapons: string[];
    shield: string;
    grenadeMod: string;
    classMod: string;
    artifact: string;
  };

  tags: string[];
  metaTier: MetaTier;
  teamCoordination: "low" | "medium" | "high";
  rating: number;
  successRate: number;
  views: number;
  communityValidation: number;
  sourceUrl?: string;
  patchCompatible: boolean;
  moxsyValidated?: boolean;
  patchStatus?: "current" | "adapted" | "nerfed";
  complexity?: "beginner" | "intermediate" | "advanced";
  gearDependency?: "low" | "medium" | "high";
  damageBenchmark?: string;
  performanceNotes?: string[];
}

export interface HD2CalculatorInput {
  missionName: HD2MissionName;
  faction: "terminids" | "automatons" | "illuminate";
  difficulty: "easy" | "medium" | "hard" | "expert" | "nightmare";
  teamSize: "solo" | "duo" | "squad" | "randoms";
  playstyle: "balanced" | "aggressive" | "support" | "stealth";
  hiveLord?: boolean;
}

export interface BL4CalculatorInput {
  class: "vex" | "rafa" | "amon" | "harlowe";
  buildType: "leveling" | "endgame" | "boss-killing" | "farming";
  difficulty: "normal" | "uvh" | "uvh6";
  playstyle: "damage" | "tank" | "support" | "speed";
}

export interface GameInfo {
  slug: GameType;
  title: string;
  subtitle: string;
  description: string;
  href: `/${GameType}`;
  colorClass: string;
}
