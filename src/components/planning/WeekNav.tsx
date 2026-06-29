import { ChevronLeft, ChevronRight } from "lucide-react";
import { JOURS } from "@/lib/types";

interface Props {
  weekDates: Date[];
  selectedDay: number; // index 0..5
  onSelectDay: (i: number) => void;
  onPrev: () => void;
  onNext: () => void;
  view: "week" | "day";
  onViewChange: (v: "week" | "day") => void;
}

function fmtRange(dates: Date[]) {
  const start = dates[0];
  const end = dates[dates.length - 1];
  const months = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];
  return `${start.getDate()} ${months[start.getMonth()]} – ${end.getDate()} ${months[end.getMonth()]}`;
}

export function WeekNav({ weekDates, selectedDay, onSelectDay, onPrev, onNext, view, onViewChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={onPrev}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
        >
          <ChevronLeft className="h-4 w-4" />
          Semaine précédente
        </button>
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">{fmtRange(weekDates)}</div>
          <div className="inline-flex rounded-full bg-gray-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => onViewChange("week")}
              className={`px-3 py-1 text-xs font-medium rounded-full${view === "week" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"}`}
            >
              Semaine
            </button>
            <button
              onClick={() => onViewChange("day")}
              className={`px-3 py-1 text-xs font-medium rounded-full${view === "day" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"}`}
            >
              Jour
            </button>
          </div>
        </div>
        <button
          onClick={onNext}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
        >
          Semaine suivante
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {weekDates.map((d, i) => {
          const active = i === selectedDay && view === "day";
          return (
            <button
              key={i}
              onClick={() => { onSelectDay(i); onViewChange("day"); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border${ active ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50" }dark:border-slate-700 dark:text-slate-300`}
            >
              {JOURS[i]} {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
