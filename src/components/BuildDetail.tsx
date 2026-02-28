"use client";

import { useEffect, useMemo, useState } from "react";

import type { BL4Build, HD2Build } from "@/lib/types";

type BuildDetailProps = {
  build: HD2Build | BL4Build;
  gameType: "helldivers2" | "borderlands4";
  open: boolean;
  onClose: () => void;
  fromCalculator?: boolean;
};

function isHD2Build(build: HD2Build | BL4Build): build is HD2Build {
  return "loadout" in build;
}

function buildCopyText(build: HD2Build | BL4Build) {
  const header = `${build.name} (${build.patchVersion})`;

  if (isHD2Build(build)) {
    return [
      header,
      `Primary: ${build.loadout.primary}`,
      `Secondary: ${build.loadout.secondary}`,
      `Grenade: ${build.loadout.grenade}`,
      `Stratagems: ${build.loadout.stratagems.join(", ")}`,
      `Armor: ${build.loadout.armor}`,
      build.loadout.cape ? `Cape: ${build.loadout.cape}` : undefined,
      `When to use: ${build.whenToUse.join(" | ")}`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    header,
    `Action Skill: ${build.skillTree.actionSkill}`,
    `Key Skills: ${build.skillTree.keySkills.join(", ")}`,
    `Weapons: ${build.gear.weapons.join(", ")}`,
    `Shield: ${build.gear.shield}`,
    `Grenade Mod: ${build.gear.grenadeMod}`,
    `Class Mod: ${build.gear.classMod}`,
    `Artifact: ${build.gear.artifact}`,
    `When to use: ${build.whenToUse.join(" | ")}`,
  ].join("\n");
}

export default function BuildDetail({ build, gameType, open, onClose, fromCalculator = false }: BuildDetailProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  const copyText = useMemo(() => buildCopyText(build), [build]);

  const onCopyLoadout = async () => {
    const nav = typeof window !== "undefined" ? window.navigator : undefined;

    try {
      if (!nav?.clipboard) return;
      await nav.clipboard.writeText(copyText);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 1600);
    } catch {
      setCopyState("idle");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/90 p-2 sm:p-4" role="dialog" aria-modal="true" aria-label={`${build.name} details`}>
      <div className="max-h-[96vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              {fromCalculator ? "Calculator > Results > Build Detail" : "Build Browser > Build Detail"}
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-100 sm:text-3xl">{build.name}</h2>
            <p className="mt-2 max-w-3xl text-base text-slate-300">{build.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-blue-400"
          >
            Back to Results
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
            <p className="text-xs uppercase text-slate-400">Creator</p>
            <p className="mt-1 text-base font-semibold text-slate-100">
              {build.creator.name}
              {build.creator.verified && <span className="ml-1 text-blue-300">✓</span>}
            </p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
            <p className="text-xs uppercase text-slate-400">Patch</p>
            <p className="mt-1 text-base font-semibold text-slate-100">{build.patchVersion}</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
            <p className="text-xs uppercase text-slate-400">Success Rate</p>
            <p className="mt-1 text-base font-semibold text-slate-100">{build.successRate}%</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
            <p className="text-xs uppercase text-slate-400">Validation</p>
            <p className="mt-1 text-base font-semibold text-slate-100">{build.communityValidation.toLocaleString()}</p>
          </div>
        </div>

        <section className="mt-4 rounded-xl border border-slate-700 bg-slate-950/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Why This Works</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-200">
            {build.whyThisWorks.map((item) => (
              <li key={`${build.id}-why-${item}`}>• {item}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-slate-300">{build.strategicContext}</p>
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Complete Loadout</p>
            {isHD2Build(build) ? (
              <div className="mt-2 space-y-2 text-sm text-slate-200">
                <p><span className="font-semibold">Primary:</span> {build.loadout.primary}</p>
                <p><span className="font-semibold">Secondary:</span> {build.loadout.secondary}</p>
                <p><span className="font-semibold">Grenade:</span> {build.loadout.grenade}</p>
                <p><span className="font-semibold">Stratagems:</span> {build.loadout.stratagems.join(", ")}</p>
                <p><span className="font-semibold">Armor:</span> {build.loadout.armor}</p>
                {build.loadout.cape && <p><span className="font-semibold">Cape:</span> {build.loadout.cape}</p>}
              </div>
            ) : (
              <div className="mt-2 space-y-2 text-sm text-slate-200">
                <p><span className="font-semibold">Action Skill:</span> {build.skillTree.actionSkill}</p>
                <p><span className="font-semibold">Key Skills:</span> {build.skillTree.keySkills.join(", ")}</p>
                <p><span className="font-semibold">Weapons:</span> {build.gear.weapons.join(", ")}</p>
                <p><span className="font-semibold">Shield:</span> {build.gear.shield}</p>
                <p><span className="font-semibold">Grenade Mod:</span> {build.gear.grenadeMod}</p>
                <p><span className="font-semibold">Class Mod:</span> {build.gear.classMod}</p>
                <p><span className="font-semibold">Artifact:</span> {build.gear.artifact}</p>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-slate-700 bg-slate-950/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Tactical Advice</p>
            <p className="mt-2 text-sm font-semibold text-emerald-200">When to use</p>
            <ul className="mt-1 space-y-1 text-sm text-slate-200">
              {build.whenToUse.map((item) => (
                <li key={`${build.id}-use-${item}`}>• {item}</li>
              ))}
            </ul>
            {!!build.whenToAvoid?.length && (
              <>
                <p className="mt-3 text-sm font-semibold text-rose-200">When to avoid</p>
                <ul className="mt-1 space-y-1 text-sm text-slate-200">
                  {build.whenToAvoid.map((item) => (
                    <li key={`${build.id}-avoid-${item}`}>• {item}</li>
                  ))}
                </ul>
              </>
            )}
            {!!build.advancedTactics?.length && (
              <>
                <p className="mt-3 text-sm font-semibold text-blue-200">Advanced tactics</p>
                <ul className="mt-1 space-y-1 text-sm text-slate-200">
                  {build.advancedTactics.map((item) => (
                    <li key={`${build.id}-advanced-${item}`}>• {item}</li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onCopyLoadout}
            className="inline-flex min-h-11 items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            {copyState === "copied" ? "Loadout Copied" : "Copy Loadout"}
          </button>
          <a
            href={build.creator.channelUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-blue-400"
          >
            Creator Channel
          </a>
          {fromCalculator && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-11 items-center rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-blue-400"
            >
              Try Another Build
            </button>
          )}
          <span className="inline-flex min-h-11 items-center rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-slate-300">
            {gameType === "helldivers2" ? "Helldivers 2" : "Borderlands 4"} • {build.metaTier}-Tier
          </span>
        </div>
      </div>
    </div>
  );
}
