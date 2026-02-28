# CODEX UI/UX FIX PROMPT - MetaForge Critical Issues

Copy this entire prompt into Codex to fix all user testing issues:

---

```
TASK: Fix critical UX/UI issues in MetaForge gaming build tool based on user testing feedback

PRIORITY: HIGH - These are blocking user adoption and core functionality

## 1. HOMEPAGE & MESSAGING IMPROVEMENTS

PROBLEMS:
- Vague value proposition and call-to-action
- Unclear user flow and next steps
- Poor readability at normal browser zoom

SOLUTIONS:
- Replace "Build Faster, Win Cleaner" with clear, action-oriented headline
- Add specific value proposition: "Get the exact loadout for your mission in 30 seconds"
- Add prominent "Find My Build" button that goes directly to calculator
- Increase base font sizes by 20% for better readability at 100% zoom
- Add clear user flow: "1. Select game → 2. Choose mission → 3. Get build → 4. Win"

## 2. CALCULATOR STATE PERSISTENCE & LOGIC

CRITICAL PROBLEMS:
- User selections (faction, mission type, playstyle) not preserved when navigating
- Recommendations ignore user context (showing bot builds when user selected bugs)
- Filter logic broken - recommendations don't match inputs

SOLUTIONS:
- Implement proper state management to preserve calculator selections across navigation
- Fix recommendation algorithm to prioritize builds matching user's exact inputs
- Add URL parameters to maintain state: /calculator?faction=terminids&mission=defense&style=balanced
- Ensure build recommendations are filtered and sorted by relevance to user selections
- Add loading states to show calculator is processing user inputs

## 3. BUILD DETAIL VIEW COMPLETE REDESIGN

CRITICAL PROBLEMS:
- "View Build Details" doesn't go to specific build - goes to generic list
- Build details unusable - too small, poor layout
- Missing complete loadout information
- No direct path from recommendation to actionable build info

SOLUTIONS:
- Create dedicated build detail modal/page that opens from recommendation clicks
- Design full-screen or large modal build detail view with:
  * Complete loadout breakdown (primary, secondary, grenades, stratagems, armor)
  * Strategic context ("Why this works" prominently displayed)
  * Tactical advice section
  * Creator attribution
  * Success rate and community validation
- Direct navigation: Calculator recommendation → Specific build detail → Back to calculator with state preserved
- Add "Copy Loadout" functionality for easy in-game reference

## 4. HELLDIVERS 2 CALCULATOR UX IMPROVEMENTS

PROBLEMS:
- "Helldive/Super Helldive" terminology confusing
- Team size assumptions don't match reality
- Missing "random player" scenario

SOLUTIONS:
- Replace difficulty dropdown with intuitive slider:
  * Easy → Medium → Hard → Expert → Nightmare
  * Show original terms as subtitles: "Expert (Helldive)", "Nightmare (Super Helldive)"
- Add "I'm going in alone/with randoms" option for team size that:
  * Assumes solo capability but team-compatible builds
  * Prioritizes self-sufficient loadouts
  * Labels as "YOLO Mode - Solo/Random Ready"
- Improve playstyle options to be more descriptive:
  * "Balanced (All-around effectiveness)"
  * "Aggressive (High damage, high risk)"
  * "Support (Keep team alive)"
  * "Stealth (Avoid detection)"

## 5. REMOVE BROKEN FUNCTIONALITY

IMMEDIATE REMOVALS:
- Disable hover functionality on creator build cards (not working properly)
- Remove or fix "Share build" button that appears incorrectly
- Clean up any non-functional UI elements causing confusion

## 6. NAVIGATION & FLOW IMPROVEMENTS

CRITICAL FIXES:
- Fix build detail navigation to go directly to specific builds
- Maintain calculator context when viewing build details
- Add breadcrumb navigation: Calculator → Results → Build Detail
- Implement proper back button functionality that preserves state
- Add "Try Another Build" option in build details that returns to filtered results

## 7. VISUAL & ACCESSIBILITY IMPROVEMENTS

TYPOGRAPHY & READABILITY:
- Increase base font size from current to minimum 16px
- Improve text contrast ratios for better readability
- Add proper spacing between UI elements
- Optimize mobile responsiveness for actual gaming use (phone/tablet during play)

## 8. TECHNICAL REQUIREMENTS

STATE MANAGEMENT:
- Implement proper React state management or URL parameters
- Ensure calculator selections persist across page navigation
- Build recommendation filtering must respect all user inputs
- Add proper loading states and error handling

USER EXPERIENCE:
- Fast recommendation generation (< 2 seconds)
- Clear visual feedback for user actions
- Intuitive navigation that doesn't lose user progress
- Mobile-optimized for use during gaming sessions

## 9. TESTING REQUIREMENTS

BEFORE COMPLETION:
- Test complete user flow: Homepage → Calculator → Recommendation → Build Detail → Back
- Verify calculator state persistence across all navigation
- Confirm build recommendations match user inputs correctly
- Test readability at 100% browser zoom
- Verify mobile responsiveness

## DELIVERABLE PRIORITY:
1. Fix calculator state persistence (CRITICAL)
2. Fix build detail navigation (CRITICAL)
3. Improve typography/readability (HIGH)
4. Enhance calculator UX (HIGH)
5. Homepage improvements (MEDIUM)

Focus on core functionality first - users need a working calculator and build details before cosmetic improvements.
```

---

## USAGE INSTRUCTIONS:

1. Open this file in your documents
2. Copy the entire prompt (everything between the ``` markers)
3. Paste into Codex
4. Let it fix all the critical issues

## EXPECTED OUTCOME:

After these fixes, the app should have:
- Working calculator that preserves user selections
- Proper build detail views that are actually usable
- Better readability and navigation flow
- Intuitive difficulty/team size options

This addresses every issue you identified during testing.