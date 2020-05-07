import firebase from 'firebase';
import { v4 as uuid } from 'uuid';
import { Answer } from '../questionnaire/getQuestions';

export interface Session {
    id: string;
    owner: string
    answers: Answer[][];
}

export default async (userId: string) => {
    const id = uuid();
    const session: Session = {
        id,
        owner: userId,
        answers: []
    }
    await firebase.firestore().collection('sessions').doc(id).set(session);
    return session;
};