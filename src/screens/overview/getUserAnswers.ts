import firebase from 'firebase';
import { useState, useEffect } from 'react';
import { Answer } from '../questionnaire/getQuestions';


export default (userId: string) => {
    const [answers, setAnswers] = useState<Answer[]>()

    const getFromFirestore = async () => {
        const doc = await firebase.firestore().collection('users').doc(userId).get();
        console.log(doc);    
        const result = doc.data()?.answers;    
        setAnswers(result);
    }

    useEffect(() => {
        getFromFirestore()
    }, []);

    return answers;
}