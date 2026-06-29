import type { User } from "@/lib/types";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar({ user }: { user: User }) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4 md:px-6 dark:bg-slate-900 dark:border-slate-700">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-md bg-teal-600 text-white flex items-center justify-center font-bold">
          G
        </div>
        <span className="font-semibold tracking-tight text-gray-900 dark:text-slate-100">GESEMPL</span>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium text-gray-900 leading-tight dark:text-slate-100">{user.name}</div>
          <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-slate-400">{user.roleLabel}</div>
        </div>
        <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          {user.initial}
        </div>
      </div>
    </header>
  );
}
