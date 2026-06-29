import { useState } from "react";
import {
  Calendar, Users, Building2, School, User as UserIcon, BookOpen,
  ClipboardList, ShieldCheck, BarChart3, Download, Menu,
} from "lucide-react";
import type { Permissions } from "@/lib/permissions";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hidden?: boolean;
}

interface Section {
  label: string;
  items: NavItem[];
}

export function Sidebar({ permissions }: { permissions: Permissions }) {
  const [active, setActive] = useState("emploi");
  const [expanded, setExpanded] = useState(false);

  const sections: Section[] = [
    {
      label: "PLANNING",
      items: [
        { id: "emploi", label: "Emploi du temps", icon: Calendar },
        { id: "groupes", label: "Groupes / Filières", icon: Users },
      ],
    },
    {
      label: "RESSOURCES",
      items: [
        { id: "poles", label: "Pôles", icon: Building2 },
        { id: "salles", label: "Salles / Espaces", icon: School },
        { id: "formateurs", label: "Formateurs", icon: UserIcon },
        { id: "modules", label: "Modules", icon: BookOpen },
      ],
    },
    {
      label: "ADMINISTRATION",
      items: [
        { id: "affectations", label: "Affectations", icon: ClipboardList },
        { id: "users", label: "Utilisateurs & rôles", icon: ShieldCheck, hidden: !permissions.showUsersRoles },
        { id: "rapports", label: "Rapports", icon: BarChart3, hidden: !permissions.showReports },
        { id: "exports", label: "Exports", icon: Download, hidden: !permissions.showExports },
      ],
    },
  ].filter((s) => s.label !== "ADMINISTRATION" || permissions.showAdministration);

  return (
    <aside
      className={`${expanded ? "w-56" : "w-16"} shrink-0 bg-slate-900 text-slate-200 flex flex-col transition-all duration-200 sticky top-0 h-screen`}
    >
      <button
        onClick={() => setExpanded((e) => !e)}
        className="h-14 flex items-center justify-center text-slate-400 hover:text-white border-b border-slate-800"
        aria-label="Basculer la barre latérale"
      >
        <Menu className="h-5 w-5" />
      </button>
      <nav className="flex-1 overflow-y-auto py-3">
        {sections.map((section) => {
          const visible = section.items.filter((i) => !i.hidden);
          if (visible.length === 0) return null;
          return (
            <div key={section.label} className="mb-4">
              {expanded && (
                <div className="px-4 mb-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                  {section.label}
                </div>
              )}
              <ul className="space-y-1 px-2">
                {visible.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActive(item.id)}
                        title={item.label}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {expanded && <span className="truncate">{item.label}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
