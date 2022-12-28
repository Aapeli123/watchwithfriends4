import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    roomBar: false,
    unPrompt: { show: false, closable: true },
    videoPrompt: { show: false },
  },
  reducers: {
    enableRoomBar(state) {
      state.roomBar = true;
    },
    disableRoomBar(state) {
      state.roomBar = false;
    },

    showUnSelector(state) {
      state.unPrompt.show = true;
    },
    hideUnSelector(state) {
      state.unPrompt.show = false;
    },

    setUnSelectorClosable(state, action: PayloadAction<boolean>) {
      state.unPrompt.closable = action.payload;
    },

    showVideoPrompt(state) {
      state.videoPrompt.show = true;
    },
    disableVideoPrompt(state) {
      state.videoPrompt.show = false;
    },
  },
});

export default uiSlice.reducer;
export const {
  enableRoomBar,
  disableRoomBar,
  showUnSelector,
  hideUnSelector,
  showVideoPrompt,
  disableVideoPrompt,
  setUnSelectorClosable,
} = uiSlice.actions;
