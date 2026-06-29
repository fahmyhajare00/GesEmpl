import { FileText, Plus, RotateCcw } from "lucide-react";

interface Props {
  presentiel: number;
  distanciel: number;
  reutilise: number;
  totalHours: number;
  onNew: () => void;
  onExport: () => void;
}

function Pill({ color, count, label }: { color: string; count: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-slate-800 dark:text-slate-300">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {count} {label}
    </span>
  );
}

export function QuickActions({ presentiel, distanciel, reutilise, totalHours, onNew, onExport }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-3 dark:bg-slate-900 dark:border-slate-800">
      <Pill color="bg-blue-500" count={presentiel} label="Présentiel" />
      <Pill color="bg-emerald-500" count={distanciel} label="Distanciel" />
      <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-slate-800 dark:text-slate-300">
        <RotateCcw className="h-3 w-3" />
        {reutilise} Réutiliser
      </span>
      <span className="text-sm text-gray-700 font-medium dark:text-slate-300">Σ {totalHours}h</span>
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
        >
          <FileText className="h-4 w-4" />
          PDF
        </button>
        <button
          onClick={onNew}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nouvelle séance
        </button>
      </div>
    </div>
  );
}
