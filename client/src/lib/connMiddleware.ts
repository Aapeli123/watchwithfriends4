import { Middleware } from '@reduxjs/toolkit';
import { redirect, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { connected, startConnecting } from '../store/connection';
import {
  changeUsername,
  createFailed,
  createRoom,
  createSuccess,
  joinFailed,
  joinRoom,
  joinSuccess,
  leaveRoom,
  makeLeader,
  newLeader,
  newUserJoined,
  newVideo,
  roomData,
  setPlay,
  setPlaying,
  setTime,
  setVideo,
  sync,
  userLeft,
} from '../store/room';
import { RootState } from '../store/store';
import connect, { ServerConn } from './conn';
import { Response } from './messages';
const serverURL = 'ws://localhost:8080';
let msgCallback: ((msg: Response.WsResponse) => void) | undefined = undefined;

const setMsgCb = (cb: ((msg: Response.WsResponse) => void) | undefined) => {
  msgCallback = cb;
};
const connMiddleware: Middleware = store => {
  let connection: ServerConn;
  const onMessage = (msg: Response.WsResponse) => {
    if (msg.type !== Response.MessageType.Pong) console.log(msg);
    switch (msg.type) {
      case Response.MessageType.NewUserConnected:
        store.dispatch(
          newUserJoined(msg.message as Response.NewUserConnectedResp)
        );
        break;
      case Response.MessageType.UserLeft:
        store.dispatch(userLeft(msg.message as Response.UserLeft));
        break;
      case Response.MessageType.NewLeader:
        store.dispatch(newLeader(msg.message as Response.NewLeader));
        break;
      case Response.MessageType.SetPlay:
        store.dispatch(setPlaying(msg.message as Response.SetPlay));
        break;
      case Response.MessageType.NewVideo:
        store.dispatch(newVideo(msg.message as Response.NewVideo));
        break;
      case Response.MessageType.UserChangedName:
        store.dispatch(changeUsername(msg.message as Response.UserChangedName));
        break;
      case Response.MessageType.RoomData:
        let roomdata = msg.message as Response.RoomDataResp;
        redirect(`/room/${roomdata.room.code}`);
        store.dispatch(roomData(roomdata));
        break;
      case Response.MessageType.JoinRoom:
        let joinroom = msg.message as Response.JoinRoomResp;
        if (!joinroom.success) {
          toast(joinroom.message, { theme: 'dark', type: 'error' });
          break;
        }
      case Response.MessageType.Sync:
        let syncmsg = msg.message as Response.Sync;
        store.dispatch(setTime(syncmsg));
    }
    if (msgCallback !== undefined) msgCallback(msg);
  };

  return next => async action => {
    next(action);
    if (startConnecting.match(action)) {
      connection = await connect(serverURL);
      connection.addMessageCallback(onMessage);
      store.dispatch(connected(connection.user_id));
      console.log(connection);
    } else if (joinRoom.match(action)) {
      try {
        await connection.joinRoom(
          action.payload,
          store.getState().pref.username
        );
        await connection.roomData();
        store.dispatch(joinSuccess());
      } catch {
        store.dispatch(joinFailed());
      }
    } else if (createRoom.match(action)) {
      console.log('Creating room');
      try {
        let res = await connection.createRoom(action.payload.username);
        // console.log(res.success);
        if (!res.success) {
          store.dispatch(createFailed());
          return;
        }
        console.log('Room created...');
        store.dispatch(createSuccess(res));
        connection.roomData();
      } catch (err) {
        store.dispatch(createFailed());
        console.log(err);
      }
    } else if (leaveRoom.match(action)) {
      connection.leaveRoom();
    } else if (makeLeader.match(action)) {
      connection.makeLeader(action.payload);
    } else if (sync.match(action)) {
      connection.syncTime(action.payload);
    } else if (setPlay.match(action)) {
      connection.setPlay(action.payload);
    } else if (setVideo.match(action)) {
      connection.setVideo(action.payload);
    } else {
    }
  };
};

export default connMiddleware;
export { setMsgCb };
