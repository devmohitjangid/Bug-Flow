import { Link } from "react-router-dom";
import {
  Bug,
  CircleAlert,
  Clock3,
  CircleCheck,
  Plus,
  ArrowRight,
} from "lucide-react";

import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { useBugs } from "../context/BugContext";
import { useRole } from "../context/RoleContext";

function Dashboard() {
  const { bugs } = useBugs();
  const { role, currentUser } = useRole();
  const assignedToMe = bugs.filter((bug) => bug.assignee === currentUser.name);
  
  const totalBugs = bugs.length;

  const openBugs = bugs.filter(
    (bug) => bug.status === "Open"
  ).length;

  const progressBugs = bugs.filter(
    (bug) => bug.status === "In Progress"
  ).length;

  const resolvedBugs = bugs.filter(
    (bug) => bug.status === "Fixed" || bug.status === "Closed"
  ).length;

  const severityStyles = {
    Critical: "bg-[#F4E4E2] text-[#8B3D37]",
    High: "bg-[#F4E9DE] text-[#925B32]",
    Medium: "bg-[#F1EEDC] text-[#756A31]",
    Low: "bg-[#E7EEE4] text-[#536A4A]",
  };

  const statusStyles = {
    Open: "bg-[#EEEAE4] text-[#57534D]",
    Assigned: "bg-[#EAE6DF] text-[#5C5851]",
    "In Progress": "bg-[#E7E9E6] text-[#505C54]",
    Fixed: "bg-[#E6ECE3] text-[#4F6848]",
    Closed: "bg-[#ECEAE6] text-[#65615A]",
  };

  return (
    <Layout>
      {/* Page Header */}
      <section className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#99948B]">
            Overview
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-[#22221F] sm:text-3xl">
            Issue Dashboard
          </h1>

          <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#77736B]">
            Track reported issues, monitor development progress and keep
            your workflow organized.
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#292925] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#3A3934] active:scale-[0.98]"
        >
          <Plus size={17} />
          Report Bug
        </Link>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Issues"
          value={totalBugs}
          icon={Bug}
          description="All reported issues"
        />

        <StatCard
          title="Open"
          value={openBugs}
          icon={CircleAlert}
          description="Waiting to be assigned"
          iconStyle="bg-[#F4E4E2] text-[#8B3D37]"
        />

        <StatCard
          title="In Progress"
          value={progressBugs}
          icon={Clock3}
          description="Currently being worked on"
          iconStyle="bg-[#E9E7DF] text-[#625E54]"
        />

        <StatCard
          title="Resolved"
          value={resolvedBugs}
          icon={CircleCheck}
          description="Fixed or closed issues"
          iconStyle="bg-[#E7EEE4] text-[#536A4A]"
        />
      </section>

      {/* Main section */}
      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_310px]">
        {/* Recent Bugs */}
        <div className="overflow-hidden rounded-2xl border border-[#E2DED5] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between border-b border-[#EBE7DF] px-5 py-5 sm:px-6">
            <div>
              <h2 className="font-semibold text-[#292925]">
                Recent Issues
              </h2>

              <p className="mt-1 text-xs text-[#8C877E]">
                Latest issues reported by your team
              </p>
            </div>

            <Link
              to="/bugs"
              className="flex items-center gap-1.5 text-sm font-medium text-[#4E4B45] transition hover:text-black"
            >
              View all
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Desktop/tablet table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-[#FAF9F6]">
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8D887F]">
                    Issue
                  </th>

                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8D887F]">
                    Severity
                  </th>

                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8D887F]">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8D887F]">
                    Assignee
                  </th>
                </tr>
              </thead>

              <tbody>
                {bugs.slice(0, 5).map((bug) => (
                  <tr
                    key={bug.id}
                    className="border-t border-[#EFEBE4] transition hover:bg-[#FAF9F6]"
                  >
                    <td className="px-6 py-4">
                      <p className="text-xs font-semibold text-[#8A857C]">
                        {bug.id}
                      </p>

                      <p className="mt-1 max-w-[270px] truncate text-sm font-medium text-[#292925]">
                        {bug.title}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          severityStyles[bug.severity]
                        }`}
                      >
                        {bug.severity}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          statusStyles[bug.status]
                        }`}
                      >
                        {bug.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-[#68645D]">
                      {bug.assignee}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-[#ECE8E0] md:hidden">
            {bugs.slice(0, 5).map((bug) => (
              <div key={bug.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-[#99948B]">
                      {bug.id}
                    </p>

                    <h3 className="mt-1 text-sm font-semibold leading-5 text-[#292925]">
                      {bug.title}
                    </h3>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      severityStyles[bug.severity]
                    }`}
                  >
                    {bug.severity}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      statusStyles[bug.status]
                    }`}
                  >
                    {bug.status}
                  </span>

                  <span className="text-xs text-[#8A857C]">
                    {bug.assignee}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Workflow */}
          <div className="rounded-2xl border border-[#E2DED5] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <h2 className="font-semibold text-[#292925]">
              Issue Workflow
            </h2>

            <p className="mt-1 text-xs leading-5 text-[#8C877E]">
              Bugs move through five controlled stages.
            </p>

            <div className="mt-5 space-y-2">
              {[
                "Open",
                "Assigned",
                "In Progress",
                "Fixed",
                "Closed",
              ].map((status, index) => (
                <div
                  key={status}
                  className="flex items-center gap-3 rounded-xl bg-[#F8F6F1] px-3.5 py-3"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E9E4DA] text-[11px] font-bold text-[#514E47]">
                    {index + 1}
                  </div>

                  <span className="text-sm font-medium text-[#4D4A44]">
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E2DED5] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <h2 className="font-semibold text-[#292925]">Severity Overview</h2>
            <p className="mt-1 text-xs leading-5 text-[#8C877E]">Distribution across all reported issues.</p>
            <div className="mt-5 space-y-3">
              {["Critical", "High", "Medium", "Low"].map((severity) => {
                const count = bugs.filter((bug) => bug.severity === severity).length;
                const width = totalBugs ? `${Math.max((count / totalBugs) * 100, count ? 8 : 0)}%` : "0%";
                return <div key={severity}><div className="mb-1.5 flex items-center justify-between text-xs"><span className="font-medium text-[#625E57]">{severity}</span><span className="text-[#99948B]">{count}</span></div><div className="h-2 rounded-full bg-[#F0ECE4]"><div className={`h-2 rounded-full ${severity === "Critical" ? "bg-[#B57B73]" : severity === "High" ? "bg-[#C69A72]" : severity === "Medium" ? "bg-[#B3A865]" : "bg-[#829477]"}`} style={{ width }} /></div></div>;
              })}
            </div>
          </div>

          {/* Quick action */}
          <div className="rounded-2xl bg-[#292925] p-5 text-white">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#AAA69D]">
              Quick Action
            </p>

            <h3 className="mt-3 text-lg font-semibold">
              Found a new issue?
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#BEBAB1]">
              Create a detailed bug report so your team can start
              investigating.
            </p>

            <Link
              to="/report"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#EEE8DD] px-4 py-2.5 text-sm font-semibold text-[#292925] transition hover:bg-white"
            >
              <Plus size={16} />
              Report Bug
            </Link>
          </div>
        </div>
      </section>

      {role === "Developer" && (
        <section className="mt-6 overflow-hidden rounded-2xl border border-[#E2DED5] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between border-b border-[#EBE7DF] px-5 py-5 sm:px-6">
            <div>
              <h2 className="font-semibold text-[#292925]">My Assigned Issues</h2>
              <p className="mt-1 text-xs text-[#8C877E]">Issues currently assigned to {currentUser.name}</p>
            </div>
            <span className="rounded-full bg-[#EEE8DD] px-2.5 py-1 text-xs font-semibold text-[#625E57]">{assignedToMe.length}</span>
          </div>
          {assignedToMe.length ? (
            <div className="divide-y divide-[#ECE8E0]">
              {assignedToMe.map((bug) => (
                <Link key={bug.id} to={`/bugs/${bug.id}`} className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-[#FAF9F6] sm:px-6">
                  <div className="min-w-0"><p className="text-xs font-semibold text-[#99948B]">{bug.id}</p><p className="mt-1 truncate text-sm font-medium text-[#292925]">{bug.title}</p></div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyles[bug.status]}`}>{bug.status}</span>
                </Link>
              ))}
            </div>
          ) : <p className="px-5 py-8 text-sm text-[#817D75] sm:px-6">No issues are assigned to you yet.</p>}
        </section>
      )}
    </Layout>
  );
}

export default Dashboard;
