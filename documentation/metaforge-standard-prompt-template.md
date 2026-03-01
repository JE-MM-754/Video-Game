# MetaForge Standard Prompt Template

## 📋 Copy-Paste Template for ALL MetaForge Prompts

**Use this template structure for every MetaForge-related prompt to Codex or Claude:**

```markdown
[YOUR MAIN PROMPT CONTENT HERE - describe what you want built/fixed/improved]

---

## 🧠 FEEDBACK-DRIVEN OPTIMIZATION AVAILABLE

You have access to the **feedback-analyzer skill** for data-driven platform optimization. This skill can:

- **Analyze user feedback data** to identify performance gaps
- **Detect mission-specific patterns** for better recommendations  
- **Validate creator accuracy** against real user experience
- **Generate optimization insights** with statistical confidence
- **Create systematic improvement prompts** for platform enhancement

**When implementing changes, also analyze any available feedback data using the feedback-analyzer skill to ensure improvements address real user pain points and are grounded in actual user experience rather than theoretical assumptions.**

**Data sources available:**
- MetaForge localStorage exports (`metaforge-rl-feedback`)
- User rating and performance data
- Mission success/failure correlations
- Creator effectiveness validation data

This ensures all MetaForge optimizations are data-driven rather than purely theoretical.
```

## 🎯 Example Usage

### Emergency UX Fixes:
```markdown
Fix the MetaForge calculator page scrolling issue - selections should not scroll user back to top. Also simplify the feedback form by removing overly complex fields like "objectives completed/total objectives" that users won't fill out. Add the missing "Retrieve Valuable Data" mission to the Terminid missions list.

---

## 🧠 FEEDBACK-DRIVEN OPTIMIZATION AVAILABLE

You have access to the feedback-analyzer skill for data-driven platform optimization. This skill can analyze user feedback data, detect mission-specific patterns, validate creator accuracy, and generate optimization insights with statistical confidence.

When implementing these UX fixes, also analyze any available feedback data using the feedback-analyzer skill to ensure improvements address real user pain points and are grounded in actual user experience rather than theoretical assumptions.

Data sources available: MetaForge localStorage exports, user rating/performance data, mission success correlations, creator effectiveness validation.
```

### Build Algorithm Optimization:
```markdown
Improve the MetaForge build recommendation algorithm to better weight mission-specific effectiveness. Users report that mobility builds perform better on data extraction missions while heavy builds excel at boss fights, but the current algorithm doesn't reflect this pattern.

---

## 🧠 FEEDBACK-DRIVEN OPTIMIZATION AVAILABLE

You have access to the feedback-analyzer skill for data-driven platform optimization. This skill can analyze user feedback data, detect mission-specific patterns, validate creator accuracy, and generate optimization insights with statistical confidence.

When optimizing the recommendation algorithm, analyze feedback data using the feedback-analyzer skill to identify actual mission-specific performance patterns and ensure algorithm changes are based on real user success rates rather than theoretical assumptions.
```

### Creator Content Validation:
```markdown
Review and update creator credibility scores based on user feedback correlation. Some creators' builds may be consistently over or under-performing relative to their platform ratings, and we need to adjust recommendations accordingly.

---

## 🧠 FEEDBACK-DRIVEN OPTIMIZATION AVAILABLE

You have access to the feedback-analyzer skill for data-driven platform optimization. This skill can analyze user feedback data, detect mission-specific patterns, validate creator accuracy, and generate optimization insights with statistical confidence.

Use the feedback-analyzer skill to correlate creator predictions with actual user performance data, identify accuracy patterns, and generate credibility score adjustments based on statistical analysis rather than subjective assessment.
```

## 🔄 Workflow Benefits

### Data-Driven Development:
- **Every change** backed by user experience data
- **Statistical validation** of all improvements
- **Performance gap detection** before and after updates
- **User satisfaction** correlation with platform changes

### Continuous Improvement:
- **Feedback loops** established in every development cycle
- **Pattern detection** that humans might miss
- **Creator accountability** through ongoing validation
- **Platform intelligence** that grows with user data

### Quality Assurance:
- **Real user needs** prioritized over theoretical optimizations
- **Evidence-based decisions** rather than assumptions
- **Measurable impact** of all platform changes
- **Self-improving system** that learns from every interaction

## 📝 Quick Reference

**Minimal inclusion (for simple tasks):**
```markdown
🧠 Note: feedback-analyzer skill available for data-driven validation.
```

**Standard inclusion (recommended default):**
```markdown
[Use the full template above]
```

**Custom inclusion (for specific analysis):**
```markdown
🧠 Feedback Analysis: Before implementing changes, analyze feedback data for [specific area] using the feedback-analyzer skill to validate [specific metric] improvements target actual user pain points.
```

## 💡 Remember

**ALWAYS include feedback analysis capability in MetaForge prompts** to ensure:
- ✅ Data-driven optimization
- ✅ User experience validation  
- ✅ Statistical confidence in changes
- ✅ Continuous platform improvement
- ✅ Evidence-based development decisions

**This transforms MetaForge from guesswork-based to intelligence-driven platform optimization.**