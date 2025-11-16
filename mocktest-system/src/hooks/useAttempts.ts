"use client";

import { loadAttempts, persistAttempts } from "@/lib/storage";
import { TestAttempt } from "@/types";
import { useState } from "react";

export const useAttempts = () => {
  const [attempts, setAttempts] = useState<TestAttempt[]>(() => loadAttempts());

  const addAttempt = (attempt: TestAttempt) => {
    setAttempts((prev) => {
      const next = [attempt, ...prev];
      persistAttempts(next);
      return next;
    });
  };

  return {
    attempts,
    addAttempt,
  };
};
