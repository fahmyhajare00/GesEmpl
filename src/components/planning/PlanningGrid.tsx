import { Plus } from "lucide-react";
import { CRENEAUX, JOURS, type Creneau, type Seance } from "@/lib/types";
import { SessionCard } from "./SessionCard";

interface Lookups {
  moduleName: (id: string) => string;
  filiereName: (id: string) => string;
  formateurName: (id: string) => string;
  salleName: (id: string) => string;
}

interface Props extends Lookups {
  view: "week" | "day";
  weekDates: Date[];
  selectedDay: number;
  seances: Seance[];
  onEdit: (s: Seance) => void;
  onAdd: (date: string, creneau: Creneau) => void;
}

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function Cell({
  items, onAdd, onEdit, lookups,
}: {
  items: Seance[];
  onAdd: () => void;
  onEdit: (s: Seance) => void;
  lookups: Lookups;
}) {
  if (items.length === 0) {
    return (
      <button
        onClick={onAdd}
        className="w-full h-full min-h-[88px] flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-gray-300 hover:border-blue-400 hover:text-blue-500 transition-colors dark:border-slate-700 dark:text-slate-600"
      >
        <Plus className="h-5 w-5" />
      </button>
    );
  }
  const compact = items.length > 1;
  return (
    <div className="flex flex-col gap-1.5 h-full min-h-[88px] relative">
      {compact && (
        <span className="absolute -top-2 -right-2 z-10 inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold">
          ×{items.length}
        </span>
      )}
      {items.map((s, i) => (
        <SessionCard
          key={s.id}
          seance={s}
          index={i}
          compact={compact}
          moduleName={lookups.moduleName(s.moduleId)}
          filiereName={lookups.filiereName(s.filiereId)}
          formateurName={lookups.formateurName(s.formateurId)}
          salleName={lookups.salleName(s.salleId)}
          onEdit={onEdit}
        />
      ))}
      <button
        onClick={onAdd}
        className="mt-auto text-[10px] text-gray-400 hover:text-blue-600 inline-flex items-center justify-center gap-1 rounded border border-dashed border-gray-200 py-1 dark:border-slate-700 dark:text-slate-500"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

export function PlanningGrid(props: Props) {
  const { view, weekDates, selectedDay, seances, onAdd, onEdit } = props;
  const lookups = {
    moduleName: props.moduleName,
    filiereName: props.filiereName,
    formateurName: props.formateurName,
    salleName: props.salleName,
  };

  const cellFor = (date: string, creneau: Creneau) =>
    seances.filter((s) => s.date === date && s.creneau === creneau);

  if (view === "day") {
    const date = ymd(weekDates[selectedDay]);
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 overflow-x-auto dark:bg-slate-900 dark:border-slate-800">
        <div className="grid grid-cols-4 gap-3 min-w-[720px]">
          {CRENEAUX.map((c) => (
            <div key={c.id} className="flex flex-col gap-2">
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold dark:text-slate-400">{c.label}</div>
                <div className="text-xs text-gray-400 font-mono dark:text-slate-500">{c.range}</div>
              </div>
              <Cell
                items={cellFor(date, c.id)}
                lookups={lookups}
                onAdd={() => onAdd(date, c.id)}
                onEdit={onEdit}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 overflow-x-auto dark:bg-slate-900 dark:border-slate-800">
      <div className="grid grid-cols-[120px_repeat(6,minmax(140px,1fr))] gap-2 min-w-[900px]">
        <div />
        {weekDates.map((d, i) => (
          <div key={i} className="text-center text-xs font-semibold text-gray-700 pb-2 dark:text-slate-300">
            {JOURS[i]} {d.getDate()}
          </div>
        ))}
        {CRENEAUX.map((c) => (
          <div key={c.id} className="contents">
            <div className="flex flex-col justify-center pr-2 border-r border-gray-100 dark:border-slate-800">
              <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold dark:text-slate-400">{c.label}</div>
              <div className="text-xs text-gray-400 font-mono dark:text-slate-500">{c.range}</div>
            </div>
            {weekDates.map((d, i) => {
              const date = ymd(d);
              return (
                <Cell
                  key={i}
                  items={cellFor(date, c.id)}
                  lookups={lookups}
                  onAdd={() => onAdd(date, c.id)}
                  onEdit={onEdit}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
