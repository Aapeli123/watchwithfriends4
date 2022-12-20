import React from "react";
import ReactPlayer from 'react-player'
import "./Room.css"

const Room = () => {
    return (
        <>
            <div className="player-container">
                <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' width={"100%"} height="90vh" controls/>
            </div>
        </>
    )
}

export default Room;