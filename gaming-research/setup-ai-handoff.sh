#!/bin/bash
# setup-ai-handoff.sh - Automated AI Development Handoff System Setup

PROJECT_DIR="/Users/jameserickson/Documents/Video Game Build Business"
WORKSPACE_DIR="/Users/jameserickson/.openclaw/workspace/gaming-builds"

echo "🚀 Setting up AI Development Handoff System..."

# Navigate to project
cd "$PROJECT_DIR"

# Create documentation structure
mkdir -p docs
mkdir -p .github/templates

# Create initial PICKUP.md
cat > PICKUP.md << 'EOF'
# 🔄 DEVELOPMENT PICKUP - 2026-02-28 01:45 EST

## 🎯 CURRENT STATE
- **Last worked by:** MoneyMachine (OpenClaw Assistant)
- **Branch:** main  
- **Status:** Working prototype with critical UX issues

## 🏗️ WHAT'S WORKING
- Next.js 15 application with TypeScript and Tailwind
- Comprehensive gaming build database (24+ strategic builds)
- Real creator attribution (OhDough, Moxsy, LazyData, etc.)
- Build calculator with recommendation algorithms
- Dark gaming theme optimized for mobile
- Current patch compatibility (HD2 6.0.3, BL4 1.030)

## 🚨 WHAT'S BROKEN (CRITICAL)
- **Calculator state persistence:** User selections not preserved during navigation
- **Build detail navigation:** Clicking "View Details" goes to wrong page
- **Performance jittering:** Input lag on calculator selections  
- **Typography:** Hard to read at 100% browser zoom
- **Filter logic:** Recommendations don't match user inputs (shows bot builds when user selected bugs)

## 🎯 NEXT PRIORITY TASKS
1. **Fix calculator state persistence** (CRITICAL - users lose selections)
2. **Redesign build detail views** (CRITICAL - current views unusable) 
3. **Fix recommendation filtering** (CRITICAL - logic broken)
4. **Improve typography/readability** (HIGH - UX issue)
5. **Performance optimization** (HIGH - eliminate jittering)

## 📝 TECHNICAL CONTEXT
- **Stack:** Next.js 15, TypeScript, Tailwind CSS, React
- **Data:** Real gaming builds stored in src/data/ as JSON
- **Architecture:** Component-based with JSON data integration
- **Recent changes:** Integrated comprehensive build research database
- **State management:** Currently using React state (needs improvement)

## 🔧 DEVELOPMENT ENVIRONMENT
- **Node version:** Latest stable
- **Package manager:** npm
- **Dev server:** `npm run dev` (runs on localhost:3000)
- **Build command:** `npm run build`
- **Deploy:** Can use `npx vercel --prod` for live URL

## 💡 IMPLEMENTATION NOTES
- Using actual gaming expertise with creator validation
- Build database includes strategic context ("Why this works")
- Success rate data from community validation included
- Patch compatibility tracking implemented
- Mobile-first design for gaming use

## 🎮 TESTING INSTRUCTIONS
1. Run `npm run dev`
2. Navigate to Helldivers 2 calculator
3. Select: Terminids, Defense, Balanced playstyle
4. Click on recommended build - should go directly to build details
5. **Expected:** Build details for selected build
6. **Actual:** Wrong page or loses user context

## 📞 HANDOFF NOTES FOR NEXT AI
- **Critical path:** Fix state persistence first - nothing else matters if users lose selections
- **User testing revealed:** Calculator completely broken for real usage
- **Research database is solid** - problem is UX implementation, not content
- **Mobile optimization important** - users want this during gaming sessions
- **Performance must be snappy** - any lag kills gaming use case

## 🔍 KEY FILES TO UNDERSTAND
- `src/app/helldivers2/calculator/page.tsx` - Main calculator component
- `src/components/BuildCalculator.tsx` - Calculator logic
- `src/lib/calculator-logic.ts` - Recommendation algorithms  
- `src/data/helldivers2-builds.json` - Build database
- `src/components/BuildCard.tsx` - Build display component

