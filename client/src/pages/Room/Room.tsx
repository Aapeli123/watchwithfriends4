import React, { useEffect } from "react";
import ReactPlayer from 'react-player'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ServerConn } from "../../lib/conn";
import { Response } from "../../lib/messages";
import { changeUsername, leaveRoom, newLeader, newUserJoined, newVideo, roomData, setPlaying, setTime, userLeft } from "../../store/room";
import { RootState } from "../../store/store";
import { disableRoomBar, enableRoomBar } from "../../store/ui";
import "./Room.css"

const Room = (props: {conn: ServerConn}) => {
    const params = useParams();
    const dispatch = useDispatch();
    const videoLink = useSelector((state: RootState) => state.room.videoId);
    const navigate = useNavigate();
    const playing  = useSelector((state: RootState) => state.room.playing);
    const username = useSelector((state: RootState) => state.pref.username);

    const initRoom = async () => {
        const roomCode = params["code"] as string;
        const {conn} = props;
        try {
            await conn.joinRoom(roomCode, username);
        } catch(msg) {
            if(msg === "Room not found") {
                alert("Room not found.");
                navigate("/");
                return;
            }
            console.log("Already in the room, joined from RoomCodeInput or Create room");
        }
        try {
            console.log("Requesting room data")
            const data = await conn.roomData();
            dispatch(roomData(data));
        } catch(err) {
            console.log(err)
        }
        props.conn.addMessageCallback(msgHandler);
        dispatch(enableRoomBar());

    }

    useEffect(() => {
        console.log(params["code"]);

        initRoom();

        return () => {
            props.conn.leaveRoom();
            props.conn.removeCallback();
            dispatch(disableRoomBar());
            dispatch(leaveRoom())
        }
    }, []);


    const msgHandler = (msg: Response.WsResponse) => {
        console.log(msg.message);
        switch(msg.type) {
            case Response.MessageType.NewUserConnected:
                dispatch(newUserJoined(msg.message as Response.NewUserConnectedResp));
                break;
            case Response.MessageType.UserLeft:
                dispatch(userLeft(msg.message as Response.UserLeft));
                break;
            case Response.MessageType.Sync:
                dispatch(setTime(msg.message as Response.Sync));
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
    }

    const onPlay = () => {
        props.conn.setPlay(true);
    }

    const onPause = () => {
        props.conn.setPlay(false);
    }

    return (
        <>
            <div className="player-container">
                <ReactPlayer url={videoLink} width={"100%"} playing={playing} onPlay={onPlay} onPause={onPause} height="100%" controls autoplay/>
            </div>
        </>
    )
}

export default Room;