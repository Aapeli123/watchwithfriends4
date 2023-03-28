import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Response, Sendable } from '../lib/messages';

const roomSlice = createSlice({
  name: 'roomData',
  initialState: {
    videoId: '',
    playing: false,
    leaderId: '',
    roomCode: '',
    users: {} as { [key: string]: { name: string } },
    time: 0,
    roomLoaded: false,
    roomLoading: false,
  },
  reducers: {
    joinRoom: (state, action: PayloadAction<string>) => {
      state.roomLoading = true;
    },

    joinFailed: state => {
      state.roomLoading = false;
    },
    createRoom: (state, action: PayloadAction<Sendable.CreateRoom>) => {},
    roomData: (state, action: PayloadAction<Response.RoomDataResp>) => {
      const { code, leader_id, playing, time, users, video_id } =
        action.payload.room;
      state.videoId = video_id as string;
      state.playing = playing;
      state.leaderId = leader_id;
      state.roomCode = code;
      state.users = users;
      state.time = time;
      state.roomLoaded = true;
      state.roomLoading = false;
    },
    leaveRoom: state => {
      state.roomLoaded = false;
    },
    newLeader: (state, action: PayloadAction<Response.NewLeader>) => {
      state.leaderId = action.payload.leader_id;
    },
    newUserJoined: (
      state,
      action: PayloadAction<Response.NewUserConnectedResp>
    ) => {
      state.users[action.payload.user[0]] = { name: action.payload.user[1] };
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
      state.time = action.payload.time;
    },
    changeUsername: (
      state,
      action: PayloadAction<Response.UserChangedName>
    ) => {
      state.users[action.payload.user_id] = { name: action.payload.new_name };
    },
  },
});

export default roomSlice.reducer;

export const {
  joinRoom,
  roomData,
  leaveRoom,
  newLeader,
  newUserJoined,
  userLeft,
  newVideo,
  setPlaying,
  setTime,
  changeUsername,
  joinFailed,
  createRoom,
} = roomSlice.actions;
