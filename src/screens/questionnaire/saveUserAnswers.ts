import firebase from 'firebase';
import { Answer } from './getQuestions';
import { v4 as uuid } from 'uuid';

export interface UserAnswers {
    [questionId: string]: Answer[];
}

export default async (userId: string, answers: UserAnswers) => {
    await firebase.firestore().collection('users').doc(userId).collection('tests').doc(uuid()).set({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        answers,
    });
};
