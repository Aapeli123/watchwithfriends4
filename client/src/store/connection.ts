import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConnState {
  connected: boolean;
  isConnecting: boolean;
}

const initialState: ConnState = {
  connected: false,
  isConnecting: false,
};

const connSlice = createSlice({
  initialState: initialState,
  name: 'connection',
  reducers: {
    startConnecting: state => {
      state.isConnecting = true;
    },
    connected: state => {
      state.isConnecting = false;
      state.connected = true;
    },
  },
});

export default connSlice.reducer;

export const {} = connSlice.actions;
