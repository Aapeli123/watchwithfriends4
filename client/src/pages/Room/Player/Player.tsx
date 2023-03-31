import ReactPlayer from "react-player";
import {ReactReduxContext, ReactReduxContextValue, useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/store";
import {setPlay, sync} from "../../../store/room";
import {useContext, useEffect, useRef, useState} from "react";
import {OnProgressProps} from "react-player/base";

const Player = () => {
    const dispatch = useDispatch();
    const videoLink = useSelector((state: RootState) => state.room.videoId);
    const leader_id = useSelector((state: RootState) => state.room.leaderId);
    const userid = useSelector((state: RootState) => state.conn.userID);
    const time = useSelector((state: RootState) => state.room.time);
    const playing = useSelector((state: RootState) => state.room.playing);

    const [prevTime, setPrevTime] = useState(time);

    const { store } =
        useContext<ReactReduxContextValue<RootState>>(ReactReduxContext);
    const isLeader = () => store.getState().conn.userID === store.getState().room.leaderId;

    const onPlay = () => {
        if (!playing) {
            dispatch(setPlay(true))
        }
    };

    const onPause = () => {
        if (playing) {
            dispatch(setPlay(false));
        }
    };

    const onProgress = (state: OnProgressProps) => {
        // const isLeader = store.getState().room.leaderId === store.getState().conn.userID;
        if (isLeader()) dispatch(sync(state.playedSeconds));// props.conn.syncTime(state.playedSeconds);
    };

    const playerRef = useRef<ReactPlayer>(null);

    useEffect(() => {
        if(playerRef.current === null) return;

        const curTime = playerRef.current.getCurrentTime();
        if(Math.abs(time - curTime) >= 0.5) playerRef.current.seekTo(time, "seconds");
    }, [time])

    return (
        <>
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
        </>
    )

}

export default Player;