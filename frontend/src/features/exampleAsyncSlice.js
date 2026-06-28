import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
export const fetchSessionsFromApi = createAsyncThunk(
    'example/fetchSessions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/sessions');
            return response.data; 
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const addSessionToApi = createAsyncThunk(
    'example/addSession',
    async (sessionData, { rejectWithValue }) => {
        try {
            const response = await api.post('/sessions', sessionData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const exampleAsyncSlice = createSlice({
    name: 'exampleAsync',
    initialState: {
        sessions: [],
        status: 'idle', 
        error: null
    },
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
           
            .addCase(fetchSessionsFromApi.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSessionsFromApi.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.sessions = action.payload; // On met à jour le state avec les données du backend
            })
            .addCase(fetchSessionsFromApi.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            
            // Gérer addSessionToApi
            .addCase(addSessionToApi.fulfilled, (state, action) => {
                // Laravel renverra la session créée (avec son ID), on l'ajoute au state
                state.sessions.push(action.payload);
            });
    }
});

export default exampleAsyncSlice.reducer;
