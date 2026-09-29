import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Plus,
  X,
  Bug,
  ChevronRight,
} from "lucide-react";

import Layout from "../components/Layout";
import { useBugs } from "../context/BugContext";
import { useRole } from "../context/RoleContext";

function Bugs() {
  const { bugs } = useBugs();
  const { currentUser, users } = useRole();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [severity, setSeverity] = useState("All");
  const [assignee, setAssignee] = useState("All");

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

  const assignees = [
    "All",
    ...new Set([
      ...users.filter((user) => user.role === "Developer" && user.organizationId === currentUser.organizationId).map((user) => user.name),
      ...bugs.map((bug) => bug.assignee).filter((name) => name !== "Unassigned"),
    ]),
  ];

  const filteredBugs = useMemo(() => {
    return bugs.filter((bug) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        bug.title.toLowerCase().includes(query) ||
        bug.id.toLowerCase().includes(query) ||
        bug.reporter.toLowerCase().includes(query) ||
        bug.assignee.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || bug.status === status;

      const matchesSeverity =
        severity === "All" || bug.severity === severity;

      const matchesAssignee =
        assignee === "All" || bug.assignee === assignee;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSeverity &&
        matchesAssignee
      );
    });
  }, [bugs, search, status, severity, assignee]);

  const filtersActive =
    search !== "" ||
    status !== "All" ||
    severity !== "All" ||
    assignee !== "All";

  const clearFilters = () => {
    setSearch("");
    setStatus("All");
    setSeverity("All");
    setAssignee("All");
  };

  return (
    <Layout>
      {/* Header */}
      <section className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#99948B]">
            Issue Management
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-[#22221F] sm:text-3xl">
            All Bugs
          </h1>

          <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#77736B]">
            Review, search and filter all reported issues across your
            workspace.
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

      {/* Filter panel */}
      <section className="rounded-2xl border border-[#E2DED5] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={17} className="text-[#77736B]" />

            <h2 className="text-sm font-semibold text-[#35332F]">
              Filters
            </h2>
          </div>

          {filtersActive && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs font-medium text-[#77736B] transition hover:text-black"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Search */}
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99948B]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, title, reporter..."
              className="w-full rounded-xl border border-[#DDD8CE] bg-[#FAF9F6] py-2.5 pl-10 pr-4 text-sm text-[#292925] outline-none transition placeholder:text-[#AAA59C] focus:border-[#AAA399] focus:bg-white focus:ring-2 focus:ring-[#DED8CC]/60"
            />
          </div>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-[#DDD8CE] bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-[#514E47] outline-none transition focus:border-[#AAA399] focus:bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Fixed">Fixed</option>
            <option value="Closed">Closed</option>
          </select>

          {/* Severity */}
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="rounded-xl border border-[#DDD8CE] bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-[#514E47] outline-none transition focus:border-[#AAA399] focus:bg-white"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Assignee */}
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="rounded-xl border border-[#DDD8CE] bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-[#514E47] outline-none transition focus:border-[#AAA399] focus:bg-white"
          >
            {assignees.map((name) => (
              <option key={name} value={name}>
                {name === "All" ? "All Assignees" : name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Result count */}
      <div className="my-5 flex items-center justify-between">
        <p className="text-sm text-[#77736B]">
          Showing{" "}
          <span className="font-semibold text-[#292925]">
            {filteredBugs.length}
          </span>{" "}
          {filteredBugs.length === 1 ? "issue" : "issues"}
        </p>

        {filtersActive && (
          <span className="rounded-full bg-[#E9E4DA] px-3 py-1 text-xs font-medium text-[#57534D]">
            Filtered results
          </span>
        )}
      </div>

      {/* Bugs container */}
      <section className="overflow-hidden rounded-2xl border border-[#E2DED5] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        {filteredBugs.length > 0 ? (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="bg-[#FAF9F6]">
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8D887F]">
                      Issue
                    </th>

                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8D887F]">
                      Severity
                    </th>

                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8D887F]">
                      Status
                    </th>

                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8D887F]">
                      Assignee
                    </th>

                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8D887F]">
                      Reporter
                    </th>

                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8D887F]">
                      Created
                    </th>

                    <th className="w-12 px-3"></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBugs.map((bug) => (
                    <tr
                      key={bug.id}
                      className="group border-t border-[#EFEBE4] transition hover:bg-[#FAF9F6]"
                    >
                      <td className="px-6 py-4">
                        <Link to={`/bugs/${bug.id}`}>
                          <p className="text-xs font-semibold text-[#918C83]">
                            {bug.id}
                          </p>

                          <p className="mt-1 max-w-[280px] truncate text-sm font-semibold text-[#292925] transition group-hover:text-black">
                            {bug.title}
                          </p>
                        </Link>
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

                      <td className="px-6 py-4 text-sm text-[#625E57]">
                        {bug.assignee}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#625E57]">
                        {bug.reporter}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[#8A857C]">
                        {bug.createdAt}
                      </td>

                      <td className="px-3">
                        <Link
                          to={`/bugs/${bug.id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#99948B] transition hover:bg-[#EDE8DF] hover:text-[#292925]"
                        >
                          <ChevronRight size={17} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile + tablet cards */}
            <div className="divide-y divide-[#ECE8E0] lg:hidden">
              {filteredBugs.map((bug) => (
                <Link
                  key={bug.id}
                  to={`/bugs/${bug.id}`}
                  className="block p-4 transition hover:bg-[#FAF9F6] sm:p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#99948B]">
                        {bug.id}
                      </p>

                      <h3 className="mt-1 truncate text-sm font-semibold text-[#292925]">
                        {bug.title}
                      </h3>
                    </div>

                    <ChevronRight
                      size={18}
                      className="shrink-0 text-[#AAA59C]"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        severityStyles[bug.severity]
                      }`}
                    >
                      {bug.severity}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        statusStyles[bug.status]
                      }`}
                    >
                      {bug.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 border-t border-[#F0ECE5] pt-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#AAA59C]">
                        Assignee
                      </p>

                      <p className="mt-1 truncate text-xs font-medium text-[#625E57]">
                        {bug.assignee}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#AAA59C]">
                        Created
                      </p>

                      <p className="mt-1 text-xs font-medium text-[#625E57]">
                        {bug.createdAt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEE8DD] text-[#514E47]">
              <Bug size={24} />
            </div>

            <h3 className="mt-4 text-base font-semibold text-[#292925]">
              No issues found
            </h3>

            <p className="mt-1 max-w-sm text-sm leading-6 text-[#817D75]">
              We couldn't find any issues matching your current search
              and filters.
            </p>

            <button
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-[#292925] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#3A3934]"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </Layout>
  );
}

export default Bugs;
