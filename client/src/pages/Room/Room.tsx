import { useContext, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { OnProgressProps } from 'react-player/base';
import {
  ReactReduxContext,
  ReactReduxContextValue,
  useDispatch,
  useSelector,
} from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ServerConn } from '../../lib/conn';
import { Response } from '../../lib/messages';
import {
  changeUsername,
  joinRoom,
  leaveRoom,
  newLeader,
  newUserJoined,
  newVideo,
  roomData,
  setPlay,
  setPlaying,
  setVideo,
  sync,
  userLeft,
} from '../../store/room';
import { RootState } from '../../store/store';
import {
  disableRoomBar,
  disableVideoPrompt,
  enableRoomBar,
} from '../../store/ui';
import Alert from '../../ui/modals/alert/Alert';
import Prompt from '../../ui/modals/prompt/Prompt';
import './Room.css';
import { setMsgCb } from '../../lib/connMiddleware';
import { Unsubscribe } from '@reduxjs/toolkit';
import Player from "./Player/Player";

const Room = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [showNotFound, setNotFound] = useState(false);

  const showVideoSelector = useSelector(
    (state: RootState) => state.ui.videoPrompt.show
  );
  const { store } =
    useContext<ReactReduxContextValue<RootState>>(ReactReduxContext);
  const roomLoadFailed = useSelector((state: RootState) => state.room.roomLoadFailed);



  const initRoom = () => {
    const roomCode = params['code'] as string;
    if(!store.getState().room.roomLoaded) {
      dispatch(joinRoom(roomCode));
    }
    dispatch(enableRoomBar());
  };



  useEffect(() => {

    if(store.getState().room.roomLoadFailed === true) {
      console.log("RoomLoadFailed")
      return;
    }
    console.log(params['code']);

    initRoom();

    return () => {
      setMsgCb(undefined);
      dispatch(disableRoomBar());
      dispatch(leaveRoom());

    };
  }, [roomLoadFailed]);





  const changeVideoCb = (res: string) => {
    if (res === '') {
      return;
    }
    dispatch(setVideo(res))
    dispatch(disableVideoPrompt());
  };

  return (
    <>
      {
        roomLoadFailed &&
      <Alert
        show={true}
        text="Room not found"
        buttontext="Ok."
        onClickBtn={() => navigate('/')}
      />
      }
      <Prompt
        show={showVideoSelector}
        question={'Video link:'}
        closable={true}
        callback={changeVideoCb}
        close={() => dispatch(disableVideoPrompt())}
      />
      <div className="player-container">
        <Player />
      </div>
    </>
  );
};

export default Room;
