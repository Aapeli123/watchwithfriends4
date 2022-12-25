import { Action, createReducer, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Response } from "../lib/messages";

const roomSlice = createSlice({
    name: "roomData",
    initialState: {
        videoId: "",
        playing: false,
        leaderId: "",
        roomCode: "",
        users: {},
        roomLoaded: false
    },
    reducers: {
        roomData: (state, action: PayloadAction<Response.RoomDataResp>) => {
            const {code, leader_id, playing,time,users,video_id} = action.payload.room;
            state.videoId = video_id as string;
            state.playing = playing;
            state.leaderId = leader_id;
            state.roomCode = code;
            state.users = users;
            state.roomLoaded = true;
        },
        leaveRoom: (state) => {
            state.roomLoaded = false;
        },
        newLeader: (state, action: PayloadAction<Response.NewLeader>) => {
            state.leaderId = action.payload.leader_id;
        }
    }
});


export default roomSlice.reducer;