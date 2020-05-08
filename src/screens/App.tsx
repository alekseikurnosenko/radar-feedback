import { QuestionaireScreen } from "./questionnaire/QuestionaireScreen"
import React, { useState, useEffect } from "react"
import { BrowserRouter, Switch, Route, useHistory, Redirect } from 'react-router-dom';
import { OverviewScreen } from "./overview/OverviewScreen";
import firebase from 'firebase';
import { LandingScreen } from "./landing/LangingScreen";
import { QuestionsScreen } from "./management/QuestionsScreen";
import { SessionScreen, NewSessionScreen } from "./session/SessionScreen";
import { SignInScreen } from "./signin/SignInScreen";


export const App = () => {
    const [isSignedIn, setSignedIn] = useState<boolean | undefined>();
    const currentUser = firebase.auth().currentUser;

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            setSignedIn(user !== null);
        });
    }, []);


    console.log(isSignedIn)
    if (isSignedIn === undefined) {
        return <p>App Loading</p>;
    }

    // TODO: check why is it re-rendered twice

    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    {isSignedIn
                        ? <Redirect to="/overview" />
                        : <LandingScreen />
                    }
                </Route>
                <ProtectedRoute path="/overview">
                    <OverviewScreen />
                </ProtectedRoute>
                <ProtectedRoute exact path="/session/new">
                    <NewSessionScreen />
                </ProtectedRoute>    
                <ProtectedRoute path="/session/:id">
                    <SessionScreen />
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
    )
}

const ProtectedRoute = ({ children, ...props }: any) => {
    const currentUser = firebase.auth().currentUser;
    return (
        <Route {...props}>
            {currentUser === null
                ? <Redirect to="/" />
                : children
            }
        </Route>
    )
}