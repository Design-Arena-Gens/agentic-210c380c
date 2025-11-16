import { MockTest, TestAttempt } from "@/types";
import Link from "next/link";
import { formatDistanceToNow, parseISO } from "date-fns";

type AttemptHistoryProps = {
  tests: MockTest[];
  attempts: TestAttempt[];
};

const findTestTitle = (tests: MockTest[], testId: string) =>
  tests.find((test) => test.id === testId)?.title ?? "Unknown Test";

export const AttemptHistory = ({ tests, attempts }: AttemptHistoryProps) => {
  if (attempts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500">
        Once you finish a mock test, your performance summary will appear here.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200">
      <table className="min-w-full divide-y divide-zinc-200 text-sm">
        <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
          <tr>
            <th scope="col" className="px-4 py-3 text-left">
              Test
            </th>
            <th scope="col" className="px-4 py-3 text-left">
              Score
            </th>
            <th scope="col" className="px-4 py-3 text-left">
              Accuracy
            </th>
            <th scope="col" className="px-4 py-3 text-left">
              Duration
            </th>
            <th scope="col" className="px-4 py-3 text-left">
              Completed
            </th>
            <th scope="col" className="px-4 py-3 text-left">
              Review
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 bg-white text-zinc-700">
          {attempts.map((attempt) => {
            const accuracy =
              attempt.breakdown.totalQuestions > 0
                ? Math.round((attempt.breakdown.correct / attempt.breakdown.totalQuestions) * 100)
                : 0;
            return (
              <tr key={`${attempt.testId}-${attempt.startedAt}`}>
                <td className="px-4 py-3 font-semibold text-zinc-900">
                  {findTestTitle(tests, attempt.testId)}
                </td>
                <td className="px-4 py-3">{attempt.score}</td>
                <td className="px-4 py-3">{accuracy}%</td>
                <td className="px-4 py-3">
                  {Math.round(attempt.durationSeconds / 60)} mins
                </td>
                <td className="px-4 py-3">
                  {formatDistanceToNow(parseISO(attempt.completedAt ?? attempt.startedAt), {
                    addSuffix: true,
                  })}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/tests/${attempt.testId}`}
                    className="text-sm font-semibold text-zinc-900 underline underline-offset-4"
                  >
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
