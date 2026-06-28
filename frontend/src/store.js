import { configureStore, createSlice } from '@reduxjs/toolkit';
import { defaultConfig } from './config';

function getMondayKey(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

const currentWeekKey = getMondayKey(new Date());

function loadConfig() {
  try {
    const saved = localStorage.getItem('gesempl_config');
    if (saved) return { ...defaultConfig, ...JSON.parse(saved) };
  } catch {}
  return { ...defaultConfig };
}

function saveConfig(cfg) {
  try { localStorage.setItem('gesempl_config', JSON.stringify(cfg)); } catch {}
}

function loadSessions() {
  try {
    const saved = localStorage.getItem('gesempl_sessions');
    if (saved) {
      const list = JSON.parse(saved);
      return list.map(s => {
        if (!s.day) s.day = 'Lundi';
        if (s.slotIdx === undefined || s.slotIdx === null) s.slotIdx = 0;
        return s;
      });
    }
  } catch {}
  return [
    { id: 991, module: "Dev FrontEnd", formateur: "A. Karim", salle: "Salle 4", pole: "DIA", type: "presentiel", day: "Lundi", slotIdx: 1, weekKey: currentWeekKey, status: "pending" },
    { id: 992, module: "Design UI/UX", formateur: "S. Rami", pole: "DIA", type: "distanciel", day: "Jeudi", slotIdx: 2, weekKey: currentWeekKey, status: "pending" }
  ];
}

function saveSessions(sessions) {
  try { localStorage.setItem('gesempl_sessions', JSON.stringify(sessions)); } catch {}
}

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    user: { name: "MED Med", role: "CHEF DE PÔLE" },
    config: loadConfig(),
    sessions: loadSessions(),
  },
  reducers: {
    addSession: (state, action) => {
      state.sessions.push({ ...action.payload, status: action.payload.status || 'confirmed' });
      saveSessions(state.sessions);
    },
    removeSession: (state, action) => {
      state.sessions = state.sessions.filter(s => s.id !== action.payload);
      saveSessions(state.sessions);
    },
    moveSession: (state, action) => {
      const { id, day, slotIdx } = action.payload;
      const session = state.sessions.find(s => s.id === id);
      if (session) {
        session.day = day;
        session.slotIdx = slotIdx;
        saveSessions(state.sessions);
      }
    },
    acceptSession: (state, action) => {
      const session = state.sessions.find(s => s.id === action.payload);
      if (session) {
        session.status = 'confirmed';
        saveSessions(state.sessions);
      }
    },
    updateConfig: (state, action) => {
      state.config = { ...state.config, ...action.payload };
      saveConfig(state.config);
    },
    addToConfig: (state, action) => {
      const { key, value } = action.payload;
      if (Array.isArray(state.config[key]) && value && !state.config[key].includes(value)) {
        state.config[key].push(value);
        saveConfig(state.config);
      }
    },
    removeFromConfig: (state, action) => {
      const { key, value } = action.payload;
      if (Array.isArray(state.config[key])) {
        state.config[key] = state.config[key].filter(v => v !== value);
        saveConfig(state.config);
      }
    },
  }
});

export const {
  addSession, removeSession, moveSession, acceptSession,
  updateConfig, addToConfig, removeFromConfig
} = scheduleSlice.actions;

export const store = configureStore({
  reducer: { schedule: scheduleSlice.reducer },
});