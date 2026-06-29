import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CRENEAUX, type Creneau, type Mode, type Seance } from "@/lib/types";
import type { Filiere, Formateur, Module, Salle } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (s: Omit<Seance, "id" | "statut"> & { id?: string }) => void;
  initial?: Partial<Seance>;
  modules: Module[];
  filieres: Filiere[];
  formateurs: Formateur[];
  salles: Salle[];
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-[10px] uppercase tracking-wider text-gray-500 font-medium dark:text-slate-400">{children}</label>;
}

function input(extra = "") {
  return `bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-950 dark:border-slate-700${extra}`;
}

export function SessionModal({ open, onClose, onSave, initial, modules, filieres, formateurs, salles }: Props) {
  const [form, setForm] = useState({
    id: initial?.id,
    moduleId: initial?.moduleId ?? modules[0]?.id ?? "",
    filiereId: initial?.filiereId ?? filieres[0]?.id ?? "",
    formateurId: initial?.formateurId ?? formateurs[0]?.id ?? "",
    salleId: initial?.salleId ?? salles[0]?.id ?? "",
    date: initial?.date ?? "",
    creneau: (initial?.creneau ?? CRENEAUX[0].id) as Creneau,
    mode: (initial?.mode ?? "presentiel") as Mode,
    groupe: initial?.groupe ?? "G1",
  });

  useEffect(() => {
    if (open) {
      setForm({
        id: initial?.id,
        moduleId: initial?.moduleId ?? modules[0]?.id ?? "",
        filiereId: initial?.filiereId ?? filieres[0]?.id ?? "",
        formateurId: initial?.formateurId ?? formateurs[0]?.id ?? "",
        salleId: initial?.salleId ?? salles[0]?.id ?? "",
        date: initial?.date ?? "",
        creneau: (initial?.creneau ?? CRENEAUX[0].id) as Creneau,
        mode: (initial?.mode ?? "presentiel") as Mode,
        groupe: initial?.groupe ?? "G1",
      });
    }
  }, [open, initial, modules, filieres, formateurs, salles]);

  if (!open) return null;

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            {form.id ? "Modifier la séance" : "Nouvelle séance"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label>Module</Label>
            <select className={input()} value={form.moduleId} onChange={(e) => set("moduleId", e.target.value)}>
              {modules.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Filière</Label>
            <select className={input()} value={form.filiereId} onChange={(e) => set("filiereId", e.target.value)}>
              {filieres.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Formateur</Label>
            <select className={input()} value={form.formateurId} onChange={(e) => set("formateurId", e.target.value)}>
              {formateurs.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Salle</Label>
            <select className={input()} value={form.salleId} onChange={(e) => set("salleId", e.target.value)}>
              {salles.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Date</Label>
            <input type="date" className={input()} value={form.date} onChange={(e) => set("date", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Créneau horaire</Label>
            <select className={input()} value={form.creneau} onChange={(e) => set("creneau", e.target.value as Creneau)}>
              {CRENEAUX.map((c) => <option key={c.id} value={c.id}>{c.range} ({c.label})</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Mode</Label>
            <select className={input()} value={form.mode} onChange={(e) => set("mode", e.target.value as Mode)}>
              <option value="presentiel">Présentiel</option>
              <option value="distanciel">Distanciel</option>
              <option value="reutilise">Réutiliser</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Groupe</Label>
            <input className={input()} value={form.groupe} onChange={(e) => set("groupe", e.target.value)} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(form)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
