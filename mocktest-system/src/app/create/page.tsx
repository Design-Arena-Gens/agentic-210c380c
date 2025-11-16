"use client";

import { TestBuilder } from "@/components/TestBuilder";
import { defaultMockTests } from "@/data/mockTests";
import { useTests } from "@/hooks/useTests";
import { MockTest } from "@/types";
import Link from "next/link";
import { TestCard } from "@/components/TestCard";

const CreatePage = () => {
  const { customTests, addTest } = useTests();
  const handleSave = (test: MockTest) => {
    addTest(test);
  };

  return (
    <div className="space-y-10">
      <header className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase text-zinc-500">Mock test designer</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-900">
          Craft bespoke assessments tailored to your syllabus
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-zinc-500">
          Combine sections, control scoring, and capture knowledge areas in seconds. Saved tests
          live securely in this browser, ready whenever you need focused practice.
        </p>
      </header>

      <TestBuilder onSave={handleSave} />

      <section className="space-y-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-zinc-900">Saved custom tests</h2>
          <p className="text-sm text-zinc-500">
            Mock tests stored locally on this device. Launch them instantly from the list below.
          </p>
        </div>
        {customTests.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500">
            Your custom mock tests will appear here after you save them.{" "}
            <Link href="/tests" className="font-semibold text-zinc-900 underline underline-offset-4">
              Browse existing tests
            </Link>{" "}
            to get inspired.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {customTests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-900">Need a head start?</h2>
        <p className="text-sm text-zinc-600">
          Import an existing template, edit it to align with your syllabus, and launch the test in
          minutes.
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {defaultMockTests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CreatePage;
