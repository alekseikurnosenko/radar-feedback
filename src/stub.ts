import { v4 as uuid } from 'uuid';
import { Question } from "./screens/questionnaire/getQuestions";
import { Measurement } from './screens/questionnaire/getMeasurements';
import firebase from 'firebase';

const measurements: Measurement[] = [
    'jumping',
    'running',
    'swimming',
    'skiing',
    'juggling',
]

const questions: Question[] = [
    {
        id: uuid(),
        text: 'Can you jump?',
        answers: [
            {
                id: uuid(),
                measurement: 'jumping',
                text: 'Like a rabbit!',
                value: 9
            },
            {
                id: uuid(),
                measurement: 'jumping',
                text: 'Barely.',
                value: 2
            }
        ],
    },
    {
        id: uuid(),
        text: 'How fast can you run?',
        answers: [
            {
                id: uuid(),
                measurement: 'running',
                text: 'I am a gepard!',
                value: 9
            },
            {
                id: uuid(),
                measurement: 'running',
                text: 'Dunno, average?',
                value: 5,
            },
            {
                id: uuid(),
                measurement: 'running',
                text: 'Like a snail.',
                value: 1
            }
        ],
    },
    {
        id: uuid(),
        text: 'How good are you at swimming?',
        answers: [
            {
                id: uuid(),
                measurement: 'swimming',
                text: 'I am a Pro.',
                value: 10
            },
            {
                id: uuid(),
                measurement: 'swimming',
                text: 'I cannot swim at all!',
                value: 1
            }
        ],
    },
    {
        id: uuid(),
        text: 'Can you ski?',
        answers: [
            {
                id: uuid(),
                measurement: 'skiing',
                text: 'Won gold on the last Olympic games.',
                value: 10
            },
            {
                id: uuid(),
                measurement: 'skiing',
                text: 'Can reach the bottom without breaking my neck.',
                value: 7
            },
            {
                id: uuid(),
                measurement: 'skiing',
                text: 'Snowboarding for life!',
                value: 1
            },
        ],
    },
    {
        id: uuid(),
        text: 'Let\'s not even pretend that you can juggle.',
        answers: [
            {
                id: uuid(),
                measurement: 'juggling',
                text: 'Okay =(',
                value: 0
            },
        ],
    },
]

const stub = async () => {
    const questionCollection = firebase.firestore().collection('questions');
    await questionCollection.doc('sport').delete();
    await questionCollection.doc('sport').set({list: questions});

    const measurementsCollection = firebase.firestore().collection('measurements');
    await measurementsCollection.doc('sport').delete();
    await measurementsCollection.doc('sport').set({list: measurements});
};

stub();

export { };