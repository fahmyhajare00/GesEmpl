import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Schedule from './pages/Schedule';
import Modules from './pages/Modules';
import Formateurs from './pages/Formateurs';
import Salles from './pages/Salles';
import Groupes from './pages/Groupes';
import Layout from "./Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Schedule />} />
          <Route path="modules" element={<Modules />} />
          <Route path="formateurs" element={<Formateurs />} />
          <Route path="salles" element={<Salles />} />
          <Route path="groupes" element={<Groupes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;