## 🎯 SUCCESS CRITERIA
- User can select calculator options and navigate to build details without losing context
- Build recommendations match user selections correctly
- Typography readable at normal browser zoom
- No performance issues during interaction
EOF

# Create HANDOFF-LOG.md
cat > HANDOFF-LOG.md << 'EOF'
# 🔄 AI Development Handoff Log

## 2026-02-28 01:45 EST - Setup by MoneyMachine

### **Session Summary:**
- **Duration:** 8+ hours (research + development)
- **Focus:** Comprehensive gaming build research + Next.js implementation
- **Outcome:** Working prototype with real gaming intelligence but critical UX issues

### **Key Accomplishments:**
- Built comprehensive gaming build database with 24+ strategic builds
- Integrated real creator validation (OhDough, Moxsy, LazyData, AncientRune)
- Implemented build calculator with recommendation algorithms
- Added current patch compatibility tracking (HD2 6.0.3, BL4 1.030)
- Created strategic context for each build ("Why this works", tactical advice)
- Live user testing revealed critical UX issues

### **Technical Implementation:**
- Next.js 15 with TypeScript and Tailwind CSS
- Component-based architecture with JSON data integration  
- Mobile-first responsive design
- Real gaming data vs placeholder content

### **Critical Issues Discovered:**
- Calculator state persistence completely broken
- Build detail navigation goes to wrong pages
- Performance jittering on user input
- Typography readability issues

### **Status Change:**
- **Before:** Research and concept phase
- **After:** Working prototype with real gaming data but UX blockers

### **Next Session Priorities:**
1. Fix calculator state persistence (blocks all usage)
2. Redesign build detail views (currently unusable)
3. Performance optimization for smooth interactions

### **Research Assets Created:**
- `/gaming-builds/comprehensive-build-database.md` - Full strategic build analysis
- `/gaming-builds/codex-ui-fixes-prompt.md` - Detailed fix instructions
- Boss-specific build research (Hive Lord tactics validated)
- Creator analysis framework for ongoing research

### **Handoff Status:** ✅ Ready - Full context documented, clear priorities identified

---
EOF

# Create comprehensive README.md
cat > README.md << 'EOF'
# MetaForge - Gaming Build Optimization Tool

> Get the exact loadout for your mission in 30 seconds

## 🎮 Overview

MetaForge is an AI-powered gaming build optimization tool that provides strategic loadout recommendations for Helldivers 2 and Borderlands 4. Unlike generic build databases, MetaForge includes deep strategic context, creator validation, and real-time patch compatibility.

### Key Features
- **Instant Build Calculator** - Get optimal loadouts for your specific mission
- **Creator-Validated Builds** - Builds from top creators like OhDough, Moxsy, LazyData
- **Strategic Context** - Understand WHY builds work, not just WHAT to equip
- **Current Patch Compatibility** - Always up-to-date with latest game changes
- **Mobile Optimized** - Use during gaming sessions on phone/tablet

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server  
npm run dev

