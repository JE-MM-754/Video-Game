# SUPERVISED CODEX PROMPTS - Gaming Build Tool

## 🚀 PHASE 1: PROJECT FOUNDATION (30-45 minutes)

### CODEX PROMPT 1:
```
Create a Next.js 15 gaming build optimization tool called "MetaForge" with the following specifications:

TECH STACK:
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Dark gaming theme (slate-900, blue accents)

PROJECT SETUP:
1. Initialize Next.js project with TypeScript
2. Install and configure Tailwind CSS
3. Create dark gaming theme with custom colors
4. Set up responsive layout with mobile-first approach

FOLDER STRUCTURE:
```
src/
├── app/
│   ├── page.tsx (homepage)
│   ├── layout.tsx (root layout)
│   ├── globals.css (global styles)
│   ├── helldivers2/
│   │   └── page.tsx (HD2 builds page)
│   └── borderlands4/
│       └── page.tsx (BL4 builds page)
├── components/
│   ├── GameSelector.tsx
│   └── Navigation.tsx
└── lib/
    └── types.ts
```

HOMEPAGE REQUIREMENTS (src/app/page.tsx):
- Large game selection cards for Helldivers 2 and Borderlands 4
- Dark gaming aesthetic with game logos/imagery
- Mobile-responsive grid layout
- Navigation to each game's build section
- "MetaForge" branding header

LAYOUT REQUIREMENTS (src/app/layout.tsx):
- Dark theme implementation
- Responsive navigation bar
- Mobile hamburger menu
- Consistent typography and spacing

STYLING REQUIREMENTS:
- Dark background (slate-900/950)
- Blue accent colors for interactive elements
- Card-based design with subtle borders/shadows
- Large touch-friendly buttons for mobile
- Gaming-inspired typography

Create all the foundational files and ensure the app runs without errors. Focus on getting a working Next.js app with dark theme and basic navigation.
```

### ✅ SUCCESS CRITERIA:
- App runs with `npm run dev` without errors
- Homepage loads with game selection cards
- Dark theme is applied throughout
- Navigation works between pages
- Mobile-responsive layout

### 🚨 CHECKPOINT:
**Test these before moving to Phase 2:**
1. Run `npm run dev` - does it start without errors?
2. Visit homepage - do you see game selection cards?
3. Click on game cards - do they navigate to build pages?
4. Test on mobile viewport - is layout responsive?

**If any fail:** Screenshot + ping me. **If all pass:** Move to Phase 2.

---

## 🎯 PHASE 2: DATA STRUCTURES & TYPES (20-30 minutes)

### CODEX PROMPT 2:
```
Add comprehensive TypeScript interfaces and sample data for the gaming build tool.

CREATE TYPE DEFINITIONS (src/lib/types.ts):

```typescript
export type GameType = 'helldivers2' | 'borderlands4';

export interface Creator {
  id: string;
  name: string;
  platform: 'youtube' | 'twitch' | 'reddit';
  channelUrl: string;
  verified: boolean;
  avatar?: string;
}

export interface HD2Build {
  id: string;
  name: string;
  description: string;
  creator: Creator;
  createdAt: string;
  lastUpdated: string;
  patchVersion: string;
  
  // Game-specific fields
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
    cape?: string;
  };
  
  // Meta information
  tags: string[];
  rating: number; // 1-5
  successRate: number; // 0-100
  views: number;
  sourceUrl?: string;
  patchCompatible: boolean;
}

export interface BL4Build {
  id: string;
  name: string;
  description: string;
  creator: Creator;
  createdAt: string;
  lastUpdated: string;
  patchVersion: string;
  
  // Game-specific fields
  class: 'vex' | 'rafa' | 'amon' | 'harlowe';
  buildType: 'leveling' | 'endgame' | 'boss-killing' | 'farming';
  difficulty: 'normal' | 'uvh' | 'uvh6';
  
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
  
