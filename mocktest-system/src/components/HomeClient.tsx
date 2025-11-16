"use client";

import { useAttempts } from "@/hooks/useAttempts";
import { useTests } from "@/hooks/useTests";
import { MockTest } from "@/types";
import { useMemo, useState } from "react";
import { AttemptHistory } from "./AttemptHistory";
import { StatsOverview } from "./StatsOverview";
import { TestCard } from "./TestCard";
import { FiltersState, TestFilters } from "./TestFilters";
import Link from "next/link";

export const HomeClient = () => {
  const { tests } = useTests();
  const { attempts } = useAttempts();
  const [filters, setFilters] = useState<FiltersState>({
    search: "",
    difficulty: "all",
    category: "all",
  });

  const filtered = useMemo(() => applyFilters(tests, filters), [tests, filters]);
  const featured = useMemo(() => filtered.slice(0, 6), [filtered]);

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-10 text-white shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Adaptive Learning Platform
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight lg:text-4xl">
              Master Every Exam with MockTest Pro
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-zinc-300">
              Discover curated mock examinations, simulate real world environments, and track
              performance over time. Build custom tests, monitor progress, and identify knowledge
              gaps—everything in one streamlined workspace.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link
                href="/tests"
                className="rounded-full bg-white px-5 py-2 font-semibold text-zinc-900 transition hover:bg-zinc-200"
              >
                Explore Tests
              </Link>
              <Link
                href="/create"
                className="rounded-full border border-white px-5 py-2 font-semibold text-white transition hover:bg-white/10"
              >
                Build Your Own
              </Link>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="rounded-2xl bg-white/5 p-6 text-sm shadow-lg backdrop-blur">
              <p className="text-xs uppercase text-zinc-400">Instant Feedback</p>
              <p className="mt-3 text-2xl font-semibold">Detailed analytics with every attempt</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-6 text-sm shadow-lg backdrop-blur">
              <p className="text-xs uppercase text-zinc-400">Time Tracking</p>
              <p className="mt-3 text-2xl font-semibold">
                Simulate exam stress with adaptive timers
              </p>
            </div>
          </div>
        </div>
      </section>

      <StatsOverview tests={tests} attempts={attempts} />

      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">Available Mock Tests</h2>
            <p className="text-sm text-zinc-500">
              Filter by difficulty, domain, or search for a specific challenge.
            </p>
          </div>
          <Link
            href="/create"
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-900"
          >
            Create custom test
          </Link>
        </div>
        <TestFilters tests={tests} filters={filters} onFiltersChange={setFilters} />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-zinc-900">Attempt History</h2>
          <p className="text-sm text-zinc-500">
            Every time you complete a mock test, your score and insights are saved locally on this
            device.
          </p>
        </div>
        <AttemptHistory tests={tests} attempts={attempts} />
      </section>
    </div>
  );
};

const applyFilters = (tests: MockTest[], filters: FiltersState) => {
  const { search, difficulty, category } = filters;
  return tests.filter((test) => {
    const matchesSearch =
      search.length === 0 ||
      test.title.toLowerCase().includes(search.toLowerCase()) ||
      test.description.toLowerCase().includes(search.toLowerCase()) ||
      test.sections.some((section) =>
        section.questions.some((question) =>
          question.tags?.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
        ),
      );

    const matchesDifficulty = difficulty === "all" || test.difficulty === difficulty;
    const matchesCategory = category === "all" || test.category === category;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });
};
