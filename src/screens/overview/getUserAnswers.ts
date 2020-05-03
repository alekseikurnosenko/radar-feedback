import firebase from 'firebase';
import { useEffect, useState } from 'react';
import { UserAnswers } from '../questionnaire/saveUserAnswers';


export default (userId: string) => {
    const [answers, setAnswers] = useState<UserAnswers>()

    const getFromFirestore = async () => {
        const doc = await firebase.firestore().collection('users').doc(userId).get();
        const result = doc.data()?.answers;    
        setAnswers(result);
    }

    useEffect(() => {
        getFromFirestore()
    }, []);

    return answers;
}