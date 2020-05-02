import firebase from "firebase";

export const getUserId = () => {
    const user = firebase.auth().currentUser;

    return user?.uid;
}