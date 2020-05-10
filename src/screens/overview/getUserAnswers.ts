import firebase from 'firebase';
import { useEffect, useState } from 'react';
import { UserAnswers } from '../questionnaire/saveUserAnswers';
import { Result } from '../../util/result';

export interface TestResult {
    timestamp: Date;
    answers: UserAnswers;
}

export default (userId: string) => {
    const [result, setResult] = useState<Result<TestResult[]>>({ loading: true });

    const getFromFirestore = async () => {
        const tests = await firebase
            .firestore()
            .collection('users')
            .doc(userId)
            .collection('tests')
            .orderBy('timestamp', 'desc')
            .get();

        const result = tests.docs.map((d) => d.data());

        const answers = result.map((r) => ({
            timestamp: r.timestamp.toDate(),
            answers: r.answers,
        }));
        setResult({
            loading: false,
            data: answers,
        });
    };

    useEffect(() => {
        getFromFirestore();
    }, []);

    return result;
};
