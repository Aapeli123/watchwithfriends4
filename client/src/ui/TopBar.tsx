import "./TopBar.css"
import logo from "./logo_placeholder.png"
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setUn } from "../store/prefs";
import { RootState } from "../store/store";
const TopBar = () => {
    const dispatch = useDispatch();
    const username = useSelector((state: RootState) => state.pref.username)

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
                    <h5>username: <a href="" onClick={changeName}><u>{username}</u>  <span className="material-icons">edit</span>  </a> </h5>
                </div>
            </div>
        </>
    )
}

export default TopBar;