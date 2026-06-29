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
    <section className="view-panel">
      <div className="view-header">
        <h2 className="view-title">Vue mensuelle</h2>
      </div>

      <div className="calendar-container">
        <div className="calendar-row calendar-header-row">
          {weekdays.map((day) => (
            <div key={day} className="calendar-header-cell">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {days.map((day) => (
            <div key={day} className="calendar-day">
              <div className="calendar-day-number">{day}</div>
              <div className="calendar-badges">
                {(dayEvents[day] || []).map((event) => (
                  <span
                    key={event.label}
                    className={`calendar-badge ${event.type}`}
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
