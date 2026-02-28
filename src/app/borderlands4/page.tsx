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
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/70 to-indigo-950/30 p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">MetaForge / Borderlands 4</p>
        <h1 className="mt-2 text-3xl font-black text-slate-100 sm:text-4xl">Borderlands 4 Build Browser</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Filter Vault Hunter builds by class, build type, and difficulty to find high-value setups for leveling, farming, and boss runs.
        </p>
        <Link
          href="/borderlands4/calculator"
          className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Open Build Calculator
        </Link>
      </div>

      <BuildBrowser gameType="borderlands4" builds={borderlands4Builds} />
    </section>
  );
}
