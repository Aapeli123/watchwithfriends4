import { createReducer, createSlice } from "@reduxjs/toolkit";
import { Response } from "../lib/messages";

const roomSlice = createSlice({
    name: "roomData",
    initialState: {
        isLeader: false,
        videoId: "",
        playing: false,
        leaderId: "",
        users: {}
    },
    reducers: {
        roomData: (state, action) => {
            action.payload as Response.RoomDataResp;

        }
    }
});


export default roomSlice.reducer;