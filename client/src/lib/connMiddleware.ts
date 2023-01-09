import { Middleware } from '@reduxjs/toolkit';
import { redirect, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { connected, startConnecting } from '../store/connection';
import { changeUsername, joinFailed, joinRoom, newLeader, newUserJoined, newVideo, roomData, setPlaying, userLeft } from '../store/room';
import { RootState } from '../store/store';
import connect, { ServerConn } from './conn';
import { Response } from './messages';
const serverURL = 'ws://localhost:8080';
let msgCallback: ((msg: Response.WsResponse)=> void) | undefined = undefined;

const setMsgCb = (cb: ((msg: Response.WsResponse) => void ) | undefined ) => {
  msgCallback = cb;
}
const connMiddleware: Middleware = store => {
  let connection: ServerConn;
  const onMessage = (msg: Response.WsResponse) => {
    console.log(msg);
    switch(msg.type) {
      case Response.MessageType.NewUserConnected:
        store.dispatch(newUserJoined(msg.message as Response.NewUserConnectedResp));
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
        redirect(`/room/${roomdata.room.code}`)
        store.dispatch(roomData(roomdata));
        break;
      case Response.MessageType.JoinRoom:
        let joinroom = msg.message as Response.JoinRoomResp;
        if(!joinroom.success) {
          toast(joinroom.message, {theme: 'dark', type: 'error'});
          break;
        }
        

    }
    if(msgCallback !== undefined) msgCallback(msg);
  }

  return next => async action => {
    if (startConnecting.match(action)) {
      connection = await connect(serverURL);
      connection.addMessageCallback(onMessage)
      next(action);
      store.dispatch(connected());
      console.log(connection);
    } else if (joinRoom.match(action)) {
      try {await connection.joinRoom(action.payload, store.getState().pref.username)} catch {
        store.dispatch(joinFailed())
      };
      next(action);
    } else {
      next(action);
    }
  };
};

export default connMiddleware;
export {setMsgCb};