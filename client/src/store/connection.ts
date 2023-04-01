import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConnState {
  connected: boolean;
  isConnecting: boolean;
  connectionFailed: boolean;
  userID: string;
}

const initialState: ConnState = {
  connected: false,
  isConnecting: false,
  userID: '',
  connectionFailed: false,
};

const connSlice = createSlice({
  initialState: initialState,
  name: 'connection',
  reducers: {
    startConnecting: state => {
      state.isConnecting = true;
      state.connectionFailed = false;
    },
    connected: (state, action: PayloadAction<string>) => {
      state.isConnecting = false;
      state.connected = true;
      state.userID = action.payload;
    },
    connectionFailed: (state) => {
      state.connectionFailed = true;
      state.isConnecting = false;
      state.connected = false;
    },
    disconnect: (state) => {
      state.connected = false;
    }
  },
});

export default connSlice.reducer;

export const { startConnecting, connected, disconnect ,connectionFailed} = connSlice.actions;
