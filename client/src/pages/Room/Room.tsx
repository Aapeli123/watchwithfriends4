import React, { useEffect } from "react";
import ReactPlayer from 'react-player'
import { useParams } from "react-router-dom";
import { ServerConn } from "../../lib/conn";
import { Response } from "../../lib/messages";
import "./Room.css"

const Room = (props: {conn: ServerConn}) => {
    const params = useParams();
    useEffect(() => {
        console.log(params["code"]);
        props.conn.addMessageCallback(msgHandler);
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