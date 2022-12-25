import { createAction, createReducer, createSlice } from "@reduxjs/toolkit";



const uiSlice = createSlice({
    name: "ui",
    initialState: {
        roomBar: false,
    },
    reducers: {
        enableRoomBar(state, action) {
            state.roomBar = true
        },
        disableRoomBar(state, action) {
            state.roomBar = false
        }
    }
})

export default uiSlice.reducer;
export const { enableRoomBar, disableRoomBar } = uiSlice.actions;