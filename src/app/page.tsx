import Image from "next/image";
import Link from "next/link";

import { borderlands4Builds, helldivers2Builds } from "@/data";

const creatorHighlights = [
  {
    name: "OhDough",
    badge: "OhDough Optimized",
    description: "Hyper-competitive min-max builds for high-pressure missions.",
    color: "border-purple-500/40 bg-purple-500/20 text-purple-200",
  },
  {
    name: "Sovereign Gene",
    badge: "Tier List Validated",
    description: "Systematic ranking methodology and consistent loadout performance.",
    color: "border-blue-500/40 bg-blue-500/20 text-blue-200",
  },
  {
    name: "Claysthetics",
    badge: "🎯 Community Tested",
    description: "Accessibility-first, resource-sustainable builds for full mission completion.",
    color: "border-emerald-500/40 bg-emerald-500/20 text-emerald-200",
  },
  {
    name: "BuzzLiteBeer",
    badge: "Meta Analysis",
    description: "Patch-driven tactical analysis and emergent strategy tracking.",
    color: "border-orange-500/40 bg-orange-500/20 text-orange-200",
  },
];

const featuredBuilds = helldivers2Builds
  .filter((build) => build.category === "hive-lord-specialist")
  .sort((a, b) => (b.effectiveness?.hivelord ?? 0) - (a.effectiveness?.hivelord ?? 0))
  .slice(0, 4);

const platformMetrics = {
  totalBuilds: helldivers2Builds.length + borderlands4Builds.length,
  avgSuccess:
    Math.round(
      [...helldivers2Builds, ...borderlands4Builds].reduce((sum, build) => sum + build.successRate, 0) /
        (helldivers2Builds.length + borderlands4Builds.length),
    ) || 0,
  validatedRuns: helldivers2Builds.reduce((sum, build) => sum + (build.communityValidation ?? 0), 0),
};

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-10">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" aria-hidden />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">MetaForge Gaming Build Optimization Platform</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight text-slate-100 sm:text-5xl lg:text-6xl">
          Master Every Mission With Creator-Validated Builds
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-200">
          AI-powered build recommendations for Helldivers 2 and Borderlands 4. Get exact loadouts, boss-fight strategy guides,
          and community-tested creator intelligence in seconds.
        </p>

        <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950/70 p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Fast Flow</p>
          <p className="mt-1 text-base text-slate-200">1. Select game → 2. Choose mission → 3. Get build → 4. Win</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Link
            href="/helldivers2/calculator"
            className="inline-flex min-h-14 items-center justify-center rounded-lg bg-blue-600 px-4 text-base font-bold text-white transition hover:bg-blue-500"
          >
            Find My Build
          </Link>
          <Link
            href="/helldivers2"
            className="inline-flex min-h-14 items-center justify-center rounded-lg border border-slate-500 bg-slate-950/70 px-4 text-base font-semibold text-slate-100 transition hover:border-blue-400 hover:text-blue-200"
          >
            Browse Builds
          </Link>
          <Link
            href="/borderlands4/calculator"
            className="inline-flex min-h-14 items-center justify-center rounded-lg border border-slate-500 bg-slate-950/70 px-4 text-base font-semibold text-slate-100 transition hover:border-blue-400 hover:text-blue-200"
          >
            Try Calculator
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-300">Total Builds</p>
          <p className="mt-2 text-3xl font-black text-slate-100">{platformMetrics.totalBuilds}</p>
          <p className="mt-1 text-sm text-slate-300">Cross-game optimized loadouts</p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-300">Average Success</p>
          <p className="mt-2 text-3xl font-black text-slate-100">{platformMetrics.avgSuccess}%</p>
          <p className="mt-1 text-sm text-slate-300">Community-validated outcomes</p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-300">Validation Runs</p>
          <p className="mt-2 text-3xl font-black text-slate-100">{platformMetrics.validatedRuns.toLocaleString()}</p>
          <p className="mt-1 text-sm text-slate-300">Real testing and feedback cycles</p>
        </article>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link href="/helldivers2" className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 transition hover:border-blue-500/60">
          <Image src="/hd2-badge.svg" alt="Helldivers 2" width={640} height={320} className="h-auto w-full" priority />
        </Link>
        <Link href="/borderlands4" className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 transition hover:border-blue-500/60">
          <Image src="/bl4-badge.svg" alt="Borderlands 4" width={640} height={320} className="h-auto w-full" priority />
        </Link>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-slate-100">Creator Intelligence Network</h2>
          <p className="text-xs uppercase tracking-[0.2em] text-blue-300">Validated Sources</p>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {creatorHighlights.map((creator) => (
            <article key={creator.name} className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-slate-100">{creator.name}</h3>
                <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${creator.color}`}>{creator.badge}</span>
              </div>
              <p className="mt-2 text-sm text-slate-300">{creator.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-slate-100">Hive Lord Specialist Builds</h2>
          <Link href="/helldivers2/calculator?bossMode=1&boss=hive-lord" className="text-sm font-semibold text-blue-300 hover:text-blue-200">
            Open Boss Fight Mode
          </Link>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {featuredBuilds.map((build) => (
            <Link
              key={build.id}
              href={`/helldivers2?build=${build.id}`}
              className="rounded-xl border border-slate-700 bg-slate-950/70 p-4 transition hover:border-blue-400"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-slate-100">{build.name}</h3>
                <span className="rounded-full border border-amber-300/40 bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-200">
                  {build.metaTier}-Tier
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-300">{build.description}</p>
              <p className="mt-2 text-xs text-slate-400">
                {build.creator.name} • Hive Lord effectiveness {build.effectiveness?.hivelord ?? "N/A"}%
              </p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-center text-sm text-slate-300">
        <p className="font-semibold text-slate-100">MetaForge Gaming Tools</p>
        <p className="mt-1">Build optimization platform for Helldivers 2, Borderlands 4, and future game metas.</p>
      </footer>
    </div>
  );
}
