import React, { useEffect } from "react";
import ReactPlayer from 'react-player'
import { ServerConn } from "../../lib/conn";
import "./Room.css"

const Room = (props: {conn: ServerConn}) => {
    useEffect(() => {

    });
    return (
        <>
            <div className="player-container">
                <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' width={"100%"} height="90vh" controls/>
            </div>
        </>
    )
}

export default Room;