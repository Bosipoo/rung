import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-3 px-4 py-8 text-center sm:px-5">
      <p className="font-mono text-xs uppercase text-dim">404</p>
      <h1 className="font-heading text-2xl font-bold">Page not found</h1>
      <p className="text-muted">That page doesn&apos;t exist.</p>
      <Link
        href="/"
        className="mt-2 rounded-xl bg-cyan px-4 py-2.5 text-sm font-semibold text-background"
      >
        Back to today →
      </Link>
    </main>
  );
}
