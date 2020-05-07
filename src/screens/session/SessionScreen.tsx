import { Answer } from "../questionnaire/getQuestions";
import React, { useEffect } from "react";
import { useParams, useHistory, generatePath } from "react-router";
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

    const path = generatePath('/questionaire?sessionId=:sessionId', { sessionId: id})

    return (
        <div>
            <p>Take questionaire: <a className="underline text-blue-400" href={path}>Link</a></p>
        </div>
    )
}