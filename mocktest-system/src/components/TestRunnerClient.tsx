"use client";

import { TestRunner } from "@/components/TestRunner";
import { useAttempts } from "@/hooks/useAttempts";
import { useTests } from "@/hooks/useTests";
import { MockTest } from "@/types";
import Link from "next/link";
import { useMemo } from "react";

type TestRunnerClientProps = {
  testId: string;
  initialTest: MockTest | null;
};

export const TestRunnerClient = ({ testId, initialTest }: TestRunnerClientProps) => {
  const { tests } = useTests();
  const { attempts, addAttempt } = useAttempts();

  const test = useMemo(() => {
    const match = tests.find((item) => item.id === testId);
    return match ?? initialTest;
  }, [initialTest, testId, tests]);

  const lastAttempt = useMemo(
    () => attempts.find((item) => item.testId === testId) ?? null,
    [attempts, testId],
  );

  if (!test) {
    return (
      <div className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-10 text-center text-sm text-zinc-600">
        <p className="text-lg font-semibold text-zinc-900">Test not found</p>
        <p>The mock test might have been deleted from this device.</p>
        <div className="flex justify-center gap-3">
          <Link
            href="/tests"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            Browse tests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase text-zinc-500">Mock Test Session</p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900">{test.title}</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Duration {test.durationMinutes} minutes · {test.sections.length} sections ·{" "}
          {test.sections.reduce((sum, section) => sum + section.questions.length, 0)} questions
        </p>
        <div className="mt-4 grid gap-3 text-xs text-zinc-500 md:grid-cols-3">
          <InfoPill title="Read carefully">
            Answer choices can be reviewed later. Mark questions for review if you are unsure.
          </InfoPill>
          <InfoPill title="Automatic timer">
            The test auto-submits when time elapses. Your progress is tracked locally.
          </InfoPill>
          <InfoPill title="Past attempt">
            {lastAttempt
              ? `Last score ${lastAttempt.score} (${lastAttempt.breakdown.correct} correct).`
              : "No attempt recorded on this device yet."}
          </InfoPill>
        </div>
      </header>

      <TestRunner
        test={test}
        onComplete={(attempt) => {
          addAttempt(attempt);
        }}
      />
    </div>
  );
};

const InfoPill = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl bg-zinc-50 p-4">
    <p className="text-xs font-semibold uppercase text-zinc-500">{title}</p>
    <p className="mt-2 text-sm text-zinc-600">{children}</p>
  </div>
);
