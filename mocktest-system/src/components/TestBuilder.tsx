"use client";

import { MockTest, Question } from "@/types";
import { useMemo, useState } from "react";

const uuid = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 11);
};

type TestBuilderProps = {
  onSave: (test: MockTest) => void;
};

const defaultQuestion = (): Question => ({
  id: uuid(),
  prompt: "",
  difficulty: "easy",
  marks: 1,
  negativeMarks: 0,
  choices: [
    { id: uuid(), label: "", isCorrect: true },
    { id: uuid(), label: "", isCorrect: false },
  ],
  tags: [],
});

export const TestBuilder = ({ onSave }: TestBuilderProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Practice");
  const [difficulty, setDifficulty] = useState<MockTest["difficulty"]>("beginner");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [sections, setSections] = useState([
    {
      id: uuid(),
      title: "Section 1",
      description: "",
      questions: [defaultQuestion()],
    },
  ]);

  const totalMarks = useMemo(
    () => sections.reduce((sum, section) => sum + section.questions.reduce((qSum, q) => qSum + q.marks, 0), 0),
    [sections],
  );

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("Practice");
    setDifficulty("beginner");
    setDurationMinutes(60);
    setSections([
      {
        id: uuid(),
        title: "Section 1",
        description: "",
        questions: [defaultQuestion()],
      },
    ]);
  };

  const saveTest = () => {
    const payload: MockTest = {
      id: title.trim().toLowerCase().replace(/\s+/g, "-") || uuid(),
      title: title.trim(),
      description: description.trim(),
      durationMinutes,
      totalMarks,
      category,
      difficulty,
      sections: sections.map((section) => ({
        ...section,
        questions: section.questions.map((question) => ({
          ...question,
          choices: question.choices.map((choice) => ({
            ...choice,
            label: choice.label.trim(),
          })),
        })),
      })),
    };

    onSave(payload);
    resetForm();
  };

  const updateSectionTitle = (sectionId: string, nextTitle: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              title: nextTitle,
            }
          : section,
      ),
    );
  };

  const updateSectionDescription = (sectionId: string, nextDescription: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              description: nextDescription,
            }
          : section,
      ),
    );
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        id: uuid(),
        title: `Section ${prev.length + 1}`,
        description: "",
        questions: [defaultQuestion()],
      },
    ]);
  };

  const removeSection = (sectionId: string) => {
    if (sections.length === 1) {
      return;
    }
    setSections((prev) => prev.filter((section) => section.id !== sectionId));
  };

  const addQuestion = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: [...section.questions, defaultQuestion()],
            }
          : section,
      ),
    );
  };

  const updateQuestion = (
    sectionId: string,
    questionId: string,
    updater: (question: Question) => Question,
  ) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((question) =>
                question.id === questionId ? updater(question) : question,
              ),
            }
          : section,
      ),
    );
  };

  const removeQuestion = (sectionId: string, questionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions:
                section.questions.length === 1
                  ? section.questions
                  : section.questions.filter((question) => question.id !== questionId),
            }
          : section,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">General Information</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-zinc-700">Title</span>
            <input
              className="rounded-md border border-zinc-300 px-3 py-2"
              placeholder="Full Stack Interview Simulation"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-zinc-700">Category</span>
            <input
              className="rounded-md border border-zinc-300 px-3 py-2"
              placeholder="Technology"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-zinc-700">Difficulty</span>
            <select
              className="rounded-md border border-zinc-300 px-3 py-2"
              value={difficulty}
              onChange={(event) =>
                setDifficulty(event.target.value as MockTest["difficulty"])
              }
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-zinc-700">Duration (minutes)</span>
            <input
              type="number"
              min={10}
              className="rounded-md border border-zinc-300 px-3 py-2"
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(Number(event.target.value))}
            />
          </label>
        </div>
        <label className="mt-4 flex flex-col gap-2 text-sm">
          <span className="font-medium text-zinc-700">Description</span>
          <textarea
            className="min-h-[120px] rounded-md border border-zinc-300 px-3 py-2"
            placeholder="Outline the learning outcomes, recommended preparation, and structure."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
      </section>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <section
            key={section.id}
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900">
                Section {index + 1}
              </h3>
              <button
                type="button"
                onClick={() => removeSection(section.id)}
                className="rounded-md px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
              >
                Remove
              </button>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-zinc-700">Section Title</span>
                <input
                  className="rounded-md border border-zinc-300 px-3 py-2"
                  value={section.title}
                  onChange={(event) =>
                    updateSectionTitle(section.id, event.target.value)
                  }
                />
              </label>
              <label className="flex flex-col gap-2 text-sm md:col-span-2">
                <span className="font-medium text-zinc-700">Description</span>
                <textarea
                  className="rounded-md border border-zinc-300 px-3 py-2"
                  value={section.description}
                  onChange={(event) =>
                    updateSectionDescription(section.id, event.target.value)
                  }
                />
              </label>
            </div>
            <div className="mt-6 space-y-4">
              {section.questions.map((question, idx) => (
                <div
                  key={question.id}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-zinc-700">
                      Question {idx + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeQuestion(section.id, question.id)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                  <label className="mt-3 flex flex-col gap-2 text-sm">
                    <span className="font-medium text-zinc-700">Prompt</span>
                    <textarea
                      className="rounded-md border border-zinc-300 px-3 py-2"
                      value={question.prompt}
                      onChange={(event) =>
                        updateQuestion(section.id, question.id, (current) => ({
                          ...current,
                          prompt: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="font-medium text-zinc-700">Difficulty</span>
                      <select
                        className="rounded-md border border-zinc-300 px-3 py-2"
                        value={question.difficulty}
                        onChange={(event) =>
                          updateQuestion(section.id, question.id, (current) => ({
                            ...current,
                            difficulty: event.target.value as Question["difficulty"],
                          }))
                        }
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="font-medium text-zinc-700">Marks</span>
                      <input
                        type="number"
                        min={1}
                        className="rounded-md border border-zinc-300 px-3 py-2"
                        value={question.marks}
                        onChange={(event) =>
                          updateQuestion(section.id, question.id, (current) => ({
                            ...current,
                            marks: Number(event.target.value),
                          }))
                        }
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="font-medium text-zinc-700">
                        Negative Marks
                      </span>
                      <input
                        type="number"
                        min={0}
                        className="rounded-md border border-zinc-300 px-3 py-2"
                        value={question.negativeMarks ?? 0}
                        onChange={(event) =>
                          updateQuestion(section.id, question.id, (current) => ({
                            ...current,
                            negativeMarks: Number(event.target.value),
                          }))
                        }
                      />
                    </label>
                  </div>
                  <div className="mt-4 space-y-3">
                    <p className="text-xs font-semibold uppercase text-zinc-500">Choices</p>
                    {question.choices.map((choice) => (
                      <div
                        key={choice.id}
                        className="flex flex-col gap-2 rounded-md border border-zinc-200 bg-white p-3 sm:flex-row sm:items-center"
                      >
                        <label className="flex flex-1 items-center gap-2 text-sm">
                          <input
                            type="text"
                            className="w-full rounded-md border border-zinc-300 px-3 py-2"
                            placeholder="Answer choice"
                            value={choice.label}
                            onChange={(event) =>
                              updateQuestion(section.id, question.id, (current) => ({
                                ...current,
                                choices: current.choices.map((item) =>
                                  item.id === choice.id
                                    ? { ...item, label: event.target.value }
                                    : item,
                                ),
                              }))
                            }
                          />
                        </label>
                        <label className="flex items-center gap-2 text-xs font-medium text-zinc-600">
                          <input
                            type="checkbox"
                            checked={choice.isCorrect}
                        onChange={(event) =>
                          updateQuestion(section.id, question.id, (current) => ({
                            ...current,
                            choices: current.choices.map((item) =>
                              item.id === choice.id
                                ? { ...item, isCorrect: event.target.checked }
                                : item,
                            ),
                          }))
                        }
                      />
                          Correct
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuestion(section.id, question.id, (current) => ({
                              ...current,
                              choices:
                                current.choices.length === 2
                                  ? current.choices
                                  : current.choices.filter((item) => item.id !== choice.id),
                            }))
                          }
                          className="text-xs font-medium text-red-600 transition hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        updateQuestion(section.id, question.id, (current) => ({
                          ...current,
                          choices: [
                            ...current.choices,
                            { id: uuid(), label: "", isCorrect: false },
                          ],
                        }))
                      }
                      className="rounded-md border border-dashed border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-900"
                    >
                      Add Choice
                    </button>
                  </div>
                  <label className="mt-4 flex flex-col gap-2 text-sm">
                    <span className="font-medium text-zinc-700">Tags</span>
                    <input
                      className="rounded-md border border-zinc-300 px-3 py-2"
                      placeholder="Comma separated keywords"
                      value={question.tags?.join(", ") ?? ""}
                      onChange={(event) =>
                        updateQuestion(section.id, question.id, (current) => ({
                          ...current,
                          tags: event.target.value
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean),
                        }))
                      }
                    />
                  </label>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addQuestion(section.id)}
              className="mt-4 rounded-md border border-dashed border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
            >
              Add Question
            </button>
          </section>
        ))}
        <button
          type="button"
          onClick={addSection}
          className="w-full rounded-md border border-zinc-300 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-900"
        >
          Add Section
        </button>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase text-zinc-500">Summary</p>
          <p className="mt-1 text-sm text-zinc-600">
            {sections.length} sections ·{" "}
            {sections.reduce((sum, section) => sum + section.questions.length, 0)} questions ·{" "}
            {totalMarks} marks
          </p>
        </div>
        <button
          type="button"
          onClick={saveTest}
          className="rounded-md bg-zinc-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
        >
          Save Mock Test
        </button>
      </div>
    </div>
  );
};
