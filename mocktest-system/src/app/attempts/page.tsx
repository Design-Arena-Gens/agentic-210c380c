"use client";

import { AttemptHistory } from "@/components/AttemptHistory";
import { useTests } from "@/hooks/useTests";
import { useAttempts } from "@/hooks/useAttempts";
import Link from "next/link";

const AttemptsPage = () => {
  const { tests } = useTests();
  const { attempts } = useAttempts();

  return (
    <div className="space-y-8">
      <header className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase text-zinc-500">Performance timeline</p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900">Attempt history</h1>
        <p className="mt-2 max-w-3xl text-sm text-zinc-500">
          Track your journey across exams. Each attempt is stored locally, including accuracy,
          completion time, and review links.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link
            href="/tests"
            className="rounded-full border border-zinc-300 px-4 py-2 font-semibold text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-900"
          >
            Practice another test
          </Link>
          <Link
            href="/create"
            className="rounded-full bg-zinc-900 px-4 py-2 font-semibold text-white transition hover:bg-zinc-700"
          >
            Design a custom test
          </Link>
        </div>
      </header>

      <AttemptHistory attempts={attempts} tests={tests} />
    </div>
  );
};

export default AttemptsPage;
