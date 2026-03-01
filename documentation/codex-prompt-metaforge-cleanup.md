# CODEX PROMPT: Clean Up MetaForge Gaming Platform

## 🚨 URGENT: Remove ALL Business Content from Gaming Platform

**CRITICAL ISSUE:** The MetaForge gaming build optimization platform homepage is showing Cinch-IT AI Sales Intelligence content instead of gaming content. This is completely wrong.

## 📖 REQUIRED READING

**Read the complete cleanup notes first:**
`/Users/jameserickson/.openclaw/workspace/metaforge-cleanup-notes.md`

This file contains:
- Detailed breakdown of incorrect business content currently showing
- Exact specifications for correct gaming content
- Clear before/after requirements
- Success criteria for completion

## 🎯 MISSION OBJECTIVE

**Transform the homepage from business/sales platform → gaming build optimization platform**

This should be like **op.gg for League of Legends** but for games like **Helldivers 2** and **Borderlands 4**. The platform helps gamers find optimal builds and loadouts from top creators.

## 🏗️ TECHNICAL SPECIFICATIONS

### **Project Location:**
- **Repository:** https://github.com/JE-MM-754/Video-Game
- **Local Path:** `/Users/jameserickson/.openclaw/workspace/Video-Game/`
- **Live URL:** https://metaforge-gaming-tools.vercel.app

### **Primary File to Fix:**
- **`src/app/page.tsx`** - COMPLETE REWRITE required (currently shows business content)

### **Reference Files (DO NOT CHANGE - These are CORRECT):**
- **`src/app/helldivers2/`** - Perfect example of correct gaming content
- **Navigation components** - MetaForge branding is correct
- **Creator attribution system** - Working properly
- **Build database and calculator** - All gaming content is perfect

## 🚀 IMPLEMENTATION REQUIREMENTS

### **1. HOMEPAGE TRANSFORMATION (`src/app/page.tsx`)**

**❌ REMOVE ALL:**
- Cinch-IT AI branding and references
- Sales intelligence language  
- Business features (prospect research, lead reactivation, competitor analysis)
- Enterprise/API/business CTAs
- Sales metrics and demo content

**✅ REPLACE WITH:**
```jsx
// New gaming-focused homepage structure
const MetaForgeHomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Gaming Hero Section */}
      <section className="relative py-20 lg:py-32">
        {/* Hero: "Master Every Game with Perfect Builds" */}
        {/* Subtext: "AI-powered build recommendations from top gaming creators" */}
        {/* CTAs: "Find My Build", "Browse Builds", "Try Calculator" */}
      </section>

      {/* Creator Showcase */}
      <section className="py-20">
        {/* Feature the 4 creators prominently */}
        {/* OhDough (Min-Max), Sovereign Gene (Tier Lists), Claysthetics (Community), BuzzLiteBeer (Meta) */}
      </section>

      {/* Game Showcase */}
      <section className="py-20">
        {/* Helldivers 2: Boss Fight Specialists, Creator Builds */}
        {/* Borderlands 4: Build Calculator, Weapon Optimization */}
        {/* Future Games: Coming Soon */}
      </section>

      {/* Platform Features */}
      <section className="py-20">
        {/* Build Calculator & Optimization */}
        {/* Creator-Validated Builds */}
        {/* Boss Fight Specialization */}
        {/* Real-Time Meta Tracking */}
        {/* Mobile-Optimized for In-Game Use */}
      </section>
    </div>
  );
};
```

### **2. CONTENT SPECIFICATIONS**

**Hero Section:**
- **Heading:** "Master Every Game with Perfect Builds" or similar gaming-focused
- **Description:** "Get AI-powered build recommendations from top gaming creators. Optimize your loadouts for Helldivers 2, Borderlands 4, and more."
- **CTAs:** "Find My Build", "Browse Builds", "Calculator"

**Creator Section:**
- **OhDough** - Min-max optimization specialist
- **Sovereign Gene** - Comprehensive tier list creator  
- **Claysthetics** - Community-tested build methodology
- **BuzzLiteBeer** - Meta analysis expert
- Show creator badges and validation system

**Game Section:**
- **Helldivers 2** - Hive Lord specialists, faction builds, creator-validated loadouts
- **Borderlands 4** - Build calculator, weapon synergies, skill optimization
- **Future Games** - Arc Raiders, Marathon, Path of Exile 2 (from our research)

**Features Section:**
- **Build Calculator** - AI-powered optimization engine
- **Creator Validation** - Top influencer approved builds  
- **Boss Fight Mode** - Specialized builds for challenging encounters
- **Meta Tracking** - Real-time balance and effectiveness updates
- **Mobile Ready** - Optimized for in-game reference

### **3. DESIGN DIRECTION**

