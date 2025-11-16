"use client";

import { TestDetail } from "@/components/TestDetail";
import { useTests } from "@/hooks/useTests";
import { MockTest } from "@/types";
import Link from "next/link";
import { useMemo } from "react";

type TestDetailClientProps = {
  testId: string;
  initialTest: MockTest | null;
};

export const TestDetailClient = ({ testId, initialTest }: TestDetailClientProps) => {
  const { tests } = useTests();
  const test = useMemo(
    () => tests.find((item) => item.id === testId) ?? initialTest,
    [initialTest, testId, tests],
  );

  if (!test) {
    return (
      <div className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-10 text-center text-sm text-zinc-600">
        <p className="text-lg font-semibold text-zinc-900">Test not found</p>
        <p>
          The mock test you are trying to access does not exist. It may have been removed from this
          device&apos;s local storage.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/tests"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            View available tests
          </Link>
          <Link
            href="/create"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-900"
          >
            Create a new test
          </Link>
        </div>
      </div>
    );
  }

  return <TestDetail test={test} />;
};
