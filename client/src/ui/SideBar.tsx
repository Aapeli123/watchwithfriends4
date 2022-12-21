import { Link } from "react-router-dom";
import "./SideBar.css";
const SideBar = () => {
    return <>
        <div className="side-bar">
            <Link to={"/room/1"}><div className="sidebar-top"><h2>Join Room</h2></div></Link>
            <Link to={"/room/2"}><div className="sidebar-item"><h4>New Room</h4></div></Link>
            <Link to={"/info"}><div className="sidebar-item"><h4>Info</h4></div></Link>
            <Link to={"/settings"}><div className="sidebar-item"><h4>Settings</h4></div></Link>

        </div>
    </>
}

export default SideBar;