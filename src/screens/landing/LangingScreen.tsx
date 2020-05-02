import React from "react";
import { Link } from "react-router-dom";

export const LandingScreen = () => {
    return (
        <div className="flex flex-col items-center">
            <h1>Here be landing page.</h1>
            <Link to="/questionaire">
                <button type='button'>Commence the test!</button>
            </Link>
        </div>
    )
};