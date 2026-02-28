# Gaming Build Tool - Codex Implementation Prompts

## PROMPT 1: INITIAL PROJECT SETUP & STRUCTURE

```
Create a modern gaming build optimization tool called "MetaForge" using Next.js 15, TypeScript, and Tailwind CSS. This will be a mobile-first web application for optimizing loadouts in Helldivers 2 and Borderlands 4.

CORE REQUIREMENTS:
- Next.js 15 with TypeScript
- Tailwind CSS for styling  
- Dark gaming theme (dark grays, blues, accent colors)
- Mobile-first responsive design
- Game selection system (Helldivers 2 vs Borderlands 4)
- Build browser with filtering capabilities
- Interactive build calculator
- Creator attribution system

PROJECT STRUCTURE:
```
src/
├── app/
│   ├── page.tsx (homepage with game selection)
│   ├── helldivers2/
│   │   ├── page.tsx (HD2 builds browser)
│   │   └── calculator/page.tsx (HD2 calculator)
│   ├── borderlands4/
│   │   ├── page.tsx (BL4 builds browser)  
│   │   └── calculator/page.tsx (BL4 calculator)
│   └── layout.tsx
├── components/
│   ├── GameSelector.tsx
│   ├── BuildCard.tsx
│   ├── BuildCalculator.tsx
│   ├── BuildFilter.tsx
│   └── CreatorAttribution.tsx
├── data/
│   ├── helldivers2-builds.json
│   ├── borderlands4-builds.json
│   └── creators.json
├── lib/
│   ├── types.ts
│   └── calculator-logic.ts
└── styles/
    └── globals.css
```

DESIGN REQUIREMENTS:
- Dark theme with gaming aesthetic
- Cards-based layout for builds
- Prominent game logos/branding
- Mobile-optimized touch interfaces
- Quick-access calculator buttons
- Creator attribution badges

Create this project structure and implement:
1. Basic Next.js setup with routing
2. Dark gaming theme using Tailwind
3. Game selection homepage
4. Basic build browser pages for both games
5. Mobile-first responsive layout

Start with this foundation and I'll provide the data structures and calculator logic next.
```

## PROMPT 2: DATA STRUCTURES & TYPES

```
Add TypeScript interfaces and data structures for the gaming build tool. Create these in src/lib/types.ts:

TYPESCRIPT INTERFACES:

```typescript
// Core game types
export type GameType = 'helldivers2' | 'borderlands4';

// Creator information
export interface Creator {
  id: string;
  name: string;
  platform: 'youtube' | 'twitch' | 'reddit';
  channelUrl: string;
  verified: boolean;
}

// Helldivers 2 specific types
export interface HD2Build {
  id: string;
  name: string;
  description: string;
  creator: Creator;
  lastUpdated: string;
  patchCompatible: string; // "6.0.3"
  faction: 'terminids' | 'automatons' | 'illuminate' | 'universal';
  difficulty: 'helldive' | 'super-helldive' | 'all';
  missionType: 'extraction' | 'defense' | 'elimination' | 'universal';
  teamSize: 'solo' | 'duo' | 'squad' | 'any';
  
  loadout: {
    primary: string;
    secondary: string;
    grenade: string;
    stratagems: [string, string, string, string];
    armor: string;
    cape: string;
  };
  
  tags: string[];
  rating: number; // 1-5
  successRate: number; // percentage
  views: number;
  sourceUrl?: string;
}

// Borderlands 4 specific types  
export interface BL4Build {
  id: string;
  name: string;
  description: string;
  creator: Creator;
  lastUpdated: string;
  patchCompatible: string; // "1.030"
  class: 'vex' | 'rafa' | 'amon' | 'harlowe';
  buildType: 'leveling' | 'endgame' | 'boss-killing' | 'farming';
  difficulty: 'normal' | 'uvh' | 'uvh6';
  
  skillTree: {
    actionSkill: string;
    keySkills: string[];
    capstone: string;
  };
  
  gear: {
    weapon1: string;
    weapon2: string;
    weapon3?: string;
    shield: string;
    grenadeMod: string;
    classmod: string;
    artifact: string;
  };
  
  tags: string[];
  rating: number;
  successRate: number;
  views: number;
  sourceUrl?: string;
}

// Calculator input types
export interface HD2CalculatorInput {
  missionType: 'extraction' | 'defense' | 'elimination';
  faction: 'terminids' | 'automatons' | 'illuminate';
  difficulty: 'helldive' | 'super-helldive';
  teamSize: 'solo' | 'duo' | 'squad';
  playstyle: 'aggressive' | 'support' | 'stealth' | 'versatile';
}

