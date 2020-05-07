import { Answer } from "../questionnaire/getQuestions";
import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router";
import startSession from "./startSession";
import { getUserId } from "../overview/getUserId";


export const SessionScreen = () => {
    const userId = getUserId()!;
    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
        console.log(id);
        const promise = async () => {
            if (id === 'new') {
                const session = await startSession(userId);
                history.replace(`/session/${session.id}`);
            }
        }
        promise()
    }, [id])

    if (id === 'new') {
        return <p>Creating new session</p>
    }

    return (
        <div>
            <p>Session: {history.location.pathname}</p>
        </div>
    )
}