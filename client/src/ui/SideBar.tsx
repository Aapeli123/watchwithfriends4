import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ServerConn } from "../lib/conn";
import { RootState } from "../store/store";
import "./SideBar.css";
const SideBar = (props: {conn: ServerConn}) => {
    const navigate = useNavigate();
    const username = useSelector((state: RootState) => state.pref.username);
    const roomBar = useSelector(((state: RootState) => state.ui.roomBar));
    const roomCode = useSelector(((state: RootState) => state.room.roomCode));
    const createRoomClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        try {
            console.log(username);
            let r = await props.conn.createRoom(username)
            navigate(`room/${r.room_code}`);
        } catch {
            console.log("Room creation failed...");
        }
        
    }

    return roomBar ? (
        <>
            <div className="side-bar">
                <div className="sidebar-top"><h2>Room code: {roomCode}</h2></div>
                <Link to={"/"}><div className="sidebar-item"><h4><span className="material-icons">exit_to_app</span>Leave Room</h4></div></Link>
            </div>
        </>
    ) : (<>
        <div className="side-bar">
            <Link to={"/joinroom"}><div className="sidebar-top"><h2>Join Room</h2></div></Link>
            <a href="/createroom" onClick={createRoomClick}>
                <div className="sidebar-item"><h4><span className="material-icons">add</span>New Room</h4></div>
            </a>
            <Link to={"/info"}>
                <div className="sidebar-item"><h4><span className="material-icons">menu_book</span>Info</h4></div>
            </Link>
            <Link to={"/settings"}>
                <div className="sidebar-item"><h4><span className="material-icons">settings</span>Settings</h4></div>
            </Link>

        </div>
    </>)
}

export default SideBar;