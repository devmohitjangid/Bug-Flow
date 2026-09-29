import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, BadgeCheck, CalendarDays, CheckCircle2, Clock3, LockKeyhole, MessageSquare, Play, RotateCcw, Send, ShieldCheck, User, UserCheck, Wrench } from "lucide-react";
import Layout from "../components/Layout";
import { useBugs } from "../context/BugContext";
import { useRole } from "../context/RoleContext";

const statuses = ["Open", "Assigned", "In Progress", "Fixed", "Closed"];
const severityStyles = { Critical: "bg-[#F4E4E2] text-[#8B3D37]", High: "bg-[#F4E9DE] text-[#925B32]", Medium: "bg-[#F1EEDC] text-[#756A31]", Low: "bg-[#E7EEE4] text-[#536A4A]" };
const statusStyles = { Open: "bg-[#EEEAE4] text-[#57534D]", Assigned: "bg-[#EAE6DF] text-[#5C5851]", "In Progress": "bg-[#E7E9E6] text-[#505C54]", Fixed: "bg-[#E6ECE3] text-[#4F6848]", Closed: "bg-[#ECEAE6] text-[#65615A]" };

function BugDetails() {
  const { id } = useParams();
  const { bugs, updateBug, getComments, addComment } = useBugs();
  const { role, currentUser, users } = useRole();
  const developers = users.filter((user) => user.role === "Developer" && user.organizationId === currentUser.organizationId).map((user) => user.name);
  const bug = bugs.find((item) => item.id === id);
  const [comment, setComment] = useState("");
  const comments = getComments(id);
  const currentIndex = useMemo(() => statuses.indexOf(bug?.status), [bug?.status]);

  if (!bug) return <Layout><div className="rounded-2xl border border-[#E2DED5] bg-white px-6 py-16 text-center"><AlertTriangle size={32} className="mx-auto text-[#8A857C]" /><h1 className="mt-4 text-xl font-semibold text-[#292925]">Issue not found</h1><p className="mt-2 text-sm text-[#77736B]">The issue you are looking for does not exist.</p><Link to="/bugs" className="mt-5 inline-flex rounded-xl bg-[#292925] px-4 py-2.5 text-sm font-medium text-white">Return to All Bugs</Link></div></Layout>;

  const assignDeveloper = (assignee) => {
    if (role !== "Manager" || bug.status !== "Open") return;
    const developer = users.find((user) => user.role === "Developer" && user.organizationId === currentUser.organizationId && user.name === assignee);
    updateBug(bug.id, { assigneeId: developer?.id || null, assignee: developer?.name || "Unassigned", ...(bug.status === "Open" && developer ? { status: "Assigned" } : {}) });
  };
  const transition = (nextStatus) => {
    const isAssigned = bug.assigneeId === currentUser.id || (!bug.assigneeId && bug.assignee === currentUser.name);
    const developerAllowed = role === "Developer" && isAssigned && ((bug.status === "Assigned" && nextStatus === "In Progress") || (bug.status === "In Progress" && nextStatus === "Fixed"));
    const testerAllowed = role === "Tester" && bug.status === "Fixed" && ["Closed", "In Progress"].includes(nextStatus);
    if (developerAllowed || testerAllowed) updateBug(bug.id, { status: nextStatus });
  };
  const handleAddComment = (event) => {
    event.preventDefault(); const text = comment.trim(); if (!text) return;
    const newComment = { id: Date.now(), user: currentUser.name, initials: currentUser.initials, text, time: "Just now" };
    addComment(bug.id, newComment); setComment("");
  };
  const actionContent = () => {
    if (role === "Manager") return <Notice>Assign an open issue to a developer using the assignee control.</Notice>;
    if (role === "Developer" && !(bug.assigneeId === currentUser.id || (!bug.assigneeId && bug.assignee === currentUser.name))) return <Notice>Only the assigned developer can update this issue.</Notice>;
    if (role === "Developer" && bug.status === "Assigned") return <ActionButton icon={Play} onClick={() => transition("In Progress")}>Start Progress</ActionButton>;
    if (role === "Developer" && bug.status === "In Progress") return <ActionButton icon={Wrench} onClick={() => transition("Fixed")}>Mark as Fixed</ActionButton>;
    if (role === "Tester" && bug.status === "Fixed") return <div className="space-y-2"><ActionButton icon={BadgeCheck} onClick={() => transition("Closed")}>Verify &amp; Close</ActionButton><ActionButton secondary icon={RotateCcw} onClick={() => transition("In Progress")}>Reopen Issue</ActionButton></div>;
    return <Notice>No workflow action is available for your role at this stage.</Notice>;
  };

  return <Layout>
    <Link to="/bugs" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#77736B] hover:text-[#292925]"><ArrowLeft size={16} />Back to All Bugs</Link>
    <section className="mb-6 flex flex-col justify-between gap-5 xl:flex-row xl:items-start"><div className="max-w-3xl"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#99948B]">{bug.id}</span><Badge className={severityStyles[bug.severity]}>{bug.severity}</Badge><Badge className={statusStyles[bug.status]}>{bug.status}</Badge></div><h1 className="mt-3 break-words text-2xl font-semibold tracking-tight text-[#22221F] sm:text-3xl">{bug.title}</h1><p className="mt-2 text-sm text-[#77736B]">Reported by <span className="font-medium text-[#4E4B45]">{bug.reporter}</span> on {bug.createdAt}</p></div><div className="flex w-fit items-center gap-2 rounded-xl border border-[#DCD7CE] bg-white px-3.5 py-2.5"><ShieldCheck size={16} className="text-[#68645D]" /><div><p className="text-[10px] uppercase tracking-wider text-[#99948B]">Acting as</p><p className="text-xs font-semibold text-[#35332F]">{role} · {currentUser.name}</p></div></div></section>
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_330px]"><div className="space-y-6"><InfoSection title="Description"><p className="whitespace-pre-line text-sm leading-7 text-[#68645D]">{bug.description}</p></InfoSection><InfoSection title="Steps to Reproduce"><div className="whitespace-pre-line rounded-xl bg-[#FAF9F6] p-4 text-sm leading-7 text-[#68645D]">{bug.steps}</div></InfoSection><section className="overflow-hidden rounded-2xl border border-[#E2DED5] bg-white"><div className="border-b border-[#EBE7DF] px-5 py-5 sm:px-6"><div className="flex items-center gap-2"><MessageSquare size={18} className="text-[#77736B]" /><h2 className="font-semibold text-[#292925]">Discussion</h2><span className="rounded-full bg-[#EEE8DD] px-2 py-0.5 text-xs font-medium text-[#625E57]">{comments.length}</span></div></div><div className="divide-y divide-[#EFEAE3]">{comments.length ? comments.map((item) => <div key={item.id} className="flex gap-3 p-5 sm:p-6"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#292925] text-[11px] font-semibold text-white">{item.initials}</div><div><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold text-[#292925]">{item.user}</p><span className="text-xs text-[#AAA59C]">{item.time}</span></div><p className="mt-2 text-sm leading-6 text-[#68645D]">{item.text}</p></div></div>) : <p className="p-6 text-sm text-[#8A857C]">No comments yet.</p>}</div><form onSubmit={handleAddComment} className="border-t border-[#EBE7DF] p-5 sm:p-6"><label className="mb-2 block text-sm font-medium text-[#514E47]">Add a comment as {currentUser.name}</label><textarea value={comment} onChange={(event) => setComment(event.target.value)} rows="3" placeholder="Write an update about this issue..." className="w-full resize-none rounded-xl border border-[#DDD8CE] bg-[#FAF9F6] px-4 py-3 text-sm text-[#292925] outline-none focus:border-[#AAA399] focus:bg-white" /><div className="mt-3 flex justify-end"><button type="submit" disabled={!comment.trim()} className="inline-flex items-center gap-2 rounded-xl bg-[#292925] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3A3934] disabled:cursor-not-allowed disabled:opacity-50"><Send size={15} />Comment</button></div></form></section></div>
      <aside className="space-y-5"><section className="rounded-2xl border border-[#E2DED5] bg-white p-5"><div className="mb-4"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#99948B]">Role Action</p><h2 className="mt-1 font-semibold text-[#292925]">{role} Controls</h2></div>{actionContent()}</section><section className="rounded-2xl border border-[#E2DED5] bg-white p-5"><h2 className="font-semibold text-[#292925]">Issue Details</h2><div className="mt-5 space-y-5"><Detail label="Status" icon={Clock3}><Badge className={statusStyles[bug.status]}>{bug.status}</Badge></Detail><Detail label="Assignee" icon={UserCheck}>{role === "Manager" ? <select value={bug.assignee} onChange={(event) => assignDeveloper(event.target.value)} className="w-full rounded-xl border border-[#DDD8CE] bg-[#FAF9F6] px-3.5 py-2.5 text-sm font-medium text-[#514E47] outline-none">{developers.map((developer) => <option key={developer}>{developer}</option>)}</select> : <div className="rounded-xl bg-[#F7F5F0] px-3.5 py-2.5 text-sm font-medium text-[#514E47]">{bug.assignee}</div>}</Detail><div className="h-px bg-[#EEEAE3]" /><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm text-[#77736B]"><AlertTriangle size={15} />Severity</span><Badge className={severityStyles[bug.severity]}>{bug.severity}</Badge></div><Detail label="Reporter" icon={User}>{bug.reporter}</Detail><Detail label="Created" icon={CalendarDays}>{bug.createdAt}</Detail></div></section><section className="rounded-2xl border border-[#E2DED5] bg-white p-5"><h2 className="font-semibold text-[#292925]">Workflow</h2><p className="mt-1 text-xs text-[#8C877E]">Controlled issue lifecycle.</p><div className="mt-5">{statuses.map((item, index) => <div key={item} className="relative flex gap-3 pb-5 last:pb-0">{index < statuses.length - 1 && <div className={`absolute left-[13px] top-7 h-full w-px ${index < currentIndex ? "bg-[#77736B]" : "bg-[#E2DED5]"}`} />}<div className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${index <= currentIndex ? "bg-[#292925] text-white" : "border border-[#DCD7CE] bg-white text-[#AAA59C]"}`}>{index < currentIndex ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-semibold">{index + 1}</span>}</div><div className="pt-1"><p className={`text-sm ${item === bug.status ? "font-semibold text-[#292925]" : "text-[#77736B]"}`}>{item}</p>{item === bug.status && <p className="mt-0.5 text-[11px] text-[#99948B]">Current status</p>}</div></div>)}</div></section></aside></div>
  </Layout>;
}
function Badge({ className, children }) { return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>{children}</span>; }
function ActionButton({ icon: Icon, onClick, secondary = false, children }) { return <button onClick={onClick} className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${secondary ? "border border-[#DCD7CE] bg-white text-[#514E47] hover:bg-[#EEE8DD]" : "bg-[#292925] text-white hover:bg-[#3A3934]"}`}><Icon size={16} />{children}</button>; }
function Notice({ children }) { return <div className="flex gap-3 rounded-xl bg-[#F0ECE4] p-4"><LockKeyhole size={17} className="mt-0.5 shrink-0 text-[#77736B]" /><p className="text-xs leading-5 text-[#68645D]">{children}</p></div>; }
function InfoSection({ title, children }) { return <section className="rounded-2xl border border-[#E2DED5] bg-white p-5 sm:p-6"><h2 className="mb-4 font-semibold text-[#292925]">{title}</h2>{children}</section>; }
function Detail({ label, icon: Icon, children }) { return <div><p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#99948B]"><Icon size={14} />{label}</p><div className="text-sm font-medium text-[#4E4B45]">{children}</div></div>; }
export default BugDetails;
