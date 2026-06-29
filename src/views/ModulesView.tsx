const modules = [
  { name: 'Arabe', mht: 20, coef: 1, efm: 'NON' },
  { name: 'Français', mht: 115, coef: 2, efm: 'NON' },
  { name: 'Anglais technique', mht: 50, coef: 2, efm: 'NON' },
  { name: 'Culture entrepreneuriale', mht: 30, coef: 1, efm: 'NON' },
  { name: 'Compétences comportementales', mht: 30, coef: 2, efm: 'NON' },
  { name: 'Entrepreneuriat-PIE 1', mht: 72, coef: 1, efm: 'NON' },
  { name: 'Culture et techniques avancées du numérique', mht: 40, coef: 1, efm: 'NON' },
  { name: 'Métier et formation', mht: 30, coef: 1, efm: 'NON' },
  { name: 'Droit fondamental', mht: 60, coef: 1, efm: 'NON' },
  { name: 'Management des organisations', mht: 90, coef: 3, efm: 'OUI' },
  { name: 'Comptabilité générale 1', mht: 120, coef: 3, efm: 'OUI' },
  { name: 'Gestion électronique des données', mht: 40, coef: 1, efm: 'NON' },
  { name: 'Marketing', mht: 90, coef: 3, efm: 'OUI' },
  { name: 'Comptabilité générale 2', mht: 70, coef: 2, efm: 'OUI' },
  { name: 'Écrits professionnels', mht: 60, coef: 1, efm: 'NON' },
  { name: 'Statistique', mht: 80, coef: 2, efm: 'NON' },
  { name: 'Logiciel de Gestion Commerciale, Comptable', mht: 60, coef: 1, efm: 'NON' },
]

export default function ModulesView() {
  return (
    <section className="mt-[18px] p-[18px] rounded-[22px] border border-border-color bg-bg-card [box-shadow:0_24px_60px_rgba(15,23,42,0.12)] transition-all duration-250 dark:[box-shadow:0_30px_80px_rgba(0,0,0,0.25)]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-[18px]">
        <h2 className="m-0 text-[20px] font-bold text-text-main">Mes modules</h2>
      </div>

      <div className="w-full overflow-x-auto mt-4">
        <table className="w-full border-collapse min-w-[720px]">
          <thead>
            <tr>
              <th className="text-left font-bold text-[13px] uppercase tracking-[0.08em] p-4 border-b border-border-light text-text-secondary">Module</th>
              <th className="text-left font-bold text-[13px] uppercase tracking-[0.08em] p-4 border-b border-border-light text-text-secondary">MHT</th>
              <th className="text-left font-bold text-[13px] uppercase tracking-[0.08em] p-4 border-b border-border-light text-text-secondary">Coef</th>
              <th className="text-left font-bold text-[13px] uppercase tracking-[0.08em] p-4 border-b border-border-light text-text-secondary">EFM Régional</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => (
              <tr key={module.name} className="bg-bg-card odd:bg-bg-card/80">
                <td className="p-4 border-b border-border-light text-text-main text-[14px] min-w-[260px]">{module.name}</td>
                <td className="p-4 border-b border-border-light text-text-main text-[14px]">{module.mht}</td>
                <td className="p-4 border-b border-border-light text-text-main text-[14px]">{module.coef}</td>
                <td className="p-4 border-b border-border-light text-text-main text-[14px]">{module.efm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}