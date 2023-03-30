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
  setPlaying,
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

const Room = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const videoLink = useSelector((state: RootState) => state.room.videoId);
  const navigate = useNavigate();
  const playing = useSelector((state: RootState) => state.room.playing);
  const username = useSelector((state: RootState) => state.pref.username);
  const leader_id = useSelector((state: RootState) => state.room.leaderId);
  const userid = useSelector((state: RootState) => state.conn.userID);
  
  const [unsubTime, setUnsubTime] = useState<Unsubscribe | null>(null);
  
  const [showNotFound, setNotFound] = useState(false);

  const showVideoSelector = useSelector(
    (state: RootState) => state.ui.videoPrompt.show
  );
  const { store } =
    useContext<ReactReduxContextValue<RootState>>(ReactReduxContext);

  const onProgress = (state: OnProgressProps) => {
    // const isLeader = store.getState().room.leaderId === store.getState().conn.userID;
    if (isLeader()) dispatch();// props.conn.syncTime(state.playedSeconds);
  };

  const playerRef = useRef<ReactPlayer>(null);

  const initRoom = async () => {
    const roomCode = params['code'] as string;
    const unsub = store.subscribe(timeChangeHandler);
    setUnsubTime(unsub);
    if(!store.getState().room.roomLoaded) {
      dispatch(joinRoom(roomCode));
    }
/* 
    try {
      // await conn.joinRoom(roomCode, username);
    } catch (msg) {
      if (msg === 'Room not found') {
        setNotFound(true);
        return;
      }
      console.log(
        'Already in the room, joined from RoomCodeInput or Create room'
      );
    }
    try {
      console.log('Requesting room data');
      const data = await conn.roomData();
      dispatch(roomData(data)); 
    } catch {}
    props.conn.addMessageCallback(msgHandler);
    setMsgCb(msgHandler);
    dispatch(enableRoomBar());
    */
  };

  const isLeader = () => store.getState().conn.userID === store.getState().room.leaderId;
    

  useEffect(() => {
    console.log(params['code']);

    // initRoom();

    return () => {
      setMsgCb(undefined);
      dispatch(disableRoomBar());
      dispatch(leaveRoom());
      if(unsubTime !== null) {
        unsubTime();
      };
    };
  }, []);

  const timeChangeHandler = () => {
    if(!isLeader()) return;
    const curTime = store.getState().room.time;
    
  };

  const onPlay = () => {
    if (!playing) {
      props.conn.setPlay(true);
    }
  };

  const onPause = () => {
    if (playing) {
      props.conn.setPlay(false);
    }
  };

  const changeVideoCb = (res: string) => {
    if (res === '') {
      return;
    }
    props.conn.setVideo(res);
    dispatch(disableVideoPrompt());
  };

  return (
    <>
      <Alert
        show={showNotFound}
        text="Room not found"
        buttontext="Ok."
        onClickBtn={() => navigate('/')}
      />
      <Prompt
        show={showVideoSelector}
        question={'Video link:'}
        closable={true}
        callback={changeVideoCb}
        close={() => dispatch(disableVideoPrompt())}
      />
      <div className="player-container">
        {videoLink === null && (
          <>
            <h1>No video loaded yet...</h1>
            {leader_id === userid && (
              <h1>To load a video, click change video</h1>
            )}
          </>
        )}
        {videoLink !== null && (
          <ReactPlayer
            url={videoLink}
            width={'100%'}
            ref={playerRef}
            playing={playing}
            onPlay={onPlay}
            onPause={onPause}
            onProgress={onProgress}
            height="100%"
            controls
            autoPlay={true}
            loop={true}
          />
        )}
      </div>
    </>
  );
};

export default Room;
