import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: 'AIzaSyApUr_0XKBVaUsBn7RQa5IG2o1SiDm0xDs',
    authDomain: 'radar-feedback.firebaseapp.com',
    databaseURL: 'https://radar-feedback.firebaseio.com',
    projectId: 'radar-feedback',
    storageBucket: 'radar-feedback.appspot.com',
    messagingSenderId: '593352051870',
    appId: '1:593352051870:web:585c74641b144eadeeff8f',
    measurementId: 'G-GZ9YJN7G4K',
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
