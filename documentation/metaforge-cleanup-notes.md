# MetaForge Video Game Platform Cleanup Notes
## 🚨 CRITICAL ISSUE: Business Content Mixed with Gaming

**Date:** 2026-02-28  
**Problem:** The MetaForge gaming platform homepage is showing Cinch-IT AI Sales Intelligence content instead of gaming build optimization content.

---

## 🔍 CURRENT ISSUES FOUND

### **Homepage (`src/app/page.tsx`) - COMPLETELY WRONG**

**❌ Current Content (ALL MUST BE REMOVED):**
- **Company Name:** "CinchIT AI" instead of "MetaForge"
- **Tagline:** "Enterprise AI Sales Intelligence" 
- **Hero Heading:** "Accelerate Your Sales with AI Intelligence"
- **Description:** "Transform your sales process with YouTube prospect research, competitive analysis, and AI-powered lead reactivation"
- **Features Listed:**
  - YouTube Intelligence
  - Dead Lead Reactivation  
  - Competitor Analysis
  - Market Signals
  - API Integration
  - Enterprise Security
- **CTAs:** "Start Free Trial", "Launch Platform", "Schedule Demo" (business CTAs)
- **Demo Content:** Prospect analysis, competitor alerts, lead reactivation
- **Navigation:** Links to business features like dashboard, pricing, API docs
- **Footer:** "CinchIT AI Sales Engine" branding

---

## ✅ WHAT IT SHOULD BE (GAMING CONTENT)

### **Homepage Should Show:**
- **Company Name:** "MetaForge" 
- **Tagline:** "Gaming Build Optimization Platform" or "Ultimate Gaming Build Tools"
- **Hero Heading:** "Optimize Your Gaming Builds" or "Master Every Game with Perfect Builds"
- **Description:** "AI-powered build recommendations for Helldivers 2, Borderlands 4, and more. Get creator-validated loadouts from top gaming influencers."
- **Features:**
  - Build Calculator & Optimization
  - Creator-Validated Builds (OhDough, Sovereign Gene, Claysthetics, BuzzLiteBeer)
  - Boss Fight Specialization  
  - Multi-Game Support (Helldivers 2, Borderlands 4, future games)
  - Real-Time Meta Tracking
  - Mobile-Optimized for In-Game Use
- **CTAs:** "Find My Build", "Browse Builds", "Try Calculator"
- **Demo Content:** Gaming builds, weapon loadouts, strategy guides
- **Navigation:** Links to game-specific pages, build browser, calculator
- **Footer:** "MetaForge Gaming Tools" branding

---

## 🎮 CORRECT CONTENT ALREADY EXISTS

### **✅ Working Gaming Pages:**
- **Helldivers 2 page (`/helldivers2`)** - CORRECTLY shows gaming content
  - Build browser with creator attribution
  - OhDough, Sovereign Gene, Claysthetics, BuzzLiteBeer builds
  - Boss fight mode builds (Hive Lord specialist builds)
  - Strategy guides and weapon effectiveness
- **Navigation** - CORRECTLY shows "MetaForge" brand with game links

---

## 🎯 CODEX ACTION ITEMS

### **PRIORITY 1: Replace Homepage Content**
1. **Remove ALL Cinch-IT/sales/business content** from `src/app/page.tsx`
2. **Replace with gaming-focused content** using the working Helldivers 2 page as inspiration
3. **Keep MetaForge branding** (which is correct in navigation)
4. **Add gaming hero section** showcasing build optimization
5. **Feature the 4 creators** (OhDough, Sovereign Gene, Claysthetics, BuzzLiteBeer)
6. **Add game showcase** (Helldivers 2, Borderlands 4, future games)
7. **Include build stats/metrics** instead of sales metrics

### **PRIORITY 2: Navigation Consistency**
1. **Ensure consistent MetaForge branding** across all pages
2. **Remove any business/sales navigation items**  
3. **Focus nav on:** Home, Helldivers 2, Borderlands 4, (future games)

### **PRIORITY 3: Footer & Metadata**
1. **Update footer** to reflect gaming platform
2. **Fix page titles/meta descriptions** to be gaming-focused
3. **Remove any business/enterprise/sales language**

---

## 🎨 DESIGN DIRECTION

### **Gaming Platform Aesthetic:**
- **Colors:** Keep the dark theme (gaming-appropriate) 
- **Hero Images:** Gaming screenshots, build interfaces, weapon loadouts
- **Icons:** Gaming-related icons (weapons, shields, etc.) instead of business icons
- **Metrics:** Show gaming stats (build success rates, creator ratings) instead of sales metrics
- **Layout:** Can keep similar structure but with gaming content

### **Creator Showcase:**
- **Feature creator badges** prominently on homepage
- **Show build statistics** (views, ratings, success rates)
- **Include creator validation** system
- **Link to creator-specific builds**

---

## 🚀 SUCCESS CRITERIA

### **When Complete:**
1. ✅ Homepage shows ONLY gaming content
2. ✅ MetaForge branding consistent throughout
3. ✅ No Cinch-IT/sales/business content anywhere
4. ✅ Gaming creators featured prominently  
5. ✅ Build optimization tools showcased
6. ✅ Navigation leads to gaming pages
7. ✅ Professional gaming platform appearance

### **Test URLs:**
- **Homepage:** https://metaforge-gaming-tools.vercel.app (should be gaming-focused)
- **Helldivers 2:** https://metaforge-gaming-tools.vercel.app/helldivers2 (already correct)
- **Borderlands 4:** https://metaforge-gaming-tools.vercel.app/borderlands4 (check if exists)

---

## 💡 KEY MESSAGE FOR CODEX

**"This is supposed to be a gaming build optimization platform like op.gg for League of Legends, but for games like Helldivers 2 and Borderlands 4. The homepage is currently showing business/sales content which is completely wrong. Replace ALL business content with gaming build optimization content. Keep the working Helldivers 2 page as reference for what the platform should look and feel like."**

---

**Files Requiring Changes:**
- `src/app/page.tsx` (COMPLETE REWRITE - remove all business content)
- Any other files with Cinch-IT/business references
- Meta tags, titles, descriptions

**Files That Are CORRECT (don't change):**
- `src/app/helldivers2/` directory (gaming content works perfectly)
- Navigation structure (MetaForge branding is correct)
- Creator attribution system (OhDough, Sovereign Gene, Claysthetics, BuzzLiteBeer)
- Build data and calculator logic