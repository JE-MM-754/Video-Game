"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-slate-950 p-6 text-slate-100">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-500/40 bg-red-950/20 p-8 text-center">
          <h2 className="text-2xl font-black text-red-200">Critical application error</h2>
          <p className="mt-3 text-sm text-red-100/80">{error.message || "Unknown error"}</p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