  // Meta information
  tags: string[];
  rating: number;
  successRate: number;
  views: number;
  sourceUrl?: string;
  patchCompatible: boolean;
}

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

CREATE SAMPLE DATA FILES:

1. Create src/data/creators.json with 5-7 sample gaming creators
2. Create src/data/helldivers2-builds.json with 5-8 sample HD2 builds using the interface
3. Create src/data/borderlands4-builds.json with 5-8 sample BL4 builds using the interface

SAMPLE DATA REQUIREMENTS:
- Use real creator names from gaming community (OhDough, Moxsy, etc.)
- Create realistic build names and descriptions
- Include variety in faction/class, difficulty, and build types
- Use current patch versions (HD2: "6.0.3", BL4: "1.030")
- Mix of ratings (3.5-5.0) and success rates (65-95%)

Ensure all data conforms to TypeScript interfaces and includes realistic gaming content.
```

### ✅ SUCCESS CRITERIA:
- TypeScript compiles without errors
- All data files are created with sample content
- Types are properly exported and importable
- Data structure matches gaming build requirements

### 🚨 CHECKPOINT:
**Test these before moving to Phase 3:**
1. TypeScript compilation passes (no type errors)
2. Can import types in other files
3. JSON files are valid and loadable
4. Sample data looks realistic for gaming builds

**If any fail:** Screenshot + ping me. **If all pass:** Move to Phase 3.

---

## 🏗️ PHASE 3: BUILD BROWSER INTERFACE (45-60 minutes)

### CODEX PROMPT 3:
```
Create the build browsing interface with cards, filtering, and mobile optimization.

CREATE BUILD CARD COMPONENT (src/components/BuildCard.tsx):
- Displays build info in card format
- Shows creator attribution with avatar/badge
- Rating display (5-star system)
- Faction/class indicators with color coding
- Patch compatibility badge
- Success rate progress bar
- Mobile-optimized touch targets
- Click to view full build details

CREATE BUILD FILTER COMPONENT (src/components/BuildFilter.tsx):
- Filter by faction/class, difficulty, mission type/build type
- Sort options: rating, date, popularity, success rate
- Search by build name or creator
- Mobile-friendly dropdown/chip interface
- Real-time filtering as user types/selects
- Clear all filters option

UPDATE BUILD BROWSER PAGES:

1. UPDATE src/app/helldivers2/page.tsx:
- Grid layout of HD2 build cards
- Integrated filtering system
- Load builds from JSON data
- Responsive grid (1 col mobile, 2-3 cols tablet, 4 cols desktop)
- Empty states and loading indicators
- Page title and description

2. UPDATE src/app/borderlands4/page.tsx:
- Similar to HD2 page but for BL4 builds
- Class-specific filtering options
- BL4-appropriate color scheme and iconography

STYLING REQUIREMENTS:
- Cards: ~300px wide on desktop, full-width on mobile
- Dark theme consistency
- Hover effects and smooth transitions
- Color-coded indicators:
  - HD2: Blue (Automatons), Green (Terminids), Purple (Illuminate), Gray (Universal)
  - BL4: Red (Damage), Blue (Tank), Green (Support), Yellow (Speed)
- Mobile-first responsive design
- Touch-friendly interface elements

DATA INTEGRATION:
- Import and use sample data from JSON files
- Implement type-safe data handling
- Error handling for missing data
- Performance optimization for large lists

Focus on creating a polished, mobile-friendly browsing experience that gamers can use easily during gameplay sessions.
```

### ✅ SUCCESS CRITERIA:
- Build cards display with all required information
- Filtering system works (faction, difficulty, etc.)
- Search functionality works
- Mobile layout is responsive and touch-friendly
- Data loads from JSON files correctly

### 🚨 CHECKPOINT:
**Test these before moving to Phase 4:**
1. Build cards render properly with sample data
2. Filters work (select faction, see filtered results)
3. Search works (type build name, see results)
4. Mobile layout looks good and is touch-friendly
5. Navigation between HD2 and BL4 pages works

**If any fail:** Screenshot + ping me. **If all pass:** Move to Phase 4.

---

## 🧮 PHASE 4: CALCULATOR SYSTEM (45-60 minutes)

### CODEX PROMPT 4:
```
Implement the interactive build calculator with recommendation algorithms.

