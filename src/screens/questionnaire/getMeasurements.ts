import firebase from 'firebase';
import { useState, useEffect } from 'react';

export type Measurement = string;

export default () => {
    const [measurements, setMeasurements] = useState<Measurement[]>()

    const getFromFirestore = async () => {
        const doc = await firebase.firestore().collection('measurements').doc('sport').get();
        console.log(doc);   
        const result = doc.data()?.list;     
        setMeasurements(result);
    }

    useEffect(() => {
        getFromFirestore()
    }, []);

    return measurements;
}