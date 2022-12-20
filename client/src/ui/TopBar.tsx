import React from "react";
import "./TopBar.css"
import logo from "./logo_placeholder.png"
const TopBar = () => {
    return (
        <>
            <div className="top-bar">
                <div className="logo">
                    <img src={logo}></img>
                    <h2 id="logo-text-left">Watchwith</h2>
                    <h2 id="logo-text-right">friends</h2>
                </div>
            </div>
        </>
    )
}

export default TopBar;