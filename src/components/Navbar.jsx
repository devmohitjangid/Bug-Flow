import {
  Menu,
  Search,
  LogOut,
} from "lucide-react";

import { useRole } from "../context/RoleContext";

function Navbar({ onMenuClick }) {
  const { role, currentUser, currentOrganization, logout } = useRole();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#E4E0D8] bg-[#F5F3EE]/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD8CE] bg-white text-[#34332F] transition hover:bg-[#EEE8DD] lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="relative hidden sm:block sm:w-64 xl:w-80">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8880]"
          />

          <input
            type="text"
            placeholder="Search bugs..."
            className="w-full rounded-xl border border-[#DDD8CE] bg-white py-2.5 pl-10 pr-4 text-sm text-[#292925] outline-none transition placeholder:text-[#A6A198] focus:border-[#AAA399] focus:ring-2 focus:ring-[#DED8CC]/60"
          />
        </div>

        <div className="sm:hidden">
          <p className="text-base font-semibold text-[#242421]">
            BugFlow
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden h-7 w-px bg-[#DDD8CE] lg:block" />

        {/* User */}
        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#292925] text-xs font-semibold text-white">
            {currentUser.initials}
          </div>

          <div className="hidden xl:block">
            <p className="text-sm font-semibold text-[#292925]">
              {currentUser.name}
            </p>

            <p className="text-xs text-[#827E76]">
              {role} {currentOrganization ? `· ${currentOrganization.name}` : ""}
            </p>
          </div>
        </div>

        <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl border border-[#DCD7CE] bg-white px-3 py-2.5 text-xs font-semibold text-[#514E47] transition hover:bg-[#EEE8DD] sm:text-sm" title="Logout">
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