CREATE CALCULATOR LOGIC (src/lib/calculator-logic.ts):

```typescript
import { HD2Build, BL4Build, HD2CalculatorInput, BL4CalculatorInput } from './types';

export function calculateHD2BuildScore(build: HD2Build, input: HD2CalculatorInput): number {
  let score = 0;
  
  // Faction matching (high weight)
  if (build.faction === input.faction || build.faction === 'universal') {
    score += 100;
  }
  
  // Mission type matching
  if (build.missionType === input.missionType || build.missionType === 'universal') {
    score += 50;
  }
  
  // Team size compatibility
  if (build.teamSize === input.teamSize || build.teamSize === 'any') {
    score += 30;
  }
  
  // Difficulty matching
  if (build.difficulty === input.difficulty || build.difficulty === 'all') {
    score += 40;
  }
  
  // Playstyle alignment (based on tags)
  if (build.tags.includes(input.playstyle)) {
    score += 20;
  }
  
  // Quality weighting
  score += (build.rating * 10) + (build.successRate * 0.5);
  
  // Patch compatibility bonus
  if (build.patchCompatible) {
    score += 15;
  }
  
  return score;
}

export function calculateBL4BuildScore(build: BL4Build, input: BL4CalculatorInput): number {
  let score = 0;
  
  // Class matching (must match)
  if (build.class !== input.class) return 0;
  
  // Build type matching
  if (build.buildType === input.buildType) {
    score += 80;
  }
  
  // Difficulty matching
  if (build.difficulty === input.difficulty || build.difficulty === 'normal') {
    score += 50;
  }
  
  // Playstyle alignment
  if (build.tags.includes(input.playstyle)) {
    score += 30;
  }
  
  // Quality weighting
  score += (build.rating * 10) + (build.successRate * 0.5);
  
  // Patch compatibility bonus
  if (build.patchCompatible) {
    score += 15;
  }
  
  return score;
}

export function getHD2Recommendations(
  input: HD2CalculatorInput,
  builds: HD2Build[]
): HD2Build[] {
  return builds
    .map(build => ({
      build,
      score: calculateHD2BuildScore(build, input)
    }))
    .filter(item => item.score > 50) // Minimum relevance threshold
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => item.build);
}

export function getBL4Recommendations(
  input: BL4CalculatorInput,
  builds: BL4Build[]
): BL4Build[] {
  return builds
    .map(build => ({
      build,
      score: calculateBL4BuildScore(build, input)
    }))
    .filter(item => item.score > 30)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => item.build);
}
```

CREATE CALCULATOR COMPONENT (src/components/BuildCalculator.tsx):
- Step-by-step form interface with large, touch-friendly inputs
- Game-specific input fields (faction vs class, etc.)
- Real-time build recommendations as user makes selections
- Results display with explanations of why builds are recommended
- Links to view full build details
- Mobile-optimized with progressive disclosure
- Form validation and error handling

CREATE CALCULATOR PAGES:

1. CREATE src/app/helldivers2/calculator/page.tsx:
- HD2-specific calculator form
- Mission type, faction, difficulty, team size, playstyle inputs
- Real-time recommendations display
- Explanatory text for each input

2. CREATE src/app/borderlands4/calculator/page.tsx:
- BL4-specific calculator form  
- Class, build type, difficulty, playstyle inputs
- Class-specific guidance and recommendations

