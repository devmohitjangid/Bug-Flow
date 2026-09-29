import { Link } from "react-router-dom";
import {
  ArrowRight,
  ExternalLink,
  Plus,
  UserRound,
  LayoutGrid,
  ShieldCheck,
  LockKeyhole,
  RotateCcw,
  CheckCheck,
  Play,
  Wrench,
} from "lucide-react";

import Layout from "../components/Layout";
import { useBugs } from "../context/BugContext";
import { useRole } from "../context/RoleContext";

const STATUSES = [
  "Open",
  "Assigned",
  "In Progress",
  "Fixed",
  "Closed",
];

const severityStyles = {
  Critical: "bg-[#F4E4E2] text-[#8B3D37]",
  High: "bg-[#F4E9DE] text-[#925B32]",
  Medium: "bg-[#F1EEDC] text-[#756A31]",
  Low: "bg-[#E7EEE4] text-[#536A4A]",
};

const columnStyles = {
  Open: {
    dot: "bg-[#8B8177]",
    header: "bg-[#F0ECE6]",
  },
  Assigned: {
    dot: "bg-[#817B70]",
    header: "bg-[#EFECE5]",
  },
  "In Progress": {
    dot: "bg-[#6E776F]",
    header: "bg-[#EBECE8]",
  },
  Fixed: {
    dot: "bg-[#607258]",
    header: "bg-[#E9EEE6]",
  },
  Closed: {
    dot: "bg-[#77736B]",
    header: "bg-[#ECEAE6]",
  },
};

