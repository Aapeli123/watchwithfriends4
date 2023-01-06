import { configureStore } from '@reduxjs/toolkit';
import connMiddleware from '../lib/connMiddleware';
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
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware().concat([connMiddleware]);
  },
});

export type RootState = ReturnType<typeof store.getState>;
