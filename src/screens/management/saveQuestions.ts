import firebase from 'firebase';
import { Question } from '../questionnaire/getQuestions';

export default async (questions: Question[]) => {
    await firebase.firestore().collection('questions').doc('sport').set({ list: questions });
};
