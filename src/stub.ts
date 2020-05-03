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
        isMultipleChoice: false,
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
        isMultipleChoice: false,
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
        isMultipleChoice: false,
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
        isMultipleChoice: false,
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
        isMultipleChoice: false,
        text: 'Juggling is difficul. Can you do it though?',
        answers: [
            {
                id: uuid(),
                measurement: 'juggling',
                text: 'Yes =P',
                value: 8
            },
            {
                id: uuid(),
                measurement: 'juggling',
                text: 'No =(',
                value: 0
            },
        ],
    },
    {
        id: uuid(),
        isMultipleChoice: true,
        text: 'How hardcore are you? Select all which apply.',
        answers: [
            {
                id: uuid(),
                measurement: 'swimming',
                text: 'I can wrestle with sharks',
                value: 1
            },
            {
                id: uuid(),
                measurement: 'juggling',
                text: 'I can juggle with chainsaws which are set on fire',
                value: 1
            },
            {
                id: uuid(),
                measurement: 'swimming',
                text: 'I can swim across English Channel',
                value: 1
            },
            {
                id: uuid(),
                measurement: 'swimming',
                text: 'I can swim across Atlantic Ocean',
                value: 1
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