export interface BL4CalculatorInput {
  class: 'vex' | 'rafa' | 'amon' | 'harlowe';
  buildType: 'leveling' | 'endgame' | 'boss-killing' | 'farming';
  difficulty: 'normal' | 'uvh' | 'uvh6';
  playstyle: 'damage' | 'tank' | 'support' | 'speed';
}
```

Also create initial JSON data files:
- src/data/helldivers2-builds.json (with 3-5 sample builds)
- src/data/borderlands4-builds.json (with 3-5 sample builds)  
- src/data/creators.json (with sample creator data)

Use the TypeScript interfaces to ensure type safety throughout the application.
```

## PROMPT 3: BUILD BROWSER COMPONENTS

```
Create the build browser components with filtering and display functionality:

1. BUILD CARD COMPONENT (src/components/BuildCard.tsx):
- Display build name, creator, rating, and key info
- Show faction/class icons and compatibility badges
- Mobile-friendly card layout
- Click to view full build details
- Creator attribution with links
- Patch compatibility indicator
- Success rate display

2. BUILD FILTER COMPONENT (src/components/BuildFilter.tsx):
- Filter by faction/class, difficulty, mission type
- Sort by rating, date, popularity
- Search by name or creator
- Mobile-friendly dropdown/chip interface
- Real-time filtering

3. BUILD BROWSER PAGES:
Update src/app/helldivers2/page.tsx and src/app/borderlands4/page.tsx:
- Grid layout of build cards
- Integrated filtering system
- Pagination for large build lists
- Loading states and error handling
- Mobile-optimized layout

SPECIFIC REQUIREMENTS:
- Use Tailwind for styling with dark gaming theme
- Cards should be ~300px wide on desktop, full-width on mobile
- Show creator avatars/badges
- Rating stars (1-5) with visual indicators
- Color-coded faction/class indicators
- "Updated X days ago" timestamps
- Success rate progress bars

Focus on clean, fast, mobile-first design that works well for gaming use cases.
```

## PROMPT 4: CALCULATOR SYSTEM

```
Implement the interactive build calculator system:

1. CALCULATOR LOGIC (src/lib/calculator-logic.ts):
Create scoring algorithms that match user inputs to optimal builds:

```typescript
export function calculateHD2Builds(
  input: HD2CalculatorInput,
  builds: HD2Build[]
): HD2Build[] {
  // Scoring algorithm:
  // 1. Exact faction match = +100 points
  // 2. Mission type match = +50 points  
  // 3. Team size compatibility = +30 points
  // 4. Difficulty match = +40 points
  // 5. Playstyle alignment = +20 points
  // 6. Success rate weighting = rating * successRate
  
  return builds
    .map(build => ({
      build,
      score: calculateBuildScore(build, input)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => item.build);
}

export function calculateBL4Builds(
  input: BL4CalculatorInput,  
  builds: BL4Build[]
): BL4Build[] {
  // Similar scoring for Borderlands 4 builds
}
```

2. CALCULATOR COMPONENT (src/components/BuildCalculator.tsx):
- Step-by-step form interface
- Game-specific input fields
- Real-time build recommendations
- Mobile-friendly UI with large touch targets
- Results display with explanations

3. CALCULATOR PAGES:
Implement src/app/helldivers2/calculator/page.tsx and src/app/borderlands4/calculator/page.tsx:
- Guided questionnaire format
- Progressive disclosure of options
- Instant results as user makes selections
- Detailed explanations of why builds are recommended
- Links to full build details
- Save/share functionality

CALCULATOR FLOW:
1. Game selection (if not already chosen)
2. Primary input (mission/class)  
3. Secondary inputs (difficulty, team size, etc.)
4. Playstyle preferences
5. Instant recommendations with explanations
6. Detailed build views

Make this fast and intuitive for use during gaming sessions.
```

## PROMPT 5: FINAL POLISH & DEPLOYMENT

```
Complete the application with final features and deployment setup:

1. HOMEPAGE (src/app/page.tsx):
- Game selection with large, visual buttons
- Recent builds showcase
- Creator spotlights  
- Quick access to calculators

2. NAVIGATION & LAYOUT (src/app/layout.tsx):
- Responsive navigation between games
- Quick calculator access
- Mobile hamburger menu
- Dark theme implementation

3. CREATOR ATTRIBUTION (src/components/CreatorAttribution.tsx):
- Creator profiles with links
- Attribution badges on builds
- Creator verification indicators

4. FINAL STYLING:
- Consistent dark gaming theme
- Smooth animations and transitions
- Loading states for all interactions
- Error handling and empty states
- Mobile optimization throughout

5. DEPLOYMENT SETUP:
- Configure for Vercel deployment
- Set up environment variables if needed
- Optimize bundle size and performance
- Add meta tags for SEO

6. TESTING FEATURES:
- Build rating system
- User feedback collection
- Analytics setup (optional)

PERFORMANCE REQUIREMENTS:
- Fast loading on mobile networks
- Smooth scrolling and interactions
- Optimized images and assets
- Minimal bundle size

Deploy to Vercel and provide the live URL for testing.
```
```