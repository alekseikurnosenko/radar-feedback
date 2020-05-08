import { useState, useEffect } from "react";
import firebase from 'firebase';
import { Session } from "./startSession";

export interface Result<T> {
    loading: boolean,
    error?: Error,
    data?: T
}

export default (sessionId: string) => {
    const [result, setResult] = useState<Result<Session>>({ loading: true })

    useEffect(() => {
        firebase.firestore().collection('sessions').doc(sessionId).onSnapshot({
            next: (doc) => {  
            const result = doc.data();
            setResult({
                loading: false,
                data: result as Session,
            })      
            }
        })
    }, []);

    return result;
}