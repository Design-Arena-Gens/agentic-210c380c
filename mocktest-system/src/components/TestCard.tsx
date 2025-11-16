import { MockTest } from "@/types";
import Link from "next/link";

type TestCardProps = {
  test: MockTest;
};

const difficultyLabels: Record<MockTest["difficulty"], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const TestCard = ({ test }: TestCardProps) => {
  const totalQuestions = test.sections.reduce(
    (sum, section) => sum + section.questions.length,
    0,
  );

  return (
    <article className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-zinc-500">
          <span>{test.category}</span>
          <span className="rounded-full bg-zinc-100 px-2 py-1 font-semibold text-zinc-600">
            {difficultyLabels[test.difficulty]}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-zinc-900">{test.title}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            {test.description}
          </p>
        </div>
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm text-zinc-600">
        <div className="rounded-lg bg-zinc-50 p-3">
          <dt className="text-xs uppercase tracking-wide text-zinc-500">
            Duration
          </dt>
          <dd className="mt-1 font-semibold text-zinc-800">
            {test.durationMinutes} min
          </dd>
        </div>
        <div className="rounded-lg bg-zinc-50 p-3">
          <dt className="text-xs uppercase tracking-wide text-zinc-500">
            Questions
          </dt>
          <dd className="mt-1 font-semibold text-zinc-800">
            {totalQuestions}
          </dd>
        </div>
        <div className="rounded-lg bg-zinc-50 p-3">
          <dt className="text-xs uppercase tracking-wide text-zinc-500">
            Total Marks
          </dt>
          <dd className="mt-1 font-semibold text-zinc-800">
            {test.totalMarks}
          </dd>
        </div>
        <div className="rounded-lg bg-zinc-50 p-3">
          <dt className="text-xs uppercase tracking-wide text-zinc-500">
            Sections
          </dt>
          <dd className="mt-1 font-semibold text-zinc-800">
            {test.sections.length}
          </dd>
        </div>
      </dl>
      <div className="mt-6 flex items-center justify-between">
        <Link
          href={`/tests/${test.id}`}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-900"
        >
          View Details
        </Link>
        <Link
          href={`/tests/${test.id}/take`}
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
        >
          Start Test
        </Link>
      </div>
    </article>
  );
};
