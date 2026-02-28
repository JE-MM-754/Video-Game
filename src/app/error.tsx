"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-2xl border border-red-500/40 bg-red-950/20 p-8 text-center">
      <h2 className="text-2xl font-black text-red-200">Something went wrong</h2>
      <p className="mt-2 text-sm text-red-100/80">A runtime issue occurred. You can retry safely.</p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
      >
        Try again
      </button>
    </div>
  );
}
