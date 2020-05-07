import firebase from 'firebase';
import { UserAnswers } from './saveUserAnswers';
import { v4 as uuid } from 'uuid';

export default async (sessionId: string, answers: UserAnswers) => {
    // Can be userId
    const id = uuid();
    await firebase.firestore().collection('sessions').doc(sessionId).collection('answers').doc(id).set({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        answers
    });
};