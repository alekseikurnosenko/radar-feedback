import firebase from 'firebase';
import { Answer } from './getQuestions';

export interface UserAnswers {
    [questionId: string]: Answer[];
};

export default async (userId: string, answers: UserAnswers) => {
    const doc = await firebase.firestore().collection('users').doc(userId);
    doc.set({ answers: answers })
};