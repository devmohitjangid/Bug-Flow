import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { bugs as initialBugs } from "../data/mockData";

const BugContext = createContext();

export function BugProvider({ children }) {
  const [bugs, setBugs] = useState(() => {
    const savedBugs = localStorage.getItem("bugflow-bugs");

    if (savedBugs) {
      try {
        return JSON.parse(savedBugs);
      } catch {
        return initialBugs;
      }
    }

    return initialBugs;
  });

  const [comments, setComments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("bugflow-comments") || "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("bugflow-bugs", JSON.stringify(bugs));
  }, [bugs]);

  useEffect(() => {
    localStorage.setItem("bugflow-comments", JSON.stringify(comments));
  }, [comments]);

  const addBug = (bugData) => {
    const highestNumber = bugs.reduce((max, bug) => {
      const number = Number(bug.id?.replace("BUG-", "")) || 100;
      return Math.max(max, number);
    }, 100);

    const newBug = {
      id: `BUG-${highestNumber + 1}`,
      title: bugData.title,
      description: bugData.description,
      steps: bugData.steps,
      severity: bugData.severity,
      status: "Open",
      assignee: "Unassigned",
      reporter: bugData.reporter || "Mohit Jangid",
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    setBugs((currentBugs) => [newBug, ...currentBugs]);

    return newBug;
  };

  const updateBug = (id, updates) => {
    setBugs((currentBugs) =>
      currentBugs.map((bug) =>
        bug.id === id ? { ...bug, ...updates } : bug
      )
    );
  };

  const getComments = useCallback((id) => comments[id] || [], [comments]);

  const addComment = useCallback((id, comment) => {
    setComments((current) => ({
      ...current,
      [id]: [...(current[id] || []), comment],
    }));
  }, []);

  return (
    <BugContext.Provider
      value={{
        bugs,
        addBug,
        updateBug,
        getComments,
        addComment,
      }}
    >
      {children}
    </BugContext.Provider>
  );
}

export function useBugs() {
  return useContext(BugContext);
}
