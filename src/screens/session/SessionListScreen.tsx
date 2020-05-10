import React from 'react';
import getSessions from './getSessions';
import { Session } from './startSession';
import { getUserId } from '../overview/getUserId';
import { Link } from 'react-router-dom';

const SessionItem = (props: { session: Session }) => {
    const { session } = props;

    return (
        <div className="flex flex-col border mb-2 p-2">
            <p>{session.timestamp.toLocaleString()}</p>
            <p>Parcipants: {Object.keys(session.submissions).length}</p>
        </div>
    );
};

export const SessionListScreen = () => {
    const userId = getUserId()!;
    const sessions = getSessions(userId);

    if (sessions.loading) {
        return <p>Loading</p>;
    }

    return (
        <div className="flex flex-col h-screen p-4 bg-background">
            {sessions.data?.map((s) => (
                <Link key={s.id} to={`/sessions/${s.id}`}>
                    <SessionItem session={s} />
                </Link>
            ))}
        </div>
    );
};
