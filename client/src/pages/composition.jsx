import { useState,useEffect } from "react";
import { isLoggedIn } from "../utils/checkLogin";
import transition from "../components/transition";

function Composition() {
    return (
        <div>
            {isLoggedIn() ? <p>hi</p>:<p>no</p>}
            This is composition
        </div>
    )
}

export default transition(Composition);