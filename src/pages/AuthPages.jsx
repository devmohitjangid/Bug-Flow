import { useState } from "react";
import { Bug, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/RoleContext";

const inputClass = "w-full rounded-xl border border-[#DDD8CE] bg-[#FAF9F6] px-4 py-3 text-sm text-[#292925] outline-none transition placeholder:text-[#AAA59C] focus:border-[#AAA399] focus:bg-white focus:ring-2 focus:ring-[#DED8CC]/60";

function AuthShell({ title, subtitle, children }) {
  return <main className="flex min-h-screen items-center justify-center bg-[#F5F3EE] px-4 py-8 sm:px-6"><div className="w-full max-w-[460px]"><div className="mb-8 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#292925] text-[#EEE8DD]"><Bug size={25} /></div><p className="mt-4 text-xl font-semibold tracking-tight text-[#292925]">BugFlow</p><p className="mt-1 text-sm text-[#827E76]">Bug Tracking &amp; Issue Management</p></div><section className="rounded-2xl border border-[#E2DED5] bg-white p-6 shadow-[0_12px_40px_rgba(45,42,35,0.06)] sm:p-8"><h1 className="text-2xl font-semibold tracking-tight text-[#292925]">{title}</h1><p className="mt-2 text-sm text-[#77736B]">{subtitle}</p>{children}</section><p className="mt-6 text-center text-xs text-[#99948B]">Frontend demo authentication · Not production security</p></div></main>;
}

function Field({ label, icon: Icon, type = "text", value, onChange, placeholder, error, autoComplete }) {
  return <div><label className="mb-2 block text-sm font-semibold text-[#45423D]">{label}</label><div className="relative"><Icon size={17} className="absolute left-3.5 top-3.5 text-[#99948B]" /><input type={type} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete} className={`${inputClass} pl-10 ${error ? "border-[#B96B64]" : ""}`} /></div>{error && <p className="mt-1.5 text-xs font-medium text-[#9A4D47]">{error}</p>}</div>;
}

function PasswordField({ label, value, onChange, error, autoComplete }) {
  const [visible, setVisible] = useState(false);
  return <div><label className="mb-2 block text-sm font-semibold text-[#45423D]">{label}</label><div className="relative"><LockKeyhole size={17} className="absolute left-3.5 top-3.5 text-[#99948B]" /><input type={visible ? "text" : "password"} value={value} onChange={onChange} autoComplete={autoComplete} className={`${inputClass} pl-10 pr-11 ${error ? "border-[#B96B64]" : ""}`} /><button type="button" aria-label={visible ? "Hide password" : "Show password"} onClick={() => setVisible((current) => !current)} className="absolute right-3 top-2.5 rounded-lg p-1 text-[#77736B] hover:bg-[#EEE8DD]">{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{error && <p className="mt-1.5 text-xs font-medium text-[#9A4D47]">{error}</p>}</div>;
}

function DemoAccounts({ onUse }) {
  const accounts = [["Manager", "manager@bugflow.demo", "manager123"], ["Developer", "developer@bugflow.demo", "developer123"], ["Tester", "tester@bugflow.demo", "tester123"]];
  return <div className="mt-6 border-t border-[#EEEAE3] pt-5"><p className="text-xs font-semibold uppercase tracking-wider text-[#99948B]">Demo Accounts</p><div className="mt-3 grid gap-2 sm:grid-cols-3">{accounts.map(([role, email, password]) => <button key={role} type="button" onClick={() => onUse(email, password)} className="rounded-xl border border-[#E2DED5] bg-[#FAF9F6] px-2 py-2.5 text-left transition hover:bg-[#F0ECE4]"><span className="block text-xs font-semibold text-[#45423D]">{role}</span><span className="mt-1 block truncate text-[10px] text-[#827E76]">{email}</span></button>)}</div></div>;
}

export function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState("");
  if (isAuthenticated) return <Navigate to="/" replace />;
  const submit = (event) => { event.preventDefault(); setError(""); if (!email.trim() || !password) { setError("Enter your email and password."); return; } try { login(email, password); navigate(location.state?.from?.pathname || "/", { replace: true }); } catch (err) { setError(err.message); } };
  return <AuthShell title="Welcome Back" subtitle="Sign in to continue"><form onSubmit={submit} className="mt-7 space-y-5"><Field label="Business Email" icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" /><PasswordField label="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />{error && <p className="rounded-xl bg-[#F4E4E2] px-3.5 py-3 text-xs font-medium text-[#8B3D37]">{error}</p>}<button className="w-full rounded-xl bg-[#292925] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3A3934]">Sign In</button></form><p className="mt-6 text-center text-sm text-[#77736B]">New to BugFlow? <Link to="/signup" className="font-semibold text-[#292925] hover:underline">Create a workspace</Link></p><DemoAccounts onUse={(demoEmail, demoPassword) => { setEmail(demoEmail); setPassword(demoPassword); setError(""); }} /></AuthShell>;
}

export function Signup() {
  const { signupOrganization, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ organizationName: "", name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  if (isAuthenticated) return <Navigate to="/" replace />;
  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    setError("");
    const { organizationName, name, email, password, confirm } = form;
    if (!organizationName.trim() || !name.trim() || !email.trim() || !password || !confirm) return setError("All fields are required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter a valid business email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    try { signupOrganization({ organizationName, name, email, password }); navigate("/", { replace: true }); } catch (err) { setError(err.message); }
  };
  return <AuthShell title="Create your BugFlow workspace" subtitle="Start your team workspace. You will become its Manager."><form onSubmit={submit} className="mt-7 space-y-5"><Field label="Business / Organization Name" icon={UserRound} value={form.organizationName} onChange={set("organizationName")} placeholder="Acme Technologies" autoComplete="organization" /><Field label="Full Name" icon={UserRound} value={form.name} onChange={set("name")} placeholder="Your full name" autoComplete="name" /><Field label="Business Email" icon={Mail} type="email" value={form.email} onChange={set("email")} placeholder="you@company.com" autoComplete="email" /><PasswordField label="Password" value={form.password} onChange={set("password")} autoComplete="new-password" /><PasswordField label="Confirm Password" value={form.confirm} onChange={set("confirm")} autoComplete="new-password" />{error && <p className="rounded-xl bg-[#F4E4E2] px-3.5 py-3 text-xs font-medium text-[#8B3D37]">{error}</p>}<button className="w-full rounded-xl bg-[#292925] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3A3934]">Create Workspace</button></form><p className="mt-6 text-center text-sm text-[#77736B]">Already have a workspace? <Link to="/login" className="font-semibold text-[#292925] hover:underline">Sign In</Link></p></AuthShell>;
}

export function ProtectedRoute({ children }) { const { isAuthenticated } = useAuth(); const location = useLocation(); return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: location }} />; }

export function ManagerRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser?.role === "Manager" ? children : <Navigate to="/" replace />;
}
