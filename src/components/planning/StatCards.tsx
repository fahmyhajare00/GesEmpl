interface StatCard {
  label: string;
  value: number;
  alert?: boolean;
}

export function StatCards({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 dark:bg-slate-900 dark:border-slate-800${ s.alert ? "border-l-4 border-l-red-500" : "" }dark:bg-slate-900 dark:border-slate-800`}
        >
          <div className="text-[11px] uppercase tracking-wider text-gray-500 font-medium dark:text-slate-400">
            {s.label}
          </div>
          <div
            className={`mt-2 text-3xl font-bold ${ s.alert ? "text-red-500" : "text-blue-600" }`}
          >
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}
