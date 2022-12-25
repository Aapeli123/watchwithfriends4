import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ServerConn } from "../lib/conn";
import { enableRoomBar } from "../store/ui";
import "./SideBar.css";
const SideBar = (props: {conn: ServerConn}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const createRoomClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        try {
            let r = await props.conn.createRoom("test")
            navigate(`room/${r.room_code}`);
        } catch {
            console.log("Room creation failed...");
        }
        
    }

    return <>
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
    </>
}

export default SideBar;