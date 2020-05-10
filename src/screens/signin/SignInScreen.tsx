import FirebaseAuth from '../../components/FirebaseAuth';
import React from 'react';
import firebase from 'firebase';

export const SignInScreen = () => {
    return (
        <div className="flex h-screen items-center justify-center">
            <FirebaseAuth
                uiConfig={{
                    signInOptions: [
                        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                        firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    ],
                    signInFlow: 'popup',
                    credentialHelper: 'none',
                    signInSuccessUrl: '/overview',
                }}
                firebaseAuth={firebase.auth()}
            />
        </div>
    );
};