**Visual Style:**
- **Keep dark gaming theme** - current dark gradient is perfect
- **Gaming iconography** - weapons, shields, game-related icons
- **Creator badges** - use existing badge system from Helldivers 2 page
- **Gaming metrics** - show build success rates, creator ratings, views
- **Game screenshots** - use actual game content for visual appeal

**Color Scheme:**
- **Primary:** Keep current purple/blue gradients (gaming appropriate)
- **Accents:** Use creator badge colors (purple for OhDough, blue for Sovereign Gene, green for Claysthetics, orange for BuzzLiteBeer)
- **Text:** White/gray for readability on dark background

### **4. NAVIGATION CONSISTENCY**

**Ensure consistent branding:**
- **Logo:** "MetaForge" (already correct)
- **Navigation:** Home, Helldivers 2, Borderlands 4 (already correct)
- **Search:** "Search builds globally" (already correct)

## 🎮 REFERENCE CONTENT FOR INSPIRATION

### **From Working Helldivers 2 Page:**
Use the `/helldivers2` page as inspiration for:
- Creator badge implementation  
- Build card design
- Rating and success rate displays
- Professional gaming platform appearance
- Strategy guide integration

### **Gaming Platform Examples:**
Think of sites like:
- **op.gg** for League of Legends builds
- **Overwatch tracker** for hero optimization
- **Destiny item manager** for loadout optimization

## 🔧 TECHNICAL IMPLEMENTATION NOTES

### **Components to Reuse:**
- Creator badge components from Helldivers 2 page
- Build card layouts and styling
- Rating systems and success metrics
- Navigation structure and search

### **Icons to Use:**
- Gaming-related Lucide icons: Shield, Zap, Target, TrendingUp
- Remove business icons: BarChart3 (for sales), Users (for prospects)
- Add gaming icons: Gamepad2, Swords, ShieldCheck

### **Data Integration:**
- Pull sample builds from existing Helldivers 2 data
- Show real creator names and ratings  
- Use actual game terminology and language
- Include real weapon names and strategies

## 🎯 QUALITY REQUIREMENTS

### **Content Standards:**
1. ✅ **Zero business/sales language** anywhere on homepage
2. ✅ **Gaming terminology** throughout (builds, loadouts, meta, etc.)
3. ✅ **Creator integration** prominent and functional
4. ✅ **Game-specific content** accurately reflects actual games
5. ✅ **Professional gaming platform** appearance

### **Technical Standards:**
1. ✅ **Mobile responsive** design maintained
2. ✅ **Fast loading** performance preserved
3. ✅ **Consistent navigation** with existing pages
4. ✅ **SEO optimized** for gaming searches
5. ✅ **Error-free** TypeScript compilation

## 📊 SUCCESS CRITERIA

### **Immediate Validation:**
- Homepage shows gaming build optimization content only
- Creator badges and validation system visible
- Game-specific sections for supported titles
- Professional gaming platform appearance
- All business/sales content removed

### **Final Testing:**
Navigate to https://metaforge-gaming-tools.vercel.app and verify:
- ✅ Gaming-focused hero section
- ✅ Creator showcase with proper badges
- ✅ Game sections for Helldivers 2 and Borderlands 4  
- ✅ Build optimization features highlighted
- ✅ Consistent MetaForge branding
- ✅ No Cinch-IT or business content anywhere

## ⚡ DEPLOYMENT INSTRUCTIONS

### **After Implementation:**
1. **Test locally:** `npm run dev` and verify homepage shows gaming content
2. **Build check:** `npm run build` to ensure no compilation errors
3. **Deploy:** `npx vercel --prod --yes` to update live site
4. **Verify live:** Check https://metaforge-gaming-tools.vercel.app shows correct content

### **Git Workflow:**
```bash
git add .
git commit -m "Transform homepage from business to gaming platform - remove all Cinch-IT content"
git push origin main
```

## 🎯 COMPLETION CRITERIA

**When you're finished:**

1. ✅ Homepage completely transformed to gaming platform
2. ✅ All business/sales content removed
3. ✅ Creator showcase properly integrated
4. ✅ Game sections functional and appealing
5. ✅ Professional gaming platform appearance
6. ✅ Consistent MetaForge branding throughout
7. ✅ Mobile optimization maintained

**Final validation:** 
- Navigate to live URL and confirm gaming build optimization platform
- No traces of Cinch-IT, sales intelligence, or business content
- Professional appearance worthy of top gaming creators

**When completely finished, run:**
```bash
openclaw system event --text "MetaForge gaming platform cleanup complete - all business content removed, pure gaming platform now live" --mode now
```

---

**CRITICAL REMINDER:** This is a gaming build optimization platform for Helldivers 2, Borderlands 4, etc. Remove EVERY trace of business/sales content and replace with gaming build optimization content. Use the working Helldivers 2 page as your reference for what the platform should look and feel like.