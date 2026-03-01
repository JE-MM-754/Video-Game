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
}

export interface HD2CalculatorInput {
  missionType: "extraction" | "defense" | "elimination";
  faction: "terminids" | "automatons" | "illuminate";
  difficulty: "easy" | "medium" | "hard" | "expert" | "nightmare";
  teamSize: "solo" | "duo" | "squad" | "randoms";
  playstyle: "balanced" | "aggressive" | "support" | "stealth";
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
