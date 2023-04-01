import { Middleware } from '@reduxjs/toolkit';
import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import {connected, connectionFailed, disconnect, startConnecting} from '../store/connection';
import {
  changeName,
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
        }
        break;
      case Response.MessageType.Sync:
        let syncmsg = msg.message as Response.Sync;
        store.dispatch(setTime(syncmsg));
        break;
    }
    if (msgCallback !== undefined) msgCallback(msg);
  };

  return next => async action => {
    next(action);
    if (startConnecting.match(action)) {
      try {
        connection = await connect(action.payload);
      } catch (err) {
        console.log("Err: " + err);
        store.dispatch(connectionFailed());
        return;
      }
      connection.addMessageCallback(onMessage);
      store.dispatch(connected(connection.user_id));
    } else if (disconnect.match(action)) {
      connection.disconnect();
      console.log("Disconnected...")
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
      try {
        let res = await connection.createRoom(action.payload.username);
        if (!res.success) {
          store.dispatch(createFailed());
          return;
        }
        store.dispatch(createSuccess(res));
        await connection.roomData();
      } catch (err) {
        store.dispatch(createFailed());
        console.log(err);
      }
    } else if (leaveRoom.match(action)) {
      await connection.leaveRoom();
    } else if (makeLeader.match(action)) {
      await connection.makeLeader(action.payload);
    } else if (sync.match(action)) {
      await connection.syncTime(action.payload);
    } else if (setPlay.match(action)) {
      await connection.setPlay(action.payload);
    } else if (setVideo.match(action)) {
      await connection.setVideo(action.payload);
    } else if (changeName.match(action)) {
      await connection.changeUsername(action.payload);
    } else {
    }
  };
};

export default connMiddleware;
export { setMsgCb };
