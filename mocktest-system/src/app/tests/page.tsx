"use client";

import { AttemptHistory } from "@/components/AttemptHistory";
import { TestCard } from "@/components/TestCard";
import { FiltersState, TestFilters } from "@/components/TestFilters";
import { useAttempts } from "@/hooks/useAttempts";
import { useTests } from "@/hooks/useTests";
import { MockTest } from "@/types";
import { useMemo, useState } from "react";

const TestsPage = () => {
  const { tests } = useTests();
  const { attempts } = useAttempts();
  const [filters, setFilters] = useState<FiltersState>({
    search: "",
    difficulty: "all",
    category: "all",
  });

  const filtered = useMemo(() => applyFilters(tests, filters), [tests, filters]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-zinc-500">
            Explore the library
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
            All Mock Tests
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Browse expertly curated assessments or bring your own. Start with a test,
            simulate real exam conditions, and track performance over time.
          </p>
        </div>
        <div className="rounded-xl bg-zinc-50 p-4 text-sm text-zinc-600">
          <p>
            Attempted <span className="font-semibold text-zinc-900">{attempts.length}</span>{" "}
            assessments on this device
          </p>
        </div>
      </header>

      <TestFilters tests={tests} filters={filters} onFiltersChange={setFilters} />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((test) => (
          <TestCard key={test.id} test={test} />
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-zinc-900">Latest Attempts</h2>
        <AttemptHistory attempts={attempts} tests={tests} />
      </section>
    </div>
  );
};

export default TestsPage;

const applyFilters = (tests: MockTest[], filters: FiltersState) => {
  const { search, difficulty, category } = filters;
  return tests.filter((test) => {
    const matchesSearch =
      search.length === 0 ||
      test.title.toLowerCase().includes(search.toLowerCase()) ||
      test.description.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = difficulty === "all" || test.difficulty === difficulty;
    const matchesCategory = category === "all" || test.category === category;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });
};
