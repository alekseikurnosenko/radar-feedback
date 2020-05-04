import firebase from 'firebase';
import { v4 as uuid } from 'uuid';
import { Question } from "./screens/questionnaire/getQuestions";

const measurements = {
    jumping: '🦘 Jumping',
    running: '🏃 Running',
    swimming: '🏊 Swimming',
    skiing: '⛷️ Skiing',
    juggling: '🤹 Juggling',
}

const questions: Question[] = [
    {
        id: uuid(),
        isMultipleChoice: false,
        text: 'Can you jump?',
        answers: [
            {
                id: uuid(),
                measurement: measurements.jumping,
                text: 'Like a rabbit!',
                value: 5
            },
            {
                id: uuid(),
                measurement: measurements.jumping,
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
                measurement: measurements.running,
                text: 'I am a gepard!',
                value: 5
            },
            {
                id: uuid(),
                measurement: measurements.running,
                text: 'Dunno, average?',
                value: 3,
            },
            {
                id: uuid(),
                measurement: measurements.running,
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
                measurement: measurements.swimming,
                text: 'I am a Pro.',
                value: 5
            },
            {
                id: uuid(),
                measurement: measurements.swimming,
                text: 'With floating tube only.',
                value: 2
            },
            {
                id: uuid(),
                measurement: measurements.swimming,
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
                measurement: measurements.skiing,
                text: 'Won gold on the last Olympic games.',
                value: 5
            },
            {
                id: uuid(),
                measurement: measurements.skiing,
                text: 'Can reach the bottom without breaking my neck.',
                value: 3
            },
            {
                id: uuid(),
                measurement: measurements.skiing,
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
                measurement: measurements.juggling,
                text: 'Yes',
                value: 5
            },
            {
                id: uuid(),
                measurement: measurements.juggling,
                text: 'Kinda',
                value: 3
            },
            {
                id: uuid(),
                measurement: measurements.juggling,
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
                measurement: measurements.swimming,
                text: 'I can wrestle with sharks',
                value: 1
            },
            {
                id: uuid(),
                measurement: measurements.juggling,
                text: 'I can juggle with chainsaws which are set on fire',
                value: 1
            },
            {
                id: uuid(),
                measurement: measurements.swimming,
                text: 'I can swim across English Channel',
                value: 1
            },
            {
                id: uuid(),
                measurement: measurements.swimming,
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
    await measurementsCollection.doc('sport').set({list: Object.values(measurements)});
};

stub();

export { };
