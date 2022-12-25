import { createAction, createReducer, createSlice } from "@reduxjs/toolkit";



const uiSlice = createSlice({
    name: "ui",
    initialState: {
        roomBar: false,
    },
    reducers: {
        enableRoomBar(state) {
            state.roomBar = true
        },
        disableRoomBar(state) {
            state.roomBar = false
        }
    }
})

export default uiSlice.reducer;
export const { enableRoomBar, disableRoomBar } = uiSlice.actions;