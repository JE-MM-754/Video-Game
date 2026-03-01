import dynamic from "next/dynamic";
import Link from "next/link";

import { helldivers2Builds } from "@/data";

const BuildCalculator = dynamic(() => import("@/components/BuildCalculator"), {
  loading: () => (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center text-sm text-slate-300">
      Loading calculator...
    </div>
  ),
});

export default function Helldivers2CalculatorPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">MetaForge / Helldivers 2 / Calculator</p>
        <h1 className="mt-2 text-3xl font-black text-slate-100 sm:text-4xl">Helldivers 2 Build Calculator</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Select exact mission, enemy faction, and playstyle in any order. MetaForge ranks mission-specific loadouts in real time, including Hive Lord optimization.
        </p>
        <Link
          href="/helldivers2"
          className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-400 hover:text-blue-200"
        >
          Back to Build Browser
        </Link>
      </div>

      <BuildCalculator gameType="helldivers2" builds={helldivers2Builds} />
    </section>
  );
}
