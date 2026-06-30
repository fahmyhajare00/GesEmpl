import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setStoreData } from './store';
import { fetchDataFromApi } from './apiService';

import Schedule from './pages/Schedule';
import Modules from './pages/Modules';
import Formateurs from './pages/Formateurs';
import Salles from './pages/Salles';
import Groupes from './pages/Groupes';
import Layout from "./Layout";

import GestionnaireStagiaire from "./pages/GestionnaireStagiaire";
import AbsencesFormateurs from "./pages/AbsencesFormateurs";
import LoginTest from "./pages/LoginTest";
import StagiaireInterface from "./pages/StagiaireInterface";
import FormateurInterface from "./pages/FormateurInterface";
import DirecteurPedagogique from "./pages/DirecteurPedagogique";
import PlaceholderPage from "./pages/PlaceholderPage";
import MonProfil from "./pages/MonProfil";
import MesModules from "./pages/MesModules";
import VueMensuelle from "./pages/VueMensuelle";
import AbsencesMissions from "./pages/AbsencesMissions";
import EmploisGroupes from "./pages/EmploisGroupes";

function App() {
  const [role, setRole] = useState(null); // 'chef_de_pole', 'gestionnaire_stagiaire', 'stagiaire', 'formateur_user', 'directeur_pedagogique'
  const dispatch = useDispatch();

  useEffect(() => {
    // Appeler la vraie API au chargement de l'application
    fetchDataFromApi().then(data => {
      dispatch(setStoreData(data));
    });
  }, [dispatch]);

  // Si aucun rôle n'est sélectionné, on affiche la page de connexion
  if (!role) {
    return <LoginTest onLogin={setRole} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {role === 'chef_de_pole' && (
          <Route path="/" element={<Layout role={role} onLogout={() => setRole(null)} />}>
            <Route index element={<Schedule />} />
            <Route path="modules" element={<Modules />} />
            <Route path="formateurs" element={<Formateurs />} />
            <Route path="salles" element={<Salles />} />
            <Route path="groupes" element={<Groupes />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}

        {role === 'gestionnaire_stagiaire' && (
          <Route path="/" element={<Layout role={role} onLogout={() => setRole(null)} />}>
            <Route index element={<GestionnaireStagiaire />} />
            <Route path="absences-formateurs" element={<AbsencesFormateurs />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}

        {role === 'stagiaire' && (
          <Route path="/" element={<Layout role={role} onLogout={() => setRole(null)} />}>
            <Route index element={<StagiaireInterface />} />
            <Route path="mes-modules" element={<MesModules />} />
            <Route path="vue-mensuelle" element={<VueMensuelle />} />
            <Route path="mon-profil" element={<MonProfil />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}

        {role === 'formateur_user' && (
          <Route path="/" element={<Layout role={role} onLogout={() => setRole(null)} />}>
            <Route index element={<FormateurInterface />} />
            <Route path="absences-missions" element={<AbsencesMissions />} />
            <Route path="emplois-groupes" element={<EmploisGroupes />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}

        {role === 'directeur_pedagogique' && (
          <Route path="/" element={<Layout role={role} onLogout={() => setRole(null)} />}>
            <Route index element={<DirecteurPedagogique />} />
            <Route path="planning" element={<Schedule />} />
            <Route path="modules" element={<Modules />} />
            <Route path="formateurs" element={<Formateurs />} />
            <Route path="salles" element={<Salles />} />
            <Route path="groupes" element={<Groupes />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;