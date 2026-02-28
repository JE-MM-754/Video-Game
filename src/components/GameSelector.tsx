import Link from "next/link";

import type { GameInfo } from "@/lib/types";

const games: (GameInfo & { calculatorHref: string })[] = [
  {
    slug: "helldivers2",
    title: "Helldivers 2",
    subtitle: "Galactic Stratagem Builds",
    description:
      "Optimize stratagem loops, anti-armor tools, and role loadouts for high-threat operations.",
    href: "/helldivers2",
    calculatorHref: "/helldivers2/calculator",
    colorClass: "from-blue-500/30 via-cyan-400/10 to-slate-900",
  },
  {
    slug: "borderlands4",
    title: "Borderlands 4",
    subtitle: "Vault Hunter Theorycrafting",
    description:
      "Dial in skill trees, gear synergies, and difficulty-ready class setups for every run type.",
    href: "/borderlands4",
    calculatorHref: "/borderlands4/calculator",
    colorClass: "from-indigo-500/30 via-blue-400/10 to-slate-900",
  },
];

export default function GameSelector() {
  return (
    <section aria-label="Game selection" className="grid gap-5 sm:grid-cols-2">
      {games.map((game) => (
        <article
          key={game.slug}
          className={`group relative overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-br ${game.colorClass} p-6 shadow-[0_0_40px_-20px_rgba(59,130,246,0.6)] transition duration-200 hover:border-blue-400 hover:shadow-[0_0_50px_-16px_rgba(59,130,246,0.8)]`}
        >
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-400/20 blur-2xl" aria-hidden />
          <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">{game.subtitle}</p>
          <h2 className="relative mt-2 text-3xl font-black text-slate-100">{game.title}</h2>
          <p className="relative mt-4 text-sm leading-6 text-slate-300">{game.description}</p>
          <div className="relative mt-6 flex gap-2">
            <Link
              href={game.href}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
            >
              Open Builds
            </Link>
            <Link
              href={game.calculatorHref}
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-500 bg-slate-900/70 px-4 py-3 text-sm font-bold text-slate-100 transition hover:border-blue-400 hover:text-blue-200"
            >
              Quick Calculator
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}