function Kanban() {
  const { bugs, updateBug } = useBugs();
  const { role, currentUser } = useRole();

  // Only the assigned developer can work on an issue.
  const isAssignedDeveloper = (bug) => {
    return (
      role === "Developer" &&
      bug.assignee === currentUser.name
    );
  };

  // Determine which actions the current role can perform.
  const getAvailableActions = (bug) => {
    const actions = [];

    // Manager: Open -> Assigned is performed
    // through the assignment control in Bug Details.
    if (role === "Manager") {
      if (bug.status === "Open") {
        actions.push({
          label: "Assign Developer",
          type: "navigate",
          icon: UserRound,
        });
      }

      return actions;
    }

    // Developer: Assigned -> In Progress
    if (
      isAssignedDeveloper(bug) &&
      bug.status === "Assigned"
    ) {
      actions.push({
        label: "Start Progress",
        type: "status",
        nextStatus: "In Progress",
        icon: Play,
      });
    }

    // Developer: In Progress -> Fixed
    if (
      isAssignedDeveloper(bug) &&
      bug.status === "In Progress"
    ) {
      actions.push({
        label: "Mark as Fixed",
        type: "status",
        nextStatus: "Fixed",
        icon: Wrench,
      });
    }

    // Tester: Fixed -> Closed
    if (role === "Tester" && bug.status === "Fixed") {
      actions.push({
        label: "Verify & Close",
        type: "status",
        nextStatus: "Closed",
        icon: CheckCheck,
      });

      // Optional reopen workflow.
      actions.push({
        label: "Reopen Issue",
        type: "status",
        nextStatus: "In Progress",
        icon: RotateCcw,
        secondary: true,
      });
    }

    return actions;
  };

  // Validate transitions again when a button is clicked.
  const handleAction = (bug, action) => {
    if (action.type !== "status") return;

    const allowed = getAvailableActions(bug).some(
      (availableAction) =>
        availableAction.type === "status" &&
        availableAction.nextStatus === action.nextStatus
    );

    if (!allowed) return;

    updateBug(bug.id, {
      status: action.nextStatus,
    });
  };

  const getRoleDescription = () => {
    if (role === "Manager") {
      return "Assign open issues to developers. Development and verification actions are restricted to their respective roles.";
    }

    if (role === "Developer") {
      return `You can move issues assigned to ${currentUser.name} from Assigned to In Progress, and then to Fixed.`;
    }

    return "Verify fixed issues, close successful fixes, or reopen issues that still need work.";
  };

  return (
    <Layout>
      {/* Page Header */}
      <section className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#99948B]">
            Issue Management / Workflow
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-[#22221F] sm:text-3xl">
            Kanban Board
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#77736B]">
            Track issues through their lifecycle with
            role-based workflow controls.
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#292925] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#3A3934]"
        >
          <Plus size={17} />
          Report Bug
        </Link>
      </section>

      {/* Summary */}
      <section className="mb-5 flex flex-col gap-4 rounded-2xl border border-[#E2DED5] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEE8DD] text-[#514E47]">
            <LayoutGrid size={20} />
          </div>

          <div>
            <p className="text-sm font-semibold text-[#35332F]">
              Issue Workflow
            </p>

            <p className="mt-0.5 text-xs text-[#99948B]">
              {bugs.length} total issues across 5 stages
            </p>
          </div>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-xl bg-[#F0ECE4] px-3.5 py-2.5">
          <ShieldCheck
            size={17}
            className="text-[#68645D]"
          />

          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#99948B]">
              Active Role
            </p>

            <p className="text-xs font-semibold text-[#35332F]">
              {role} · {currentUser.name}
            </p>
          </div>
        </div>
      </section>

      {/* Permission Information */}
      <section className="mb-5 flex items-start gap-3 rounded-xl border border-[#DED8CE] bg-[#EEE8DD] px-4 py-3.5">
        <LockKeyhole
          size={17}
          className="mt-0.5 shrink-0 text-[#625E57]"
        />

        <div>
          <p className="text-sm font-semibold text-[#45423D]">
            {role} Permissions
          </p>

          <p className="mt-1 text-xs leading-5 text-[#77736B]">
            {getRoleDescription()}
          </p>
        </div>
      </section>

      {/* Kanban Board */}
      <div className="-mx-4 overflow-x-auto px-4 pb-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex min-w-max gap-4">
          {STATUSES.map((status) => {
            const columnBugs = bugs.filter(
              (bug) => bug.status === status
            );

            const style = columnStyles[status];

            return (
              <section
                key={status}
                className="w-[285px] shrink-0 sm:w-[300px]"
              >
                {/* Column Header */}
                <div
                  className={`mb-3 rounded-xl px-4 py-3.5 ${style.header}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${style.dot}`}
                      />

                      <h2 className="text-sm font-semibold text-[#403D38]">
                        {status}
                      </h2>
                    </div>

                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white/80 px-2 text-[11px] font-semibold text-[#68645D]">
                      {columnBugs.length}
                    </span>
                  </div>
                </div>

                {/* Column Content */}
                <div className="min-h-[490px] rounded-2xl border border-[#E2DED5] bg-[#EFEBE4]/60 p-3">
                  {columnBugs.length === 0 ? (
                    <div className="flex min-h-[170px] items-center justify-center rounded-xl border border-dashed border-[#D7D1C7] bg-white/40 px-5 text-center">
                      <div>
                        <p className="text-xs font-medium text-[#8A857C]">
                          No issues
                        </p>

                        <p className="mt-1 text-[11px] leading-5 text-[#AAA59C]">
                          Issues will appear here when
                          they reach this stage.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {columnBugs.map((bug) => {
                        const actions =
                          getAvailableActions(bug);

                        return (
                          <article
                            key={bug.id}
                            className="group rounded-xl border border-[#E0DCD4] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(35,33,28,0.07)]"
                          >
                            {/* ID + Severity */}
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#99948B]">
                                {bug.id}
                              </span>

                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  severityStyles[
                                    bug.severity
                                  ] || severityStyles.Low
                                }`}
                              >
                                {bug.severity}
                              </span>
                            </div>

                            {/* Issue Title */}
                            <Link
                              to={`/bugs/${bug.id}`}
                              className="mt-3 block"
                            >
                              <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-[#292925] transition group-hover:text-black">
                                {bug.title}
                              </h3>
                            </Link>

                            {/* Assignee */}
                            <div className="mt-4 flex items-center gap-2">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EEE8DD] text-[#57534D]">
                                <UserRound size={13} />
                              </div>

                              <span className="truncate text-xs text-[#77736B]">
                                {bug.assignee}
                              </span>
                            </div>

                            <div className="my-4 h-px bg-[#EFEAE3]" />

                            {/* Role-Based Actions */}
                            {actions.length > 0 ? (
                              <div className="space-y-2">
                                {actions.map((action) => {
                                  const Icon = action.icon;

                                  if (
                                    action.type === "navigate"
                                  ) {
                                    return (
                                      <Link
                                        key={action.label}
                                        to={`/bugs/${bug.id}`}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#292925] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#3A3934]"
                                      >
                                        <Icon size={14} />
                                        {action.label}
                                        <ArrowRight size={13} />
                                      </Link>
                                    );
                                  }

                                  return (
                                    <button
                                      key={action.label}
                                      type="button"
                                      onClick={() =>
                                        handleAction(
                                          bug,
                                          action
                                        )
                                      }
                                      className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
                                        action.secondary
                                          ? "border border-[#DDD8CE] bg-white text-[#514E47] hover:bg-[#EEE8DD]"
                                          : "bg-[#292925] text-white hover:bg-[#3A3934]"
                                      }`}
                                    >
                                      <Icon size={14} />
                                      {action.label}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 rounded-lg bg-[#F7F5F0] px-3 py-2.5">
                                <LockKeyhole
                                  size={13}
                                  className="shrink-0 text-[#99948B]"
                                />

                                <p className="text-[11px] leading-4 text-[#8A857C]">
                                  No actions available for
                                  your current role.
                                </p>
                              </div>
                            )}

                            {/* View Details */}
                            <Link
                              to={`/bugs/${bug.id}`}
                              className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#77736B] transition hover:text-[#292925]"
                            >
                              View Issue
                              <ExternalLink size={12} />
                            </Link>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

export default Kanban;