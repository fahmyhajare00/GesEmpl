import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import GroupesFilieresPage from './pages/GroupesFilieresPage';
import SallesEspacesPage from './pages/SallesEspacesPage';
import FormateursPage from './pages/FormateursPage';
import ModulesPage from './pages/ModulesPage';
import AffectationsPage from './pages/AffectationsPage';

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <Router>
          <Routes>
            {/* Redirection automatique vers dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Routes de l'application (auth retirée pour le groupe backend) */}
            <Route path="/" element={<Layout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="groupes" element={<GroupesFilieresPage />} />
              <Route path="salles" element={<SallesEspacesPage />} />
              <Route path="formateurs" element={<FormateursPage />} />
              <Route path="modules" element={<ModulesPage />} />
              <Route path="affectations" element={<AffectationsPage />} />
            </Route>

            {/* Redirection pour les routes inconnues */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
