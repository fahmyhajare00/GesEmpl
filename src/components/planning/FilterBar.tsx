export interface FilterValues {
  poleId: string;
  moduleId: string;
  annee: string;
  filiereId: string;
  formateurId: string;
  salleId: string;
}

import type { Filiere, Formateur, Module, Pole, Salle } from "@/lib/types";

interface Props {
  values: FilterValues;
  onChange: (v: FilterValues) => void;
  poles: Pole[];
  modules: Module[];
  filieres: Filiere[];
  formateurs: Formateur[];
  salles: Salle[];
  lockedPoleId?: string;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <label className="text-[10px] uppercase tracking-wider text-gray-500 font-medium dark:text-slate-400">
        {label}
      </label>
      {children}
    </div>
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-950 dark:border-slate-700"
    />
  );
}

export function FilterBar({
  values, onChange, poles, modules, filieres, formateurs, salles, lockedPoleId,
}: Props) {
  const filteredFilieres = values.poleId
    ? filieres.filter((f) => f.poleId === values.poleId)
    : filieres;
  const filiereIds = new Set(filteredFilieres.map((f) => f.id));
  const filteredModules = modules.filter((m) => filiereIds.has(m.filiereId));
  const filteredFormateurs = values.poleId
    ? formateurs.filter((f) => f.poleId === values.poleId)
    : formateurs;
  const filteredSalles = values.poleId
    ? salles.filter((s) => s.poleId === values.poleId)
    : salles;

  const set = (key: keyof FilterValues) => (e: React.ChangeEvent<HTMLSelectElement>) =>
    onChange({ ...values, [key]: e.target.value });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 dark:bg-slate-900 dark:border-slate-800">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Field label="Pôle">
          <Select value={values.poleId} onChange={set("poleId")} disabled={!!lockedPoleId}>
            <option value="">Tous les pôles</option>
            {poles.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Module">
          <Select value={values.moduleId} onChange={set("moduleId")}>
            <option value="">Tous les modules</option>
            {filteredModules.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Année">
          <Select value={values.annee} onChange={set("annee")}>
            <option value="">Toutes les années</option>
            <option value="1">1ère année</option>
            <option value="2">2ème année</option>
          </Select>
        </Field>
        <Field label="Filière">
          <Select value={values.filiereId} onChange={set("filiereId")}>
            <option value="">Toutes les filières</option>
            {filteredFilieres.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Formateur">
          <Select value={values.formateurId} onChange={set("formateurId")}>
            <option value="">Tous les formateurs</option>
            {filteredFormateurs.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Salle">
          <Select value={values.salleId} onChange={set("salleId")}>
            <option value="">Toutes les salles</option>
            {filteredSalles.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Select>
        </Field>
      </div>
    </div>
  );
}
