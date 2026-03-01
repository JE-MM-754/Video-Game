import dynamic from "next/dynamic";
import Link from "next/link";

import { borderlands4Builds } from "@/data";

const BuildBrowser = dynamic(() => import("@/components/BuildBrowser"), {
  loading: () => (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center text-sm text-slate-300">
      Loading build browser...
    </div>
  ),
});

export default function Borderlands4Page() {
  const moxsyBuilds = borderlands4Builds.filter((build) => build.creator.name === "Moxsy").slice(0, 4);

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/70 to-indigo-950/30 p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">MetaForge / Borderlands 4</p>
        <h1 className="mt-2 text-3xl font-black text-slate-100 sm:text-4xl">Borderlands 4 Build Browser</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Filter Vault Hunter builds by class, build type, and difficulty to find high-value setups for leveling, farming, and boss runs.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200">
          <span className="rounded-full border border-red-500/40 bg-red-500/20 px-2 py-1">Moxsy Intelligence Pack</span>
          <span className="rounded-full border border-slate-600 bg-slate-900/70 px-2 py-1">VEX Bleed Witch + Curse + No Crit Knife</span>
          <span className="rounded-full border border-slate-600 bg-slate-900/70 px-2 py-1">Rafa UVH6 Sniper + Slash n Dash</span>
          <span className="rounded-full border border-slate-600 bg-slate-900/70 px-2 py-1">Harlowe CHROMA + Radiation</span>
        </div>
        <Link
          href="/borderlands4/calculator"
          className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Open Build Calculator
        </Link>
      </div>

      {moxsyBuilds.length > 0 && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-slate-100">Featured Moxsy Builds</h2>
            <p className="text-xs uppercase tracking-[0.2em] text-red-300">UVH6 Focus</p>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {moxsyBuilds.map((build) => (
              <Link key={build.id} href={`/borderlands4?build=${build.id}`} className="rounded-xl border border-slate-700 bg-slate-950/70 p-3 hover:border-red-400/60">
                <p className="text-sm font-semibold text-slate-100">{build.name}</p>
                <p className="mt-1 text-xs text-slate-400">{build.class.toUpperCase()} • {build.buildType}</p>
                <p className="mt-1 text-xs text-red-200">{build.damageBenchmark ?? "Moxsy-validated"}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <BuildBrowser gameType="borderlands4" builds={borderlands4Builds} />
    </section>
  );
}
