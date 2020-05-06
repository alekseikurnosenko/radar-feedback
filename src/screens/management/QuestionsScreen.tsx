import getQuestions, { Question, Answer, Suggestion } from "../questionnaire/getQuestions";
import React, { useReducer, useEffect, useState, useContext } from "react";
import getMeasurements, { Measurement } from "../questionnaire/getMeasurements";
import { Input } from "../../components/input";
import { Button } from "../../components/Button";
import saveQuestions from "./saveQuestions";
import { v4 as uuid } from 'uuid';

const SuggestionBlock = (props: { suggestion: Suggestion }) => {
    const { suggestion } = props;

    return (
        <div className="flex flex-col p-2 mt-2 bg-blue-100 border border-black">
            <p>Text</p>
            <Input value={suggestion.text}></Input>
            <p>Link (optional)</p>
            <Input value={suggestion.link}></Input>
        </div>
    )
};

const AnswerBlock = (props: { answer: Answer, measurements: Measurement[] }) => {
    const { answer, measurements } = props;
    const dispatch = useContext(DispatchContext);

    return (
        <div className="flex flex-col grid-rows-4 p-2 mt-2 bg-green-100 border border-black">
            <p>Text:</p>
            <Input
                value={answer.text}
                onChange={e => dispatch({ type: 'ANSWER_TEXT_CHANGED', answerId: answer.id, newText: e.target.value })}
            />
            <p className="mt-2">Measurement:</p>
            <select
                className="p-2"
                onChange={e => dispatch({ type: 'ANSWER_MEASUREMENT_CHANGED', answerId: answer.id, newValue: e.target.value })}
            >
                {measurements.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <p className="mt-2">Value:</p>
            <Input
                value={answer.value}
                type='number'
                min={1}
                max={5}
                step={1}
                onChange={e => dispatch({ type: 'ANSWER_VALUE_CHANGED', answerId: answer.id, newValue: parseInt(e.target.value) })}
            />
            <div className="flex flex-row items-center">
                <p className="mt-2">Suggestions</p>
                <Button
                    className="ml-auto"
                    onClick={() => dispatch({ type: 'SUGGESTION_ADDED', answerId: answer.id })}
                >
                    +
                </Button>
            </div>
            {answer.suggestions?.map(s =>
                <SuggestionBlock key={s.id} suggestion={s} />
            )}
        </div>
    );
}

const QuestionBlock = (props: { question: Question, measurements: Measurement[] }) => {
    const { question, measurements } = props;
    const dispatch = useContext(DispatchContext);

    return (
        <div className="flex flex-col p-4 mb-4 bg-white border border-black">
            <p>Text:</p>
            <Input value={question.text} onChange={e => dispatch({ type: 'QUESTION_TEXT_CHANGED', newText: e.target.value, questionId: question.id })}></Input>
            <p className="mt-2">Answers:</p>
            {question.answers.map(a => <AnswerBlock key={a.id} answer={a} measurements={measurements}></AnswerBlock>)}
        </div>
    );
}

interface State {
    questions: Question[];
}

type Action =
    | { type: 'noop' }
    | { type: 'QUESTIONS_LOADED', payload: Question[] }
    | { type: 'QUESTION_TEXT_CHANGED', questionId: string, newText: string }
    | { type: 'ANSWER_TEXT_CHANGED', answerId: string, newText: string }
    | { type: 'ANSWER_MEASUREMENT_CHANGED', answerId: string, newValue: Measurement }
    | { type: 'ANSWER_VALUE_CHANGED', answerId: string, newValue: number }
    | { type: 'SUGGESTION_ADDED', answerId: string }
    | { type: 'SUGGESTION_REMOVED', answerId: string, suggestion: Suggestion }



const answerReducer = (answer: Answer, action: Action): Answer => {
    switch (action.type) {
        case 'ANSWER_TEXT_CHANGED':
            return {
                ...answer,
                text: action.newText
            }
        case 'ANSWER_MEASUREMENT_CHANGED':
            return {
                ...answer,
                measurement: action.newValue
            }
        case 'ANSWER_VALUE_CHANGED':
            return {
                ...answer,
                value: action.newValue
            }
        case 'SUGGESTION_ADDED':

            return {
                ...answer,
                suggestions: [...(answer.suggestions || []), {
                    id: uuid(),
                    text: 'Placeholder suggestion',
                }]
            }
        default:
            return answer;
    }
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'QUESTIONS_LOADED':
            return { questions: action.payload }
        case 'QUESTION_TEXT_CHANGED':
            return {
                questions: state.questions.map(q => {
                    if (q.id === action.questionId) {
                        return {
                            ...q,
                            text: action.newText,
                        }
                    }
                    return q;

                }),
            }
        case 'ANSWER_TEXT_CHANGED':
        case 'ANSWER_MEASUREMENT_CHANGED':
        case 'ANSWER_VALUE_CHANGED':
        case 'SUGGESTION_ADDED':
            const question = state.questions.find(q => q.answers.some(a => a.id === action.answerId));
            return {
                questions: state.questions.map(q => {
                    if (q.id === question?.id) {
                        return {
                            ...q,
                            answers: q.answers.map(a => {
                                if (a.id === action.answerId) {
                                    return answerReducer(a, action);
                                }
                                return a;
                            }),
                        }
                    }
                    return q;
                })
            }
        default:
            return state;
    }
};

const DispatchContext = React.createContext<React.Dispatch<Action>>(() => { });

export const QuestionsScreen = () => {
    const [state, dispatch] = useReducer(reducer, { questions: [] });
    const questions = getQuestions();
    const measurements = getMeasurements();
    const [isSaving, setSaving] = useState(false);


    useEffect(() => {
        if (questions) {
            dispatch({ type: 'QUESTIONS_LOADED', payload: questions })
        }
    }, [questions])

    useEffect(() => {
        if (isSaving) {
            const promise = async () => {
                saveQuestions(state.questions)
                setSaving(false);
                console.log('Saved!');
                // TODO: indicate
            }
            promise();
        }
    }, [isSaving])

    if (!questions || !measurements) {
        return <p>Loading</p>
    }

    return (
        <DispatchContext.Provider value={dispatch}>
            <div className="flex flex-col p-8 bg-background">
                <Button onClick={() => setSaving(true)}>Save</Button>
                {state.questions.map(q => <QuestionBlock key={q.id} question={q} measurements={measurements} />)}
            </div>
        </DispatchContext.Provider>
    );
}