import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatCards } from "@/components/planning/StatCards";
import { FilterBar, type FilterValues } from "@/components/planning/FilterBar";
import { QuickActions } from "@/components/planning/QuickActions";
import { WeekNav } from "@/components/planning/WeekNav";
import { PlanningGrid } from "@/components/planning/PlanningGrid";
import { SessionModal } from "@/components/planning/SessionModal";
import {
  currentUser, filieres as filieresData, formateurs as formateursData,
  modules as modulesData, poles as polesData, salles as sallesData,
  seances as seancesData,
} from "@/lib/mock-data";
import { PERMISSIONS } from "@/lib/permissions";
import type { Creneau, Seance } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GESEMPL — Gestion d'emploi du temps" },
      { name: "description", content: "Application de gestion d'emploi du temps de formation : séances, formateurs, salles et filières." },
      { property: "og:title", content: "GESEMPL — Gestion d'emploi du temps" },
      { property: "og:description", content: "Application de gestion d'emploi du temps de formation : séances, formateurs, salles et filières." },
    ],
  }),
  component: Index,
});

function startOfWeek(d: Date) {
  const date = new Date(d);
  const day = date.getDay(); // 0 sun .. 6 sat
  const diff = (day === 0 ? -6 : 1 - day);
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function Index() {
  const user = currentUser;
  const perms = PERMISSIONS[user.role];

  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date("2026-05-25")));
  const [selectedDay, setSelectedDay] = useState(0);
  const [view, setView] = useState<"week" | "day">("week");
  const [filters, setFilters] = useState<FilterValues>({
    poleId: perms.scopedToPole ? (user.poleId ?? "") : "",
    moduleId: "", annee: "", filiereId: "", formateurId: "", salleId: "",
  });
  const [allSeances, setAllSeances] = useState<Seance[]>(seancesData);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Seance> | undefined>(undefined);

  const weekDates = useMemo(
    () => Array.from({ length: 6 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  // Scope by role
  const scopedPoles = perms.scopedToPole ? polesData.filter((p) => p.id === user.poleId) : polesData;
  const scopedFilieres = perms.scopedToPole ? filieresData.filter((f) => f.poleId === user.poleId) : filieresData;
  const filiereIds = new Set(scopedFilieres.map((f) => f.id));
  const scopedModules = modulesData.filter((m) => filiereIds.has(m.filiereId));
  const scopedFormateurs = perms.scopedToPole ? formateursData.filter((f) => f.poleId === user.poleId) : formateursData;
  const scopedSalles = perms.scopedToPole ? sallesData.filter((s) => s.poleId === user.poleId) : sallesData;

  const filteredSeances = useMemo(() => {
    const start = weekDates[0];
    const end = addDays(weekDates[5], 1);
    return allSeances.filter((s) => {
      const d = new Date(s.date);
      if (d < start || d >= end) return false;
      if (perms.scopedToPole) {
        const filiere = filieresData.find((f) => f.id === s.filiereId);
        if (!filiere || filiere.poleId !== user.poleId) return false;
      }
      if (filters.poleId) {
        const filiere = filieresData.find((f) => f.id === s.filiereId);
        if (!filiere || filiere.poleId !== filters.poleId) return false;
      }
      if (filters.moduleId && s.moduleId !== filters.moduleId) return false;
      if (filters.filiereId && s.filiereId !== filters.filiereId) return false;
      if (filters.formateurId && s.formateurId !== filters.formateurId) return false;
      if (filters.salleId && s.salleId !== filters.salleId) return false;
      return true;
    });
  }, [allSeances, weekDates, filters, perms.scopedToPole, user.poleId]);

  const stats = useMemo(() => {
    const formateursActifs = new Set(filteredSeances.map((s) => s.formateurId)).size;
    const sallesUtilisees = new Set(filteredSeances.map((s) => s.salleId)).size;
    const aAccepter = filteredSeances.filter((s) => s.statut === "en_attente").length;
    return [
      { label: "Formateurs actifs", value: formateursActifs },
      { label: "Séances cette semaine", value: filteredSeances.length },
      { label: "Salles utilisées", value: sallesUtilisees },
      { label: "Séances à accepter", value: aAccepter, alert: true },
    ];
  }, [filteredSeances]);

  const presentiel = filteredSeances.filter((s) => s.mode === "presentiel").length;
  const distanciel = filteredSeances.filter((s) => s.mode === "distanciel").length;
  const reutilise = filteredSeances.filter((s) => s.mode === "reutilise").length;
  const totalHours = filteredSeances.length * 2.5;

  const moduleName = (id: string) => modulesData.find((m) => m.id === id)?.name ?? "—";
  const filiereName = (id: string) => filieresData.find((f) => f.id === id)?.name ?? "—";
  const formateurName = (id: string) => formateursData.find((f) => f.id === id)?.name ?? "—";
  const salleName = (id: string) => sallesData.find((s) => s.id === id)?.name ?? "—";

  const openNew = () => { setEditing({ date: `${weekDates[0].toISOString().slice(0, 10)}` }); setModalOpen(true); };
  const openEdit = (s: Seance) => { setEditing(s); setModalOpen(true); };
  const openAt = (date: string, creneau: Creneau) => {
    setEditing({ date, creneau });
    setModalOpen(true);
  };
  const save = (data: Omit<Seance, "id" | "statut"> & { id?: string }) => {
    setAllSeances((prev) => {
      if (data.id) {
        return prev.map((s) => (s.id === data.id ? { ...s, ...data, id: s.id, statut: s.statut } : s));
      }
      const newSeance: Seance = { ...data, id: `se${Date.now()}`, statut: "en_attente" };
      return [...prev, newSeance];
    });
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex dark:bg-slate-950">
      <Sidebar permissions={perms} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar user={user} />
        <main className="flex-1 p-4 md:p-6 space-y-4">
          <StatCards stats={stats} />
          <FilterBar
            values={filters}
            onChange={setFilters}
            poles={scopedPoles}
            modules={scopedModules}
            filieres={scopedFilieres}
            formateurs={scopedFormateurs}
            salles={scopedSalles}
            lockedPoleId={perms.scopedToPole ? user.poleId : undefined}
          />
          <QuickActions
            presentiel={presentiel}
            distanciel={distanciel}
            reutilise={reutilise}
            totalHours={totalHours}
            onNew={openNew}
            onExport={() => window.print()}
          />
          <WeekNav
            weekDates={weekDates}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            onPrev={() => setWeekStart((d) => addDays(d, -7))}
            onNext={() => setWeekStart((d) => addDays(d, 7))}
            view={view}
            onViewChange={setView}
          />
          <PlanningGrid
            view={view}
            weekDates={weekDates}
            selectedDay={selectedDay}
            seances={filteredSeances}
            onAdd={openAt}
            onEdit={openEdit}
            moduleName={moduleName}
            filiereName={filiereName}
            formateurName={formateurName}
            salleName={salleName}
          />
        </main>
      </div>
      <SessionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={save}
        initial={editing}
        modules={scopedModules}
        filieres={scopedFilieres}
        formateurs={scopedFormateurs}
        salles={scopedSalles}
      />
    </div>
  );
}
