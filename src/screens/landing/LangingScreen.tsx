import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button";

export const LandingScreen = () => {
    return (
        <div className="flex flex-col h-screen bg-background">
            <div className="flex flex-row p-2 bg-green-200 items-center">
                <p>Amazing company Inc.</p>
                <Link className="ml-auto" to="/signin">
                    <Button>Sign in</Button>
                </Link>
            </div>
            <div className="flex flex-1 flex-col p-4 items-center justify-center">
                <h1 className="text-3xl text-center">Super amazing website where you can answer questions.</h1>
                <Link className="mt-16" to="/questionaire">
                    <Button>Try out your first test!</Button>
                </Link>
            </div>
        </div>
    )
};