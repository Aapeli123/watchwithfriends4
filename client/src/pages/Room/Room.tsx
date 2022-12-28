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

const Room = (props: { conn: ServerConn }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const videoLink = useSelector((state: RootState) => state.room.videoId);
  const navigate = useNavigate();
  const playing = useSelector((state: RootState) => state.room.playing);
  const username = useSelector((state: RootState) => state.pref.username);
  const leader_id = useSelector((state: RootState) => state.room.leaderId);

  const [showNotFound, setNotFound] = useState(false);

  const showVideoSelector = useSelector(
    (state: RootState) => state.ui.videoPrompt.show
  );
  const { store } =
    useContext<ReactReduxContextValue<RootState>>(ReactReduxContext);

  const onProgress = (state: OnProgressProps) => {
    const isLeader = store.getState().room.leaderId === props.conn.user_id;
    if (isLeader) props.conn.syncTime(state.playedSeconds);
  };

  const playerRef = useRef<ReactPlayer>(null);

  const initRoom = async () => {
    const roomCode = params['code'] as string;
    const { conn } = props;

    try {
      await conn.joinRoom(roomCode, username);
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
    dispatch(enableRoomBar());
  };

  useEffect(() => {
    console.log(params['code']);

    initRoom();

    return () => {
      props.conn.leaveRoom();
      props.conn.removeCallback();
      dispatch(disableRoomBar());
      dispatch(leaveRoom());
    };
  }, []);

  const msgHandler = (msg: Response.WsResponse) => {
    console.log(msg.message);
    switch (msg.type) {
      case Response.MessageType.NewUserConnected:
        dispatch(newUserJoined(msg.message as Response.NewUserConnectedResp));
        break;
      case Response.MessageType.UserLeft:
        dispatch(userLeft(msg.message as Response.UserLeft));
        break;
      case Response.MessageType.Sync:
        let syncMsg = msg.message as Response.Sync;
        const isLeader = store.getState().room.leaderId === props.conn.user_id;
        if (
          Math.abs(
            (playerRef.current?.getCurrentTime() as number) - syncMsg.time
          ) >= 0.75 &&
          !isLeader
        )
          playerRef.current?.seekTo(syncMsg.time);
        break;
      case Response.MessageType.NewLeader:
        dispatch(newLeader(msg.message as Response.NewLeader));
        break;
      case Response.MessageType.SetPlay:
        dispatch(setPlaying(msg.message as Response.SetPlay));
        break;
      case Response.MessageType.NewVideo:
        dispatch(newVideo(msg.message as Response.NewVideo));
        break;
      case Response.MessageType.UserChangedName:
        dispatch(changeUsername(msg.message as Response.UserChangedName));
        break;
    }
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
            {leader_id === props.conn.user_id && (
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
