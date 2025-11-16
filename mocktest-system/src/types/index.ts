export type Choice = {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation?: string;
};

export type Question = {
  id: string;
  prompt: string;
  choices: Choice[];
  difficulty: "easy" | "medium" | "hard";
  marks: number;
  negativeMarks?: number;
  tags?: string[];
};

export type Section = {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
};

export type MockTest = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  sections: Section[];
  recommendedPrep?: string[];
};

export type QuestionResponse = {
  questionId: string;
  choiceId?: string;
  markedForReview?: boolean;
  timeSpentSeconds: number;
};

export type TestAttempt = {
  testId: string;
  startedAt: string;
  completedAt?: string;
  durationSeconds: number;
  responses: QuestionResponse[];
  score: number;
  breakdown: {
    totalQuestions: number;
    attempted: number;
    correct: number;
    incorrect: number;
    unattempted: number;
  };
};
