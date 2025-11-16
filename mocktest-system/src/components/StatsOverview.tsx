import { MockTest, TestAttempt } from "@/types";

type StatsOverviewProps = {
  tests: MockTest[];
  attempts: TestAttempt[];
};

export const StatsOverview = ({ tests, attempts }: StatsOverviewProps) => {
  const totalQuestions = tests.reduce(
    (sum, test) =>
      sum + test.sections.reduce((sectionSum, section) => sectionSum + section.questions.length, 0),
    0,
  );

  const averageScore =
    attempts.length > 0
      ? Math.round(
          (attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length +
            Number.EPSILON) *
            10,
        ) / 10
      : 0;

  const averageAccuracy =
    attempts.length > 0
      ? Math.round(
          (attempts.reduce((sum, attempt) => {
            const total = attempt.breakdown.totalQuestions || 1;
            return sum + (attempt.breakdown.correct / total) * 100;
          }, 0) /
            attempts.length +
            Number.EPSILON) *
            10,
        ) / 10
      : 0;

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Available Mock Tests" value={tests.length} subtext="Curated by experts" />
      <StatCard title="Questions Covered" value={totalQuestions} subtext="Across all sections" />
      <StatCard title="Attempts Logged" value={attempts.length} subtext="Stored locally" />
      <StatCard title="Avg. Score" value={`${averageScore}`} subtext={`Accuracy ${averageAccuracy}%`} />
    </section>
  );
};

type StatCardProps = {
  title: string;
  value: string | number;
  subtext: string;
};

const StatCard = ({ title, value, subtext }: StatCardProps) => (
  <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
    <p className="text-xs font-medium uppercase text-zinc-500">{title}</p>
    <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">{value}</p>
    <p className="mt-1 text-sm text-zinc-500">{subtext}</p>
  </div>
);
