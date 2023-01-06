import { configureStore } from '@reduxjs/toolkit';
import connectionReducer from './connection';
import prefsReducer from './prefs';
import roomReducer from './room';
import uiReducer from './ui';

export const store = configureStore({
  reducer: {
    room: roomReducer,
    ui: uiReducer,
    pref: prefsReducer,
    conn: connectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
