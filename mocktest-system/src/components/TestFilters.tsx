"use client";

import { MockTest } from "@/types";
import { useMemo } from "react";

export type FiltersState = {
  search: string;
  difficulty: MockTest["difficulty"] | "all";
  category: string;
};

type TestFiltersProps = {
  tests: MockTest[];
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
};

export const TestFilters = ({ tests, filters, onFiltersChange }: TestFiltersProps) => {
  const categories = useMemo(() => {
    const set = new Set<string>();
    tests.forEach((test) => set.add(test.category));
    return ["all", ...Array.from(set)];
  }, [tests]);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 md:flex-row md:items-end">
      <label className="flex flex-1 flex-col gap-2 text-sm">
        <span className="font-medium text-zinc-700">Search</span>
        <input
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
          placeholder="Search by title, description or tags"
          value={filters.search}
          onChange={(event) =>
            onFiltersChange({
              ...filters,
              search: event.target.value,
            })
          }
        />
      </label>
      <label className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-zinc-700">Difficulty</span>
        <select
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
          value={filters.difficulty}
          onChange={(event) =>
            onFiltersChange({
              ...filters,
              difficulty: event.target.value as MockTest["difficulty"] | "all",
            })
          }
        >
          <option value="all">All</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </label>
      <label className="flex flex-col gap-2 text-sm">
        <span className="font-medium text-zinc-700">Category</span>
        <select
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
          value={filters.category}
          onChange={(event) =>
            onFiltersChange({
              ...filters,
              category: event.target.value,
            })
          }
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "All categories" : item}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};
