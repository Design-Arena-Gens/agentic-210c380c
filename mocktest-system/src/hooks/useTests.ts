"use client";

import { defaultMockTests } from "@/data/mockTests";
import { persistCustomTests, loadCustomTests } from "@/lib/storage";
import { MockTest } from "@/types";
import { useMemo, useState } from "react";

export const useTests = () => {
  const [customTests, setCustomTests] = useState<MockTest[]>(() => loadCustomTests());

  const allTests = useMemo(
    () => [...defaultMockTests, ...customTests],
    [customTests],
  );

  const addTest = (test: MockTest) => {
    setCustomTests((prev) => {
      const exists = prev.some((item) => item.id === test.id);
      const next = exists ? prev.map((item) => (item.id === test.id ? test : item)) : [test, ...prev];
      persistCustomTests(next);
      return next;
    });
  };

  const removeTest = (testId: string) => {
    setCustomTests((prev) => {
      const next = prev.filter((test) => test.id !== testId);
      persistCustomTests(next);
      return next;
    });
  };

  return {
    tests: allTests,
    customTests,
    addTest,
    removeTest,
  };
};
