import { Pencil } from "lucide-react";
import type { Seance } from "@/lib/types";

const COLORS = [
  "border-l-blue-500 bg-blue-50/40",
  "border-l-emerald-500 bg-emerald-50/40",
  "border-l-amber-500 bg-amber-50/40",
];

interface Props {
  seance: Seance;
  moduleName: string;
  filiereName: string;
  formateurName: string;
  salleName: string;
  index: number;
  compact?: boolean;
  onEdit: (s: Seance) => void;
}

export function SessionCard({ seance, moduleName, formateurName, salleName, index, compact, onEdit }: Props) {
  const color = COLORS[index % COLORS.length];
  const pending = seance.statut === "en_attente";
  return (
    <button
      onClick={() => onEdit(seance)}
      className={`group w-full text-left rounded-lg border border-gray-200 border-l-4 dark:border-slate-700${color}${ pending ? "ring-1 ring-red-300" : "" }px-2.5 py-2 hover:shadow-sm transition-shadow dark:border-slate-700`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-gray-900 truncate dark:text-slate-100">
            {moduleName} {seance.groupe}
          </div>
          <div className="text-[11px] text-gray-500 truncate font-mono dark:text-slate-400">
            {salleName} · {formateurName}
          </div>
          {pending && (
            <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-red-600">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> En attente
            </div>
          )}
        </div>
        <span className="text-gray-400 group-hover:text-blue-600 dark:text-slate-500">
          <Pencil className="h-3.5 w-3.5" />
          {!compact && <span className="sr-only">Modifier</span>}
        </span>
      </div>
    </button>
  );
}
