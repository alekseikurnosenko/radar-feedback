import firebase from 'firebase';
import { useEffect, useState } from 'react';
import { UserAnswers } from '../questionnaire/saveUserAnswers';


export default (userId: string): [UserAnswers | undefined, boolean] => {
    const [answers, setAnswers] = useState<UserAnswers>()
    const [isLoading, setLoading] = useState(true);

    const getFromFirestore = async () => {
        const doc = await firebase.firestore().collection('users').doc(userId).get();
        const result = doc.data()?.answers;    
        setAnswers(result);
        setLoading(false);
    }

    useEffect(() => {
        getFromFirestore()
    }, []);

    return [answers, isLoading];
}