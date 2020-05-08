import firebase from 'firebase';
import { v4 as uuid } from 'uuid';
import { UserAnswers } from '../questionnaire/saveUserAnswers';

export interface Session {
    id: string;
    owner: string
    submissions: {
        [id: string]: {
            answers: UserAnswers;
        }
    }
}

export default async (userId: string) => {
    const id = uuid();
    const session: Session = {
        id,
        owner: userId,
        submissions: {}
    }
    await firebase.firestore().collection('sessions').doc(id).set(session);
    return session;
};