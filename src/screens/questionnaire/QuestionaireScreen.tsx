import React, { useReducer, useState, useEffect } from 'react';
import { QuestionList } from './QuestionSection';
import { RadarChart } from '../../components/RadarChart';
import getQuestions, { Answer, Question } from './getQuestions';
import getMeasurements from './getMeasurements';
import firebase from 'firebase';
import FirebaseAuth from '../../components/FirebaseAuth';
import saveUserAnswers, { UserAnswers } from './saveUserAnswers';
import { useHistory, useLocation } from 'react-router';
import saveSessionAnswers from './saveSessionAnswers';

// A custom hook that builds on useLocation to parse
// the query string for you.
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

export const QuestionaireScreen = () => {
  const questions = getQuestions();
  const measurements = getMeasurements();
  const [selectedAnswers, setSelectedAnswers] = useState<UserAnswers>({});
  const [showSignIn, setShowSignIn] = useState(false);
  const [isComplete, setComplete] = useState(false);
  const history = useHistory();
  const query = useQuery();
  const sessionId = query.get('sessionId');

  useEffect(() => {
    if (isComplete) {
      if (sessionId === null) {
        // Firebase user might or might not be set
        const user = firebase.auth().currentUser;
        if (user === null) {
          setShowSignIn(true)
        } else {
          handleSaveUserAnswers(user.uid);
        }
      } else {
        handleSaveSessionAnswers();
      }
    }
  }, [isComplete])

  const handleSaveUserAnswers = async (userId: string) => {
    console.log(selectedAnswers);
    await saveUserAnswers(userId, selectedAnswers)
    history.replace("/overview");
  }

  const handleSaveSessionAnswers = async () => {
    await saveSessionAnswers(sessionId!, selectedAnswers)
    // Navigate to 'complete screen'?
    history.replace(`/sessions/${sessionId}`);
  }

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
            }
          }
        }}
        firebaseAuth={firebase.auth()} />
    </div>
  );

  return (
    <div className="flex flex-row items-center h-screen bg-gray-100">
      {
        showSignIn
          ?
          <SignInPrompt />
          :
          <div className="flex flex-1 flex-col">
            {questions &&
              <QuestionList
                questions={questions}
                selectedAnswers={selectedAnswers}
                onQuestionAnswered={(question, answers) => {
                  setSelectedAnswers(prevAnswers => ({
                    ...prevAnswers,
                    [question.id]: answers,
                  }));
                }}
                onComplete={() => setComplete(true)} />
            }
          </div>
      }
      <div className="m-16">
        {measurements && <RadarChart
          maxValue={5}
          minValue={0}
          measurements={measurements}
          userAnswers={selectedAnswers}
        />
        }
      </div>
    </div>
  );
}
