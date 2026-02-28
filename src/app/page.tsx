import Image from "next/image";
import Link from "next/link";

import GameSelector from "@/components/GameSelector";
import { borderlands4Builds, helldivers2Builds } from "@/data";

const featuredBuilds = [...helldivers2Builds, ...borderlands4Builds]
  .sort((a, b) => b.rating - a.rating || b.views - a.views)
  .slice(0, 4)
  .map((build) => ({
    id: build.id,
    name: build.name,
    rating: build.rating,
    game: "faction" in build ? "Helldivers 2" : "Borderlands 4",
    href: "faction" in build ? `/helldivers2?build=${build.id}` : `/borderlands4?build=${build.id}`,
    creator: build.creator.name,
  }));

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-blue-500/10 sm:p-10">
        <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-500/20 blur-3xl" aria-hidden />
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">Gaming Build Command Center</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight text-slate-100 sm:text-5xl lg:text-6xl">
          Get The Exact Loadout For Your Mission In 30 Seconds
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-200 sm:text-xl">
          MetaForge gives you verified, patch-ready builds with clear tactical guidance so you can launch faster and win more consistently.
        </p>
        <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/60 p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">How It Works</p>
          <p className="mt-2 text-base text-slate-200">1. Select game → 2. Choose mission → 3. Get build → 4. Win</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300 sm:text-sm">
          <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1">Real patch compatibility</span>
          <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1">Mobile-first controls</span>
          <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1">Live recommendation engine</span>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link href="/helldivers2/calculator" className="inline-flex min-h-14 items-center justify-center rounded-lg bg-blue-600 px-4 text-base font-bold text-white hover:bg-blue-500">
            Find My Build
          </Link>
          <Link href="/borderlands4/calculator" className="inline-flex min-h-14 items-center justify-center rounded-lg border border-slate-500 bg-slate-950/70 px-4 text-base font-semibold text-slate-100 hover:border-blue-400 hover:text-blue-200">
            Borderlands 4 Calculator
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
          <Image src="/hd2-badge.svg" alt="Helldivers 2" width={480} height={280} className="h-auto w-full" priority />
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
          <Image src="/bl4-badge.svg" alt="Borderlands 4" width={480} height={280} className="h-auto w-full" priority />
        </div>
      </section>

      <GameSelector />

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-slate-100">Featured Builds</h2>
          <p className="text-xs uppercase tracking-[0.2em] text-blue-300">Top Rated</p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featuredBuilds.map((build) => (
            <Link
              key={build.id}
              href={build.href}
              className="rounded-xl border border-slate-700 bg-slate-950/70 p-4 transition hover:border-blue-400"
            >
              <p className="text-xs uppercase tracking-wide text-blue-300">{build.game}</p>
              <h3 className="mt-1 text-lg font-bold text-slate-100">{build.name}</h3>
              <p className="mt-1 text-xs text-slate-400">by {build.creator}</p>
              <p className="mt-2 text-sm font-semibold text-slate-200">{build.rating.toFixed(1)}★ community rating</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
