# Contributing to MetaForge Gaming Tools

We love your input! We want to make contributing to MetaForge Gaming Tools as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests Process

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Code Style

We use ESLint and Prettier for code formatting. Please ensure your code follows these standards:

```bash
# Run linting
npm run lint

# Run type checking  
npm run type-check

# Run tests
npm test
```

## Gaming Data Contributions

### Build Submissions

When submitting new builds, please include:

```json
{
  "build_name": "Your Build Name",
  "game": "helldivers2|borderlands4",
  "patch_version": "current_patch",
  "loadout": {
    "primary": "weapon_name",
    "secondary": "weapon_name",
    "grenades": "grenade_type",
    "stratagems": ["stratagem1", "stratagem2"]
  },
  "performance_data": {
    "success_rate": 0.85,
    "mission_types": ["mission_type1"],
    "difficulty_tested": ["difficulty_level"],
    "sample_size": 50
  },
  "creator_info": {
    "tester": "your_username",
    "source": "original|adapted_from_creator"
  }
}
```

### Testing Requirements

- Minimum **20 mission runs** for statistical validity
- Test across multiple difficulty levels when applicable
- Document mission types where build excels/struggles
- Include team composition context if relevant

### Meta Analysis Contributions

When reporting meta shifts or patch impacts:

1. **Before/After comparisons** with specific data points
2. **Sample sizes** for statistical confidence
3. **Patch notes correlation** with observed changes
4. **Community consensus** indicators

## Bug Reports

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/yourusername/metaforge-gaming-tools/issues/new).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Feature Requests

We're always looking for ways to improve MetaForge Gaming Tools. Feature requests should include:

- **Use case description** - What problem does this solve?
- **Proposed solution** - How should it work?
- **Alternative solutions** - What other approaches did you consider?
- **Gaming context** - Which games/scenarios benefit most?

## AI Model Contributions

### Training Data

If you're contributing training data for our AI models:

- **Data quality** is paramount - accuracy over quantity
- **Diverse scenarios** help improve model generalization  
- **Labeling consistency** following our annotation guidelines
- **Source attribution** for community builds and creator content

### Model Improvements

- **Performance benchmarks** before and after changes
- **A/B testing results** on real user data
- **Computational efficiency** considerations
- **Interpretability** of model decisions

## Creator Program

### Content Creator Contributions

If you're a gaming content creator interested in partnering:

1. **Demonstrated expertise** in supported games
2. **Community engagement** and following
3. **Quality content** with data-driven insights
4. **Collaboration willingness** on build testing and validation

### Revenue Sharing

Our creator program offers:
- **Revenue share** on premium features driven by your content
- **Attribution** for builds and strategies you develop
- **Early access** to new features and games
- **Community recognition** as a verified creator

## Code of Conduct

### Our Pledge

We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences  
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

### Unacceptable Behavior

Examples of unacceptable behavior include:

* Trolling, insulting/derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information without explicit permission
* Other conduct which could reasonably be considered inappropriate in a professional setting

## Getting Started

1. **Fork the repository** and clone it locally
2. **Install dependencies**: `npm install`
3. **Copy environment file**: `cp .env.example .env.local`
4. **Run development server**: `npm run dev`
5. **Make your changes** and test thoroughly
6. **Submit a pull request** with clear description of changes

## Questions?

Don't hesitate to ask questions! You can:

- Open a [GitHub Discussion](https://github.com/yourusername/metaforge-gaming-tools/discussions)
- Join our Discord community
- Email us at contributors@metaforge.tools

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to MetaForge Gaming Tools! 🎮✨