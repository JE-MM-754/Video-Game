import dynamic from "next/dynamic";
import Link from "next/link";

import { borderlands4Builds } from "@/data";

const BuildCalculator = dynamic(() => import("@/components/BuildCalculator"), {
  loading: () => (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center text-sm text-slate-300">
      Loading calculator...
    </div>
  ),
});

export default function Borderlands4CalculatorPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/70 to-indigo-950/30 p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">MetaForge / Borderlands 4 / Calculator</p>
        <h1 className="mt-2 text-3xl font-black text-slate-100 sm:text-4xl">Borderlands 4 Build Calculator</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Pick class, objective, difficulty, and style to get ranked recommendations tuned to your Vault Hunter path.
        </p>
        <Link
          href="/borderlands4"
          className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-400 hover:text-blue-200"
        >
          Back to Build Browser
        </Link>
      </div>

      <BuildCalculator gameType="borderlands4" builds={borderlands4Builds} />
    </section>
  );
}
