import firebase from 'firebase';
import { useEffect, useState } from 'react';
import { UserAnswers } from '../questionnaire/saveUserAnswers';
import { v4 as uuid } from 'uuid';

export interface TestResult {
    timestamp: Date;
    answers: UserAnswers;
}

export default (userId: string): [TestResult[] | undefined, boolean] => {
    const [answers, setAnswers] = useState<TestResult[]>()
    const [isLoading, setLoading] = useState(true);

    const getFromFirestore = async () => {
        const tests = await firebase.firestore()
            .collection('users')
            .doc(userId)
            .collection('tests')
            .orderBy('timestamp', 'desc')
            .get();
            
        const result = tests.docs.map(d => d.data());
        
        
        const answers = result.map(r => ({
            timestamp: r.timestamp.toDate(),
            answers: r.answers
        }));
        setAnswers(answers);
        setLoading(false);
    }

    useEffect(() => {
        getFromFirestore()
    }, []);

    return [answers, isLoading];
}