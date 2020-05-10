import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { LandingScreen } from './landing/LangingScreen';
import { QuestionsScreen } from './management/QuestionsScreen';
import { OverviewScreen } from './overview/OverviewScreen';
import { QuestionaireScreen } from './questionnaire/QuestionaireScreen';
import { SessionListScreen } from './session/SessionListScreen';
import { NewSessionScreen, SessionScreen } from './session/SessionScreen';
import { SignInScreen } from './signin/SignInScreen';

export const App = () => {
    const [isSignedIn, setSignedIn] = useState<boolean | undefined>();

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            setSignedIn(user !== null);
        });
    }, []);

    console.log(isSignedIn);
    if (isSignedIn === undefined) {
        return <p>App Loading</p>;
    }

    // TODO: check why is it re-rendered twice

    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    {isSignedIn ? <Redirect to="/overview" /> : <LandingScreen />}
                </Route>
                <ProtectedRoute path="/overview">
                    <OverviewScreen />
                </ProtectedRoute>
                <ProtectedRoute exact path="/sessions/new">
                    <NewSessionScreen />
                </ProtectedRoute>
                <ProtectedRoute path="/sessions/:id">
                    <SessionScreen />
                </ProtectedRoute>
                <ProtectedRoute path="/sessions/">
                    <SessionListScreen />
                </ProtectedRoute>
                <Route path="/questionaire">
                    <QuestionaireScreen />
                </Route>
                <Route path="/signin">
                    <SignInScreen />
                </Route>
                <Route path="/management">
                    <QuestionsScreen />
                </Route>
            </Switch>
        </BrowserRouter>
    );
};

const ProtectedRoute = ({ children, ...props }: any) => {
    const currentUser = firebase.auth().currentUser;
    return <Route {...props}>{currentUser === null ? <Redirect to="/" /> : children}</Route>;
};
