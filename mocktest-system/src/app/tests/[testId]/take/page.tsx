import { TestRunnerClient } from "@/components/TestRunnerClient";
import { findMockTest } from "@/data/mockTests";
import type { Metadata } from "next";

type TestRunnerPageProps = {
  params: {
    testId: string;
  };
};

export async function generateMetadata({
  params,
}: TestRunnerPageProps): Promise<Metadata> {
  const { testId } = params;
  const test = findMockTest(testId);
  if (!test) {
    return {
      title: "Start mock test",
      description: "Launch immersive practice exams with MockTest Pro.",
    };
  }

  return {
    title: `Take ${test.title} – MockTest Pro`,
    description: `Simulate the real exam conditions for ${test.title}.`,
  };
}

const TestRunnerPage = async ({ params }: TestRunnerPageProps) => {
  const { testId } = params;
  const initialTest = findMockTest(testId) ?? null;

  return <TestRunnerClient initialTest={initialTest} testId={testId} />;
};

export default TestRunnerPage;
