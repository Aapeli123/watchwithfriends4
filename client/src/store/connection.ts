import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConnState {
  connected: boolean;
  isConnecting: boolean;
  userID: string;
}

const initialState: ConnState = {
  connected: false,
  isConnecting: false,
  userID: '',
};

const connSlice = createSlice({
  initialState: initialState,
  name: 'connection',
  reducers: {
    startConnecting: state => {
      state.isConnecting = true;
    },
    connected: (state, action: PayloadAction<string>) => {
      state.isConnecting = false;
      state.connected = true;
      state.userID = action.payload;
    },
    disconnect: (state) => {
      state.connected = false;
    }
  },
});

export default connSlice.reducer;

export const { startConnecting, connected, disconnect } = connSlice.actions;
