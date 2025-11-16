"use client";

import { calculateScore } from "@/lib/scoring";
import { persistAttempts, loadAttempts } from "@/lib/storage";
import { MockTest, Question, QuestionResponse, TestAttempt } from "@/types";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";

type TestRunnerProps = {
  test: MockTest;
  onComplete?: (attempt: TestAttempt) => void;
};

type TimerState = {
  remainingSeconds: number;
  isExpired: boolean;
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const TestRunner = ({ test, onComplete }: TestRunnerProps) => {
  const [startedAt] = useState(() => new Date().toISOString());
  const [timer, setTimer] = useState<TimerState>({
    remainingSeconds: test.durationMinutes * 60,
    isExpired: false,
  });
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<QuestionResponse[]>(() =>
    test.sections.flatMap((section) =>
      section.questions.map((question) => ({
        questionId: question.id,
        markedForReview: false,
        timeSpentSeconds: 0,
      })),
    ),
  );
  const [attemptSummary, setAttemptSummary] = useState<TestAttempt | null>(null);
  const [, setLastTick] = useState<number | null>(null);

  const questions = useMemo(
    () => test.sections.flatMap((section) => section.questions),
    [test.sections],
  );

  const currentQuestion = useMemo(
    () => test.sections[currentSectionIndex].questions[currentQuestionIndex],
    [test.sections, currentSectionIndex, currentQuestionIndex],
  );

  useEffect(() => {
    if (attemptSummary) {
      return;
    }

    setLastTick(Date.now());

    const interval = window.setInterval(() => {
      setTimer((prev) => {
        if (prev.isExpired) {
          return prev;
        }

        const now = Date.now();
        setLastTick((previous) => {
          if (!previous) {
            return now;
          }
          const diff = Math.round((now - previous) / 1000);
          if (diff > 0) {
            setResponses((current) =>
              current.map((response) =>
                response.questionId === currentQuestion.id
                  ? {
                      ...response,
                      timeSpentSeconds: response.timeSpentSeconds + diff,
                    }
                  : response,
              ),
            );
          }
          return now;
        });

        if (prev.remainingSeconds <= 1) {
          return { remainingSeconds: 0, isExpired: true };
        }

        return {
          remainingSeconds: prev.remainingSeconds - 1,
          isExpired: false,
        };
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [attemptSummary, currentQuestion.id]);

  useEffect(() => {
    if (timer.isExpired && !attemptSummary) {
      submitTest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.isExpired]);

  const updateResponse = useCallback(
    (questionId: string, updater: (response: QuestionResponse) => QuestionResponse) => {
      setResponses((prev) =>
        prev.map((response) =>
          response.questionId === questionId ? updater(response) : response,
        ),
      );
    },
    [],
  );

  const goToQuestion = (sectionIndex: number, questionIndex: number) => {
    setCurrentSectionIndex(sectionIndex);
    setCurrentQuestionIndex(questionIndex);
  };

  const goToNextQuestion = () => {
    const section = test.sections[currentSectionIndex];
    if (currentQuestionIndex < section.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      return;
    }
    if (currentSectionIndex < test.sections.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      return;
    }
    if (currentSectionIndex > 0) {
      const prevSectionIndex = currentSectionIndex - 1;
      setCurrentSectionIndex(prevSectionIndex);
      setCurrentQuestionIndex(test.sections[prevSectionIndex].questions.length - 1);
    }
  };

  const selectChoice = (question: Question, choiceId: string) => {
    updateResponse(question.id, (response) => ({
      ...response,
      choiceId,
    }));
  };

  const toggleMarkForReview = (questionId: string) => {
    updateResponse(questionId, (response) => ({
      ...response,
      markedForReview: !response.markedForReview,
    }));
  };

  const submitTest = useCallback(() => {
    const completedAt = new Date().toISOString();
    const attempt = calculateScore(test, responses, startedAt, completedAt);
    setAttemptSummary(attempt);
    const existing = loadAttempts();
    const updated = [attempt, ...existing];
    persistAttempts(updated);
    onComplete?.(attempt);
  }, [onComplete, responses, startedAt, test]);

  const attemptedCount = responses.filter((response) => response.choiceId).length;
  const markedCount = responses.filter((response) => response.markedForReview).length;

  const progressPercent = Math.round((attemptedCount / questions.length) * 100);

  if (attemptSummary) {
    const accuracy =
      attemptSummary.breakdown.totalQuestions > 0
        ? Math.round(
            (attemptSummary.breakdown.correct / attemptSummary.breakdown.totalQuestions) * 100,
          )
        : 0;
    return (
      <div className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-zinc-500">
              Test Completed
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Performance Summary</h2>
          </div>
          <p className="flex items-center gap-2 text-sm text-zinc-600">
            <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white">
              Score {attemptSummary.score}
            </span>
            Accuracy {accuracy}%
          </p>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryMetric label="Total Questions" value={attemptSummary.breakdown.totalQuestions} />
          <SummaryMetric label="Attempted" value={attemptSummary.breakdown.attempted} />
          <SummaryMetric label="Correct" value={attemptSummary.breakdown.correct} />
          <SummaryMetric label="Incorrect" value={attemptSummary.breakdown.incorrect} />
        </dl>
        <div>
          <h3 className="text-sm font-semibold text-zinc-700">Detailed Feedback</h3>
          <ul className="mt-4 divide-y divide-zinc-200 rounded-xl border border-zinc-200">
            {questions.map((question) => {
              const response = responses.find((item) => item.questionId === question.id);
              const selectedChoice = question.choices.find(
                (choice) => choice.id === response?.choiceId,
              );
              const correctChoice = question.choices.find((choice) => choice.isCorrect);
              const isCorrect = selectedChoice?.id === correctChoice?.id;
              return (
                <li key={question.id} className="space-y-3 bg-white p-4">
                  <p className="text-sm font-semibold text-zinc-900">{question.prompt}</p>
                  <div className="rounded-lg bg-zinc-50 p-3 text-xs text-zinc-500">
                    <p>
                      Your answer:{" "}
                      {selectedChoice ? (
                        <span
                          className={clsx(
                            "font-semibold",
                            isCorrect ? "text-emerald-700" : "text-rose-600",
                          )}
                        >
                          {selectedChoice.label}
                        </span>
                      ) : (
                        "Not answered"
                      )}
                    </p>
                    <p className="mt-1">
                      Correct answer:{" "}
                      <span className="font-semibold text-zinc-900">{correctChoice?.label}</span>
                    </p>
                    {selectedChoice && !isCorrect && selectedChoice.explanation && (
                      <p className="mt-2 text-xs text-zinc-500">
                        Explanation: {selectedChoice.explanation}
                      </p>
                    )}
                    {correctChoice?.explanation && (
                      <p className="mt-2 text-xs text-zinc-500">
                        Why correct: {correctChoice.explanation}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-zinc-500">
              Section {currentSectionIndex + 1} of {test.sections.length}
            </p>
            <h2 className="text-xl font-semibold text-zinc-900">
              {test.sections[currentSectionIndex].title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white">
              Time {formatTime(timer.remainingSeconds)}
            </span>
            <span className="text-xs text-zinc-500">
              Attempted {attemptedCount}/{questions.length}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-semibold text-zinc-800">
              Question {currentQuestionIndex + 1}
            </p>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-500">
              Marks {currentQuestion.marks}
            </span>
          </div>
          <p className="mt-4 text-base text-zinc-700">{currentQuestion.prompt}</p>

          <div className="mt-6 space-y-3">
            {currentQuestion.choices.map((choice) => {
              const isSelected = responses.find(
                (response) =>
                  response.questionId === currentQuestion.id && response.choiceId === choice.id,
              );
              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => selectChoice(currentQuestion, choice.id)}
                  className={clsx(
                    "w-full rounded-lg border px-4 py-3 text-left text-sm transition",
                    isSelected
                      ? "border-zinc-800 bg-zinc-900 text-white"
                      : "border-zinc-200 bg-white hover:border-zinc-400",
                  )}
                >
                  {choice.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => toggleMarkForReview(currentQuestion.id)}
              className={clsx(
                "rounded-md border px-4 py-2 text-xs font-semibold transition",
                responses.find((response) => response.questionId === currentQuestion.id)
                  ?.markedForReview
                  ? "border-amber-400 bg-amber-100 text-amber-700"
                  : "border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900",
              )}
            >
              Mark for Review
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={goToPreviousQuestion}
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-900"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={goToNextQuestion}
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4">
          <div>
            <p className="text-xs font-semibold uppercase text-zinc-500">
              Progress
            </p>
            <p className="mt-1 text-sm text-zinc-600">
              {attemptedCount} answered · {markedCount} marked for review
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-2 w-32 rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-zinc-900 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-zinc-700">
              {progressPercent}%
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={submitTest}
          className="w-full rounded-md bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          Submit Test
        </button>
      </section>

      <aside className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-zinc-700">Question Navigator</h3>
        <div className="grid grid-cols-5 gap-3">
          {test.sections.map((section, sectionIndex) =>
            section.questions.map((question, questionIndex) => {
              const response = responses.find((item) => item.questionId === question.id);
              const isActive =
                sectionIndex === currentSectionIndex &&
                questionIndex === currentQuestionIndex;
              const isAnswered = response?.choiceId;
              const isMarked = response?.markedForReview;

              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => goToQuestion(sectionIndex, questionIndex)}
                  className={clsx(
                    "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition",
                    isActive && "border-zinc-900 text-zinc-900",
                    isAnswered && "bg-emerald-100 border-emerald-500 text-emerald-700",
                    isMarked && "border-amber-400 text-amber-600",
                    !isActive && !isAnswered && !isMarked && "border-zinc-200 text-zinc-500",
                  )}
                >
                  {questionIndex + 1}
                </button>
              );
            }),
          )}
        </div>
      </aside>
    </div>
  );
};

const SummaryMetric = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-xl bg-zinc-50 p-4">
    <dt className="text-xs uppercase tracking-wide text-zinc-500">{label}</dt>
    <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
  </div>
);
