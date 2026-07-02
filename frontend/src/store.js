import { configureStore, createSlice } from '@reduxjs/toolkit';
import { defaultConfig } from './config';

function getMondayKey(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dStr = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dStr}`;
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
  return [];
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
      state.sessions = state.sessions.filter(s => String(s.id) !== String(action.payload));
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
    rejectSession: (state, action) => {
      const session = state.sessions.find(s => s.id === action.payload);
      if (session) {
        session.status = 'refusee';
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
    setStoreData: (state, action) => {
      state.config = action.payload.config;
      state.sessions = action.payload.sessions;
    },
    setSessions: (state, action) => {
      state.sessions = action.payload;
      saveSessions(state.sessions);
    },
    duplicateWeek: (state, action) => {
      const { sourceWeekKey, targetWeekKey } = action.payload;
      const sessionsToCopy = state.sessions.filter(s => s.weekKey === sourceWeekKey);
      const copiedSessions = sessionsToCopy.map(s => ({
        ...s,
        id: Date.now() + Math.floor(Math.random() * 10000),
        weekKey: targetWeekKey,
        status: 'validee'
      }));
      state.sessions = [...state.sessions, ...copiedSessions];
      saveSessions(state.sessions);
    },
  }
});

export const { addSession, removeSession, moveSession, acceptSession, rejectSession, updateConfig, addToConfig, removeFromConfig, setStoreData, setSessions, duplicateWeek } = scheduleSlice.actions;

export const store = configureStore({
  reducer: { schedule: scheduleSlice.reducer },
});