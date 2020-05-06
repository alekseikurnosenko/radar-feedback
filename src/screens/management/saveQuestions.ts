import firebase from 'firebase';
import { Answer, Question } from '../questionnaire/getQuestions';

export default async (questions: Question[]) => {
    await firebase.firestore().collection('questions').doc('sport').set({ list: questions });
};