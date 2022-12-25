import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Response } from "../lib/messages";

const roomSlice = createSlice({
    name: "roomData",
    initialState: {
        videoId: "",
        playing: false,
        leaderId: "",
        roomCode: "",
        users: {} as {[key: string]: {name: string}},
        time: 0,
        roomLoaded: false,
    },
    reducers: {
        roomData: (state, action: PayloadAction<Response.RoomDataResp>) => {
            const {code, leader_id, playing,time,users,video_id} = action.payload.room;
            state.videoId = video_id as string;
            state.playing = playing;
            state.leaderId = leader_id;
            state.roomCode = code;
            state.users = users;
            state.time = time;
            state.roomLoaded = true;
        },
        leaveRoom: (state) => {
            state.roomLoaded = false;
        },
        newLeader: (state, action: PayloadAction<Response.NewLeader>) => {
            state.leaderId = action.payload.leader_id;
        },
        newUserJoined: (state, action: PayloadAction<Response.NewUserConnectedResp>) => {
            state.users[action.payload.user[0]] = {name: action.payload.user[1]};
        },
        userLeft: (state, action: PayloadAction<Response.UserLeft>) => {
            delete state.users[action.payload.user];
        },
        newVideo: (state, action: PayloadAction<Response.NewVideo>) => {
            state.videoId = action.payload.video_id;
        },
        setPlaying: (state, action: PayloadAction<Response.SetPlay>) => {
            state.playing = action.payload.playing;
        },
        setTime: (state, action: PayloadAction<Response.Sync>) => {
            if(state.time - action.payload.time > 0.5) {
                state.time = action.payload.time
            }
        },
    }
});


export default roomSlice.reducer;

export const { roomData, leaveRoom, newLeader, newUserJoined, userLeft, newVideo, setPlaying, setTime } = roomSlice.actions;