const weekdays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

type EventDot = {
  label: string
  type: 'presentiel' | 'distanciel'
}

const dayEvents: Record<number, EventDot[]> = {
  2: [{ label: 'Compta', type: 'presentiel' }],
  4: [{ label: 'Gestion', type: 'distanciel' }],
  8: [{ label: 'Fiscalité', type: 'presentiel' }],
  15: [{ label: 'Anglais', type: 'distanciel' }],
  21: [{ label: 'Informatique', type: 'presentiel' }],
}

export default function MonthlyView() {
  const days = Array.from({ length: 35 }, (_, index) => index + 1)

  return (
    <section className="mt-[18px] p-[18px] rounded-[22px] border border-border-color bg-bg-card [box-shadow:0_24px_60px_rgba(15,23,42,0.12)] transition-all duration-250 dark:[box-shadow:0_30px_80px_rgba(0,0,0,0.25)]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-[18px]">
        <h2 className="m-0 text-[20px] font-bold text-text-main">Vue mensuelle</h2>
      </div>

      <div className="grid gap-3.5">
        <div className="grid grid-cols-7 gap-2.5 items-center">
          {weekdays.map((day) => (
            <div key={day} className="p-[10px_12px] rounded-[16px] bg-slate-900/4 dark:bg-white/4 text-text-secondary text-[12px] font-bold uppercase tracking-[0.16em] text-center">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2.5">
          {days.map((day) => (
            <div key={day} className="min-h-[98px] p-3 rounded-[22px] border border-border-color bg-bg-card flex flex-col gap-2.5">
              <div className="text-[14px] font-bold text-text-main">{day}</div>
              <div className="flex flex-wrap gap-1.5">
                {(dayEvents[day] || []).map((event) => (
                  <span
                    key={event.label}
                    className={`w-2.5 h-2.5 rounded-full inline-block ${
                      event.type === 'presentiel' 
                        ? 'bg-[#ddf8e4] dark:bg-[#1f6f3f]' 
                        : 'bg-[#d9f0ff] dark:bg-[#205b95]'
                    }`}
                    title={event.label}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}