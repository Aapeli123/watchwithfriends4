import React, { useEffect } from "react";
import ReactPlayer from 'react-player'
import { useParams } from "react-router-dom";
import { ServerConn } from "../../lib/conn";
import "./Room.css"

const Room = (props: {conn: ServerConn}) => {
    const params = useParams();
    useEffect(() => {
        console.log(params["code"]);
    });
    return (
        <>
            <div className="player-container">
                <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' width={"100%"} height="100%" controls/>
            </div>
        </>
    )
}

export default Room;