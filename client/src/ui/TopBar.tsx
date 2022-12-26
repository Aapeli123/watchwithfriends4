import "./TopBar.css"
import logo from "./logo_placeholder.png"
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setUn } from "../store/prefs";
import { RootState } from "../store/store";
import { ServerConn } from "../lib/conn";
const TopBar = (props: {conn: ServerConn}) => {
    const dispatch = useDispatch();
    const username = useSelector((state: RootState) => state.pref.username);
    const roomLoaded = useSelector((state: RootState) => state.room.roomLoaded);

    const changeName = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        while(1) {
            const username = prompt("Username?");
            if(username === null) {
                continue;
            }
            if (username.trimStart().trimEnd() !== "") {
                Cookies.set("username", username);
                dispatch(setUn(username));
                if(roomLoaded) {
                    props.conn.changeUsername(username);
                }
                break;
            }
        }
    };

    return (
        <>
            <div className="top-bar">

                <div className="logo">
                <Link to={"/"}>
                    <div className="logo-text-container">
                        <img src={logo}></img>
                        <h2 id="logo-text-left">Watchwith</h2>
                        <h2 id="logo-text-right">friends</h2>
                    </div>
                </Link>
                </div>
                <div className="username-container">
                <a href="" onClick={changeName}>
                    <div className="username-drop-shadow">
                    <div className="username-btn">
                        <h5>{username} <span className="material-icons">edit</span>   </h5>
                    </div>
                    </div>
                </a>
                </div>
            </div>
        </>
    )
}

export default TopBar;