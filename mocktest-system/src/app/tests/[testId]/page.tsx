import { TestDetailClient } from "@/components/TestDetailClient";
import { findMockTest } from "@/data/mockTests";
import type { Metadata } from "next";

type TestDetailPageProps = {
  params: {
    testId: string;
  };
};

export async function generateMetadata({
  params,
}: TestDetailPageProps): Promise<Metadata> {
  const { testId } = params;
  const test = findMockTest(testId);
  if (!test) {
    return {
      title: "Mock test not found",
      description: "The mock test you are looking for does not exist.",
    };
  }

  return {
    title: `${test.title} – MockTest Pro`,
    description: test.description,
  };
}

const TestDetailPage = async ({ params }: TestDetailPageProps) => {
  const { testId } = params;
  const initialTest = findMockTest(testId) ?? null;

  return <TestDetailClient initialTest={initialTest} testId={testId} />;
};

export default TestDetailPage;
