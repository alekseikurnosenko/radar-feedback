import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import FirebaseAuth from '../../components/FirebaseAuth';
import { RadarChart } from '../../components/RadarChart';
import { convertAnswers } from '../../util/converUserAnswers';
import { useMedia } from '../../util/useMedia';
import getMeasurements from './getMeasurements';
import getQuestions from './getQuestions';
import { QuestionList } from './QuestionSection';
import saveSessionAnswers from './saveSessionAnswers';
import saveUserAnswers, { UserAnswers } from './saveUserAnswers';

// A custom hook that builds on useLocation to parse
// the query string for you.
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

export const QuestionaireScreen = () => {
    const questions = getQuestions();
    const measurements = getMeasurements();
    const [selectedAnswers, setSelectedAnswers] = useState<UserAnswers>({});
    const [showSignIn, setShowSignIn] = useState(false);
    const [isComplete, setComplete] = useState(false);
    const history = useHistory();
    const query = useQuery();
    const isChartVisible = useMedia(['(min-width: 1024px'], [true], false);
    const sessionId = query.get('sessionId');

    const handleSaveUserAnswers = async (userId: string) => {
        console.log(selectedAnswers);
        await saveUserAnswers(userId, selectedAnswers);
        history.replace('/overview');
    };

    const handleSaveSessionAnswers = async () => {
        await saveSessionAnswers(sessionId!, selectedAnswers);
        // Navigate to 'complete screen'?
        history.replace(`/sessions/${sessionId}`);
    };

    useEffect(() => {
        if (isComplete) {
            if (sessionId === null) {
                // Firebase user might or might not be set
                const user = firebase.auth().currentUser;
                if (user === null) {
                    setShowSignIn(true);
                } else {
                    handleSaveUserAnswers(user.uid);
                }
            } else {
                handleSaveSessionAnswers();
            }
        }
    }, [isComplete]);

    const SignInPrompt = () => (
        <div className="flex flex-1 flex-col items-center">
            <p>Just one more step! Sign up now to save your results.</p>
            <FirebaseAuth
                uiConfig={{
                    signInOptions: [
                        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                        firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    ],
                    signInFlow: 'popup',
                    credentialHelper: 'none',
                    callbacks: {
                        signInSuccessWithAuthResult: (authResult: firebase.auth.UserCredential) => {
                            // Save results?
                            if (!authResult.user) {
                                alert('Firebase user was not set!');
                                return false;
                            }
                            handleSaveUserAnswers(authResult.user.uid);
                            return false;
                        },
                    },
                }}
                firebaseAuth={firebase.auth()}
            />
        </div>
    );

    if (!measurements) {
        return <p>Loading questionaire</p>;
    }

    const userMeasurements = convertAnswers(selectedAnswers, measurements);

    return (
        <div className="flex flex-row items-center h-screen bg-gray-100">
            {showSignIn ? (
                <SignInPrompt />
            ) : (
                <div className="flex flex-1 flex-col px-16">
                    {questions && (
                        <QuestionList
                            questions={questions}
                            selectedAnswers={selectedAnswers}
                            onQuestionAnswered={(question, answers) => {
                                setSelectedAnswers((prevAnswers) => ({
                                    ...prevAnswers,
                                    [question.id]: answers,
                                }));
                                firebase.analytics().logEvent('question_answered', { questionId: question.id });
                            }}
                            onComplete={() => setComplete(true)}
                        />
                    )}
                </div>
            )}
            {isChartVisible && (
                <div className="mr-16">
                    {<RadarChart maxValue={5} minValue={0} measurements={measurements} values={userMeasurements} />}
                </div>
            )}
        </div>
    );
};
