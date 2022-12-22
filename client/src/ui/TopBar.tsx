import "./TopBar.css"
import logo from "./logo_placeholder.png"
import { Link } from "react-router-dom";
const TopBar = () => {
    const changeName = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
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
                    <h5>username: <a href="" onClick={changeName}><u>test</u>  <span className="material-icons">edit</span>  </a> </h5>
                </div>
            </div>
        </>
    )
}

export default TopBar;