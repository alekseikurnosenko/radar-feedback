import firebase from 'firebase';
import { Answer } from './getQuestions';

export type Measurement = string;

export default async (userId: string, answers: Answer[]) => {
    const doc = await firebase.firestore().collection('users').doc(userId);
    console.log(doc);
    doc.set({ answers: answers })
};