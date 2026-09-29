import { createContext, useContext, useState } from "react";

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [role, setRole] = useState(() => {
    return localStorage.getItem("bugflow-role") || "Manager";
  });

  const changeRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem("bugflow-role", newRole);
  };

  const userByRole = {
    Manager: {
      name: "Mohit Jangid",
      initials: "MJ",
    },

    Developer: {
      name: "Rahul Verma",
      initials: "RV",
    },

    Tester: {
      name: "Priya Singh",
      initials: "PS",
    },
  };

  const currentUser = userByRole[role];

  return (
    <RoleContext.Provider
      value={{
        role,
        changeRole,
        currentUser,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}