# Open http://localhost:3000
```

## 🏗️ Architecture

- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS
- **Data:** JSON-based build database with strategic context
- **Research:** AI-curated gaming intelligence with creator validation
- **Mobile:** Responsive design optimized for gaming use

## 🤖 AI Development Workflow

This project uses AI-assisted development with standardized handoff protocols:

- **PICKUP.md** - Current development state and next priorities
- **HANDOFF-LOG.md** - Development history between AI assistants  
- **Comprehensive documentation** - Full context for seamless AI-to-AI collaboration

### For AI Assistants

1. **Read PICKUP.md first** - Contains current state and priorities
2. **Check HANDOFF-LOG.md** - Recent changes and context
3. **Test current functionality** - `npm run dev` and validate working features
4. **Update documentation** - Maintain PICKUP.md after each session

## 📋 Current Status

**Status:** Working prototype with critical UX issues
**Priority:** Fix calculator state persistence and navigation
**Last Updated:** 2026-02-28 by MoneyMachine

See [PICKUP.md](PICKUP.md) for detailed development state.

## 🎯 Build Database

### Helldivers 2 (Patch 6.0.3 Compatible)
- **Terminid Specialists:** Bug Nest Eradicator, Bile Titan Hunter
- **Automaton Counters:** Bot Breaker, Walking Barrage Specialist  
- **Illuminate Builds:** Purifier Anti-Shield, Eruptor variants
- **Boss Specialists:** Hive Lord builds with validated tactics
- **Mission-Specific:** Speed extraction, stealth infiltration

### Borderlands 4 (Patch 1.030 Compatible)  
- **Vex Builds:** Kill skill variants, MANTRARMY specializations
- **Rafa Builds:** Ricochet mastery, Splash and Dash
- **Amon Builds:** HORBA endgame, Heavy Ordnance specialists
- **Harlowe Builds:** DOT mastery, Flux Generator control
- **Leveling Builds:** Efficient 1-65 progression for all classes

## 🔧 Development Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Code linting
npx vercel --prod    # Deploy to live URL
```

## 🧪 Testing

1. **Calculator Flow:** Select game → mission type → get recommendation
2. **Build Details:** Click recommendation → view full build details
3. **Mobile Testing:** Test on phone/tablet viewport
4. **Performance:** Ensure smooth interactions without jittering

## 📚 Documentation

- [PICKUP.md](PICKUP.md) - Current development state  
- [HANDOFF-LOG.md](HANDOFF-LOG.md) - AI development history
- [docs/ai-handoff-guide.md](docs/ai-handoff-guide.md) - AI collaboration guide

## 🎮 Research Sources

Builds validated by top gaming creators:
- **Helldivers 2:** OhDough, @CLAYSTHETICS, community tier lists
- **Borderlands 4:** Moxsy, LazyData, NickTew, AncientRune (Mobalytics)

All builds include strategic context, success rates, and tactical guidance beyond basic loadout information.

---

*Built with AI-assisted development and gaming expertise*
EOF

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.npm
*.log

# Production
build/
dist/
.next/
out/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Runtime
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
.nyc_output

# Grunt intermediate storage
.grunt

# node-waf configuration
.lock-wscript

# Compiled binary addons
build/Release

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# Serverless directories
.serverless

# Webpack bundle analyzer
.webpack-bundle-analyzer

# Local Netlify folder
.netlify

# Stores VSCode versions used for testing VSCode extensions
.vscode-test
EOF
fi

# Git setup
echo "📝 Setting up Git repository..."

if [ ! -d .git ]; then
    git init
    echo "✅ Git repository initialized"
fi

# Add all files
git add .

# Create initial commit if none exists
COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null || echo 0)
if [ "$COMMIT_COUNT" = "0" ]; then
    git commit -m "feat: Initial AI handoff system setup

- Complete gaming build research database (24+ builds)
- Working Next.js application with real gaming intelligence
- AI development handoff documentation system  
- Creator validation (OhDough, Moxsy, LazyData, etc.)
- Current patch compatibility (HD2 6.0.3, BL4 1.030)

Status: Working prototype with UX issues
Next: Fix calculator state persistence
Handoff-Ready: Yes"
    echo "✅ Initial commit created"
else
    echo "ℹ️ Git repository already has commits"
fi

echo ""
echo "🎉 AI Development Handoff System setup complete!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Create GitHub repository at https://github.com/new"
echo "2. Add remote: git remote add origin [your-repo-url]"
echo "3. Push code: git push -u origin main"
echo ""
echo "🤖 AI HANDOFF READY:"
echo "- Read PICKUP.md for current development state"
echo "- Check HANDOFF-LOG.md for recent changes"  
echo "- Run 'npm run dev' to test current functionality"
echo "- Update PICKUP.md after each development session"
echo ""
echo "🔧 IMMEDIATE PRIORITIES:"
echo "1. Fix calculator state persistence (CRITICAL)"
echo "2. Redesign build detail views (CRITICAL)"
echo "3. Performance optimization (HIGH)"