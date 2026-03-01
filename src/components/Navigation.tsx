"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { borderlands4Builds, helldivers2Builds } from "@/data";

type SearchItem = {
  id: string;
  name: string;
  creator: string;
  href: string;
  gameLabel: string;
};

const gameMenus = [
  {
    base: "/helldivers2",
    label: "Helldivers 2",
    items: [
      { href: "/helldivers2", label: "Builds" },
      { href: "/helldivers2/calculator", label: "Calculator" },
    ],
  },
  {
    base: "/borderlands4",
    label: "Borderlands 4",
    items: [
      { href: "/borderlands4", label: "Builds" },
      { href: "/borderlands4/calculator", label: "Calculator" },
    ],
  },
];

const searchIndex: SearchItem[] = [
  ...helldivers2Builds.map((build) => ({
    id: build.id,
    name: build.name,
    creator: build.creator.name,
    href: `/helldivers2?build=${build.id}`,
    gameLabel: "Helldivers 2",
  })),
  ...borderlands4Builds.map((build) => ({
    id: build.id,
    name: build.name,
    creator: build.creator.name,
    href: `/borderlands4?build=${build.id}`,
    gameLabel: "Borderlands 4",
  })),
];

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];

    return searchIndex
      .filter((item) => item.name.toLowerCase().includes(term) || item.creator.toLowerCase().includes(term))
      .slice(0, 6);
  }, [query]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/90 bg-slate-950/95 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8" aria-label="Primary">
        <Link href="/" className="shrink-0 text-xl font-black tracking-wide text-blue-300 sm:text-2xl">
          MetaForge
        </Link>

        <div className="relative hidden flex-1 md:block">
          <label htmlFor="global-build-search" className="sr-only">
            Search builds globally
          </label>
          <input
            id="global-build-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search any build or creator"
            className="min-h-11 w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 text-sm text-slate-100 outline-none ring-blue-400 transition focus:ring-2"
          />
          {results.length > 0 && (
            <ul className="absolute top-12 z-50 w-full rounded-xl border border-slate-700 bg-slate-950 p-2 shadow-xl" role="listbox">
              {results.map((result) => (
                <li key={result.id}>
                  <Link
                    href={result.href}
                    onClick={() => setQuery("")}
                    className="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
                  >
                    <span className="font-semibold text-slate-100">{result.name}</span>
                    <span className="ml-2 text-xs text-slate-400">{result.gameLabel}</span>
                    <p className="text-xs text-slate-500">by {result.creator}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-100 transition hover:border-blue-500 md:hidden"
        >
          <span className="text-lg">☰</span>
        </button>

        <ul className="hidden items-center gap-2 md:flex">
          <li>
            <Link
              href="/"
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                pathname === "/" ? "bg-blue-600 text-white" : "text-slate-200 hover:bg-slate-800 hover:text-blue-300"
              }`}
            >
              Home
            </Link>
          </li>
          {gameMenus.map((menu) => {
            const active = pathname === menu.base || pathname?.startsWith(`${menu.base}/`);
            return (
              <li key={menu.base} className="group relative">
                <button
                  aria-haspopup="menu"
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    active ? "bg-blue-600 text-white" : "text-slate-200 hover:bg-slate-800 hover:text-blue-300"
                  }`}
                >
                  {menu.label}
                </button>
                <ul className="invisible absolute right-0 top-11 z-50 min-w-40 rounded-xl border border-slate-700 bg-slate-950 p-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  {menu.items.map((item) => {
                    const itemActive = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`block rounded-lg px-3 py-2 text-sm transition ${
                            itemActive
                              ? "bg-blue-600 text-white"
                              : "text-slate-200 hover:bg-slate-800 hover:text-blue-300"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </nav>

      {open && (
        <div className="border-t border-slate-800 bg-slate-950 px-4 py-3 md:hidden">
          <label htmlFor="global-build-search-mobile" className="sr-only">
            Search builds globally
          </label>
          <input
            id="global-build-search-mobile"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search any build or creator"
            className="mb-3 min-h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm text-slate-100 outline-none ring-blue-400 transition focus:ring-2"
          />
          {results.length > 0 && (
            <ul className="mb-3 rounded-xl border border-slate-700 bg-slate-900 p-2">
              {results.map((result) => (
                <li key={`mobile-${result.id}`}>
                  <Link
                    href={result.href}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
                  >
                    <span className="font-semibold text-slate-100">{result.name}</span>
                    <span className="ml-2 text-xs text-slate-400">{result.gameLabel}</span>
                    <p className="text-xs text-slate-500">by {result.creator}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <ul className="grid gap-2">
            <li>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  pathname === "/"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-blue-300"
                }`}
              >
                Home
              </Link>
            </li>
            {gameMenus.map((menu) => (
              <li key={`mobile-${menu.base}`} className="rounded-lg border border-slate-800 p-2">
                <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{menu.label}</p>
                {menu.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`mb-1 block rounded-lg px-3 py-2 text-sm font-semibold transition ${
                        active
                          ? "bg-blue-600 text-white"
                          : "bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-blue-300"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
