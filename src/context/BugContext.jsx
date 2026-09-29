import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { bugs as initialBugs } from "../data/mockData";
import { useAuth } from "./RoleContext";

const BugContext = createContext();

export function BugProvider({ children }) {
  const { currentUser } = useAuth();
  const [bugs, setBugs] = useState(() => {
    const savedBugs = localStorage.getItem("bugflow-bugs");

    if (savedBugs) {
      try {
        return JSON.parse(savedBugs).map((bug) => ({ ...bug, organizationId: bug.organizationId || "demo-org" }));
      } catch {
        return initialBugs;
      }
    }

    return initialBugs.map((bug) => ({ ...bug, organizationId: "demo-org" }));
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
      assigneeId: null,
      reporter: bugData.reporter || "Unknown user",
      reporterId: bugData.reporterId || null,
      organizationId: currentUser?.organizationId || "demo-org",
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
        bug.id === id && bug.organizationId === currentUser?.organizationId ? { ...bug, ...updates } : bug
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

  const organizationBugs = bugs.filter((bug) => bug.organizationId === currentUser?.organizationId);

  return (
    <BugContext.Provider
      value={{
        bugs: organizationBugs,
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
