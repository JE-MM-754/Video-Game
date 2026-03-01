"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const labelMap: Record<string, string> = {
  helldivers2: "Helldivers 2",
  borderlands4: "Borderlands 4",
  calculator: "Calculator",
};

function toLabel(segment: string) {
  return labelMap[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname?.split("/").filter(Boolean) || [];

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mx-auto w-full max-w-6xl px-4 py-2 sm:px-6 lg:px-8">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <li>
          <Link href="/" className="rounded px-1 py-0.5 hover:text-blue-300">
            Home
          </Link>
        </li>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;

          return (
            <li key={href} className="flex items-center gap-2">
              <span aria-hidden>/</span>
              {isLast ? (
                <span className="font-semibold text-slate-200">{toLabel(segment)}</span>
              ) : (
                <Link href={href} className="rounded px-1 py-0.5 hover:text-blue-300">
                  {toLabel(segment)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
