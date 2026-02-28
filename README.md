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