CALCULATOR UX REQUIREMENTS:
- Guided questionnaire format with clear steps
- Instant results as user makes selections (no submit button needed)
- Detailed explanations: "This build is recommended because..."
- Visual hierarchy with clear sections
- Mobile-first design with large touch targets
- Smooth animations and transitions
- Empty states when no builds match criteria

Focus on creating an intuitive calculator that gamers can use quickly during loadout selection.
```

### ✅ SUCCESS CRITERIA:
- Calculator forms render with all input options
- Real-time recommendations work as selections are made
- Scoring algorithm returns relevant builds
- Calculator explains why builds are recommended
- Mobile interface is easy to use

### 🚨 CHECKPOINT:
**Test these before moving to Phase 5:**
1. Calculator pages load without errors
2. Form inputs work (can select faction, difficulty, etc.)
3. Recommendations appear when making selections
4. Recommended builds look relevant to selections
5. Mobile layout is user-friendly

**If any fail:** Screenshot + ping me. **If all pass:** Move to Phase 5.

---

## 🎨 PHASE 5: FINAL POLISH & DEPLOYMENT (30-45 minutes)

### CODEX PROMPT 5:
```
Complete the application with final polish, navigation improvements, and deployment setup.

UPDATE HOMEPAGE (src/app/page.tsx):
- Enhance game selection with better visuals
- Add "Quick Calculator" links for each game
- Recent/featured builds showcase
- Clear value proposition text
- Gaming-inspired hero section

ENHANCE NAVIGATION (src/app/layout.tsx):
- Add navigation menu with links to:
  - Home
  - Helldivers 2 (with submenu: Builds, Calculator)
  - Borderlands 4 (with submenu: Builds, Calculator)
- Mobile hamburger menu
- Breadcrumb navigation
- Search functionality (global build search)

ADD FINAL COMPONENTS:

1. CREATE src/components/Navigation.tsx:
- Responsive navigation with mobile menu
- Active state indicators
- Quick access to calculators
- Search functionality

2. CREATE src/components/BuildDetail.tsx:
- Modal or dedicated page for full build details
- Complete loadout/gear information
- Creator information and attribution
- Community rating system
- Share functionality

STYLING IMPROVEMENTS:
- Consistent spacing and typography throughout
- Smooth animations and hover effects
- Loading states for all async operations
- Error boundaries and graceful error handling
- Accessibility improvements (ARIA labels, keyboard navigation)
- Dark theme refinements

PERFORMANCE OPTIMIZATION:
- Image optimization for game assets
- Component lazy loading where appropriate
- Bundle size optimization
- Mobile performance tuning

DEPLOYMENT SETUP:
- Configure for Vercel deployment
- Set up build scripts and environment
- Add meta tags for SEO
- Create deployment-ready package.json scripts
- Test production build

FINAL TESTING:
- Cross-browser compatibility
- Mobile responsiveness across devices
- All features working end-to-end
- Performance audit
- Accessibility check

Deploy the completed application to Vercel and provide the live URL for testing.
```

### ✅ SUCCESS CRITERIA:
- Complete, polished web application
- All navigation works smoothly  
- Mobile experience is excellent
- App deployed to live URL
- All features functional end-to-end

### 🚨 FINAL CHECKPOINT:
**Test these before calling it complete:**
1. Full navigation works (home, builds, calculator for both games)
2. All features function properly
3. Mobile experience is smooth and responsive
4. App is deployed to a live URL
5. No major bugs or broken functionality

**If any fail:** Screenshot + ping me. **If all pass:** SUCCESS! 🎉

---

## 📞 **COORDINATION PROTOCOL:**

**After each phase, ping me with:**
- ✅ "Phase X complete" OR ❌ "Phase X stuck - [screenshot/error]"
- Live URL (when available)
- Any questions or issues

**I'll respond with:**
- Troubleshooting help if needed
- Confirmation to proceed to next phase
- Research progress updates

**🚀 START WITH PHASE 1 - LET'S BUILD YOUR GAMING EMPIRE!**