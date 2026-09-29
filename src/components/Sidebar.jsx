import { NavLink } from "react-router-dom";
import { useRole } from "../context/RoleContext";
import {
  LayoutDashboard,
  Bug,
  KanbanSquare,
  Plus,
  X,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "All Bugs", path: "/bugs", icon: Bug },
  { name: "Kanban Board", path: "/kanban", icon: KanbanSquare },
  { name: "Report Bug", path: "/report", icon: Plus },
];

function Sidebar({ isOpen, onClose }) {
  const { role, currentUser } = useRole();
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-[270px]
          flex-col bg-[#1C1C1A] text-white
          transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEE8DD] text-[#1C1C1A]">
              <Bug size={21} strokeWidth={2.2} />
            </div>

            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                BugFlow
              </h1>
              <p className="text-[11px] text-[#9B978F]">
                Issue Management
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#AAA69E] hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-7">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#77736D]">
            Workspace
          </p>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition-all ${
                      isActive
                        ? "bg-[#EEE8DD] font-semibold text-[#1C1C1A]"
                        : "text-[#AAA69E] hover:bg-white/[0.06] hover:text-white"
                    }`
                  }
                >
                  <Icon size={18} strokeWidth={2} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User */}
        <div className="mx-4 mb-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
          <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E7E0D3] text-xs font-bold text-[#252522]">
  {currentUser.initials}
</div>

<div className="min-w-0">
  <p className="truncate text-sm font-medium text-white">
    {currentUser.name}
  </p>

  <p className="text-xs text-[#8F8B84]">
    {role}
  </p>
</div>
          </div>
        </div>

      </aside>
    </>
  );
}

export default Sidebar;
