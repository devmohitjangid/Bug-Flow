import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const DEMO_ORGANIZATION = { id: "demo-org", name: "BugFlow Demo Workspace", createdAt: "Sep 28, 2026" };
const DEMO_USERS = [
  { id: "demo-manager", name: "Mohit Jangid", email: "manager@bugflow.demo", password: "manager123", role: "Manager", organizationId: DEMO_ORGANIZATION.id },
  { id: "demo-developer", name: "Rahul Verma", email: "developer@bugflow.demo", password: "developer123", role: "Developer", organizationId: DEMO_ORGANIZATION.id },
  { id: "demo-tester", name: "Priya Singh", email: "tester@bugflow.demo", password: "tester123", role: "Tester", organizationId: DEMO_ORGANIZATION.id },
];
const USERS_KEY = "bugflow-users";
const ORGANIZATIONS_KEY = "bugflow-organizations";
const SESSION_KEY = "bugflow-session";

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readUsers() {
  try {
    const parsed = JSON.parse(localStorage.getItem(USERS_KEY) || "null");
    if (Array.isArray(parsed)) {
      const byEmail = new Map(parsed.map((user) => [user.email.toLowerCase(), { ...user, organizationId: user.organizationId || DEMO_ORGANIZATION.id }]));
      DEMO_USERS.forEach((user) => { if (!byEmail.has(user.email)) byEmail.set(user.email, user); });
      const users = [...byEmail.values()];
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return users;
    }
  } catch { /* Recover from malformed demo data. */ }
  localStorage.setItem(USERS_KEY, JSON.stringify(DEMO_USERS));
  return DEMO_USERS;
}

function readOrganizations() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ORGANIZATIONS_KEY) || "null");
    if (Array.isArray(parsed)) {
      const organizations = parsed.some((organization) => organization.id === DEMO_ORGANIZATION.id) ? parsed : [DEMO_ORGANIZATION, ...parsed];
      localStorage.setItem(ORGANIZATIONS_KEY, JSON.stringify(organizations));
      return organizations;
    }
  } catch { /* Recover from malformed demo data. */ }
  localStorage.setItem(ORGANIZATIONS_KEY, JSON.stringify([DEMO_ORGANIZATION]));
  return [DEMO_ORGANIZATION];
}

function readSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
}

export function getInitials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(readUsers);
  const [organizations, setOrganizations] = useState(readOrganizations);
  const [currentUser, setCurrentUser] = useState(() => {
    const session = readSession();
    if (!session) return null;
    const storedUsers = readUsers();
    return storedUsers.find((user) => user.id === session.id || user.email === session.email) || null;
  });
  const persistUsers = (nextUsers) => { setUsers(nextUsers); localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers)); };
  const persistOrganizations = (nextOrganizations) => { setOrganizations(nextOrganizations); localStorage.setItem(ORGANIZATIONS_KEY, JSON.stringify(nextOrganizations)); };
  const login = (email, password) => {
    const user = users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password);
    if (!user) throw new Error("Email or password is incorrect.");
    setCurrentUser(user); localStorage.setItem(SESSION_KEY, JSON.stringify(user)); return user;
  };
  const signupOrganization = ({ organizationName, name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) throw new Error("An account with this email already exists.");
    const organization = { id: makeId("org"), name: organizationName.trim(), createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) };
    const user = { id: makeId("user"), name: name.trim(), email: normalizedEmail, password, role: "Manager", organizationId: organization.id };
    persistOrganizations([...organizations, organization]);
    persistUsers([...users, user]);
    setCurrentUser(user); localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  };
  const addTeamMember = ({ name, email, password, role }) => {
    if (!currentUser || currentUser.role !== "Manager") throw new Error("Only a Manager can add team members.");
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) throw new Error("An account with this email already exists.");
    if (!["Developer", "Tester"].includes(role)) throw new Error("Team members can only be Developers or Testers.");
    const user = { id: makeId("user"), name: name.trim(), email: normalizedEmail, password, role, organizationId: currentUser.organizationId };
    persistUsers([...users, user]);
    return user;
  };
  const logout = () => { setCurrentUser(null); localStorage.removeItem(SESSION_KEY); };
  const currentOrganization = organizations.find((organization) => organization.id === currentUser?.organizationId) || null;
  const organizationMembers = users.filter((user) => user.organizationId === currentUser?.organizationId);
  const value = { users, organizations, organizationMembers, signupOrganization, addTeamMember, login, logout, currentUser, currentOrganization, isAuthenticated: Boolean(currentUser) };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }

// Compatibility API for existing screens; role now comes only from the session.
export function useRole() {
  const auth = useAuth();
  return { ...auth, role: auth.currentUser?.role, currentUser: auth.currentUser ? { ...auth.currentUser, initials: getInitials(auth.currentUser.name) } : null };
}

export const RoleProvider = AuthProvider;
