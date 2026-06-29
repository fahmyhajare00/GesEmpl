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
    <section className="view-panel">
      <div className="view-header">
        <h2 className="view-title">Mes modules</h2>
      </div>

      <div className="modules-table-wrap">
        <table className="modules-table">
          <thead>
            <tr>
              <th>Module</th>
              <th>MHT</th>
              <th>Coef</th>
              <th>EFM Régional</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => (
              <tr key={module.name}>
                <td>{module.name}</td>
                <td>{module.mht}</td>
                <td>{module.coef}</td>
                <td>{module.efm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
