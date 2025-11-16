import { MockTest } from "@/types";
import Link from "next/link";

type TestDetailProps = {
  test: MockTest;
};

const difficultyColors: Record<MockTest["difficulty"], string> = {
  beginner: "bg-emerald-100 text-emerald-800",
  intermediate: "bg-amber-100 text-amber-800",
  advanced: "bg-rose-100 text-rose-800",
};

export const TestDetail = ({ test }: TestDetailProps) => {
  const totalQuestions = test.sections.reduce(
    (sum, section) => sum + section.questions.length,
    0,
  );

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${difficultyColors[test.difficulty]}`}
            >
              {test.difficulty.toUpperCase()}
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-zinc-900">
              {test.title}
            </h1>
            <p className="mt-3 max-w-3xl text-base text-zinc-600">
              {test.description}
            </p>
          </div>
          <Link
            href={`/tests/${test.id}/take`}
            className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            Start Mock Test
          </Link>
        </div>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryItem label="Category" value={test.category} />
          <SummaryItem label="Duration" value={`${test.durationMinutes} mins`} />
          <SummaryItem label="Questions" value={`${totalQuestions}`} />
          <SummaryItem label="Total Marks" value={`${test.totalMarks}`} />
        </dl>
        {test.recommendedPrep && test.recommendedPrep.length > 0 && (
          <div className="mt-6 rounded-xl bg-zinc-50 p-4">
            <p className="text-sm font-semibold text-zinc-700">
              Recommended Preparation
            </p>
            <ul className="mt-3 grid gap-2 text-sm text-zinc-600">
              {test.recommendedPrep.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-zinc-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-zinc-900">Test Structure</h2>
        <div className="space-y-6">
          {test.sections.map((section) => (
            <article
              key={section.id}
              className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {section.title}
                  </h3>
                  {section.description && (
                    <p className="mt-1 text-sm text-zinc-600">
                      {section.description}
                    </p>
                  )}
                </div>
                <dl className="grid grid-cols-2 gap-3 text-xs text-zinc-500 sm:text-right">
                  <div>
                    <dt>Questions</dt>
                    <dd className="text-sm font-semibold text-zinc-800">
                      {section.questions.length}
                    </dd>
                  </div>
                  <div>
                    <dt>Marks</dt>
                    <dd className="text-sm font-semibold text-zinc-800">
                      {section.questions.reduce((sum, question) => sum + question.marks, 0)}
                    </dd>
                  </div>
                </dl>
              </div>
              <ul className="mt-4 divide-y divide-zinc-100 rounded-lg border border-zinc-200 bg-zinc-50">
                {section.questions.map((question) => (
                  <li key={question.id} className="p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-zinc-800">
                          {question.prompt}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-wide text-zinc-500">
                          Difficulty: {question.difficulty.toUpperCase()} · Marks:{" "}
                          {question.marks}
                          {question.negativeMarks
                            ? ` · Negative: ${question.negativeMarks}`
                            : ""}
                        </p>
                      </div>
                      {question.tags && question.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                          {question.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white px-3 py-1 font-medium text-zinc-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

const SummaryItem = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-zinc-50 p-4">
    <dt className="text-xs uppercase tracking-wide text-zinc-500">{label}</dt>
    <dd className="mt-2 text-lg font-semibold text-zinc-900">{value}</dd>
  </div>
);
