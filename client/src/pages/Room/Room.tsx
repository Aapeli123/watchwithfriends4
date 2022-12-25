import React, { useEffect } from "react";
import ReactPlayer from 'react-player'
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { ServerConn } from "../../lib/conn";
import { Response } from "../../lib/messages";
import { disableRoomBar, enableRoomBar } from "../../store/ui";
import "./Room.css"

const Room = (props: {conn: ServerConn}) => {
    const params = useParams();
    const dispatch = useDispatch();
    const initRoom = async () => {
        const roomCode = params["code"] as string;
        const {conn} = props;
        try {
            await conn.joinRoom(roomCode, "test");
        } catch(msg) {
            if(msg === "Room not found") {
                alert("Room not found.");
                return;
            }
            console.log("Already in the room, joined from RoomCodeInput or Create room");
        }
        try {
            console.log("Requesting room data")
            const data = await conn.roomData();
            console.log(data);
        } catch(err) {
            console.log(err)
        }
        props.conn.addMessageCallback(msgHandler);
        dispatch(enableRoomBar(null));

    }

    useEffect(() => {
        console.log(params["code"]);

        initRoom();

        return () => {
            props.conn.leaveRoom();
            props.conn.removeCallback();
            dispatch(disableRoomBar(null));
        }
    }, []);


    const msgHandler = (msg: Response.WsResponse) => {
        console.log(msg);
        switch(msg.type) {
            case Response.MessageType.NewUserConnected:
                break;
            case Response.MessageType.UserLeft:
                break;
            case Response.MessageType.Sync:
                break;
            case Response.MessageType.NewLeader:
                break;
            case Response.MessageType.SetPlay:
                break;
            case Response.MessageType.NewVideo:
                break;
        }
    }

    return (
        <>
            <div className="player-container">
                <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' width={"100%"} height="100%" controls/>
            </div>
        </>
    )
}

export default Room;