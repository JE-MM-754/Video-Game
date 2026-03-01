import dynamic from "next/dynamic";
import Link from "next/link";

import { helldivers2Builds } from "@/data";

const BuildBrowser = dynamic(() => import("@/components/BuildBrowser"), {
  loading: () => (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center text-sm text-slate-300">
      Loading build browser...
    </div>
  ),
});

export default function Helldivers2Page() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">MetaForge / Helldivers 2</p>
        <h1 className="mt-2 text-3xl font-black text-slate-100 sm:text-4xl">Helldivers 2 Build Browser</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Browse live-rated loadouts by faction, mission, and difficulty. Built for quick in-session decisions and squad coordination.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200">
          <span className="rounded-full border border-purple-500/40 bg-purple-500/20 px-2 py-1">OhDough Optimized</span>
          <span className="rounded-full border border-blue-500/40 bg-blue-500/20 px-2 py-1">Sovereign Gene Validated</span>
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2 py-1">🎯 Claysthetics Community Tested</span>
          <span className="rounded-full border border-orange-500/40 bg-orange-500/20 px-2 py-1">BuzzLiteBeer Meta Analysis</span>
        </div>
        <Link
          href="/helldivers2/calculator"
          className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Open Build Calculator (Boss Fight Mode)
        </Link>
      </div>

      <BuildBrowser gameType="helldivers2" builds={helldivers2Builds} />
    </section>
  );
}
