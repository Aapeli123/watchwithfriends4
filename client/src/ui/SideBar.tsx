import { Link } from "react-router-dom";
import "./SideBar.css";
const SideBar = () => {
    return <>
        <div className="side-bar">
            <Link to={"/"}><div className="sidebar-top"></div></Link>
            <Link to={"/room"}><div className="sidebar-item"><h4>New Room</h4></div></Link>
            <Link to={"/info"}><div className="sidebar-item"><h4>Info</h4></div></Link>
            <Link to={"/settings"}><div className="sidebar-item"><h4>Settings</h4></div></Link>

        </div>
    </>
}

export default SideBar;