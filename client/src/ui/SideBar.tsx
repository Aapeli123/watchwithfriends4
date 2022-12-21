import { Link } from "react-router-dom";
import "./SideBar.css";
const SideBar = () => {
    return <>
        <div className="side-bar">
            <Link to={"/joinroom"}><div className="sidebar-top"><h2>Join Room</h2></div></Link>
            <Link to={"/room/2"}>
                <div className="sidebar-item"><h4><span className="material-icons">add</span>New Room</h4></div>
            </Link>
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