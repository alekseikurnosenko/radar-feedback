import getQuestions, { Question, Answer, Suggestion } from "../questionnaire/getQuestions";
import React, { useReducer, useEffect, useState, useContext } from "react";
import getMeasurements, { Measurement } from "../questionnaire/getMeasurements";
import { Input } from "../../components/input";
import { Button } from "../../components/Button";
import saveQuestions from "./saveQuestions";
import { v4 as uuid } from 'uuid';


interface State {
    questions: Question[];
    measurements: Measurement[];
}

type Action =
    | { type: 'noop' }
    | { type: 'measurementsLoaded', payload: Measurement[] }
    | { type: 'questionAdded' }
    | { type: 'questionRemoved', questionId: string }
    | { type: 'questionsLoaded', payload: Question[] }
    | { type: 'questionChanged', questionId: string, newText: string }
    | { type: 'answerAdded', questionId: string }
    | { type: 'answerChanged', answerId: string, payload: Partial<Answer> }
    | { type: 'answerRemoved', answerId: string }
    | { type: 'suggestionAdded', answerId: string }
    | { type: 'suggestionRemoved', answerId: string, suggestionId: string }
    | { type: 'suggestionChanged', answerId: string, suggestionId: string, payload: Partial<Suggestion> }


const answerReducer = (answer: Answer, action: Action): Answer => {
    switch (action.type) {
        case 'answerChanged':
            return {
                ...answer,
                ...action.payload
            }
        case 'suggestionAdded':
            return {
                ...answer,
                suggestions: [...(answer.suggestions || []), {
                    id: uuid(),
                    text: 'Placeholder suggestion',
                }]
            }
        case 'suggestionRemoved':
            return {
                ...answer,
                suggestions: answer.suggestions?.filter(s => s.id !== action.suggestionId)
            }
        case 'suggestionChanged':
            return {
                ...answer,
                suggestions: answer.suggestions?.map(s => {
                    if (s.id === action.suggestionId) {
                        return {
                            ...s,
                            ...action.payload,
                        }
                    }
                    return s;
                }),
            }
        default:
            return answer;
    }
}

const reducer = (state: State, action: Action): State => {
    const questionByAnswer = (answerId: string) => state.questions.find(q => q.answers.some(a => a.id === answerId))!;

    switch (action.type) {
        case 'questionAdded': {
            return {
                ...state,
                questions: [...state.questions, {
                    id: uuid(),
                    text: 'Placeholder',
                    isMultipleChoice: false,
                    answers: []
                }],
            }
        }
        case 'questionRemoved':
            return {
                ...state,
                questions: state.questions.filter(q => q.id !== action.questionId)
            }
        case 'questionsLoaded':
            return {
                ...state,
                questions: action.payload
            }
        case 'measurementsLoaded':
            return {
                ...state,
                measurements: action.payload
            }
        case 'questionChanged':
            return {
                ...state,
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
        case 'answerAdded': {
            return {
                ...state,
                questions: state.questions.map(q => {
                    if (q.id === action.questionId) {
                        return {
                            ...q,
                            answers: [...q.answers, {
                                id: uuid(),
                                text: 'Placeholder',
                                measurement: state.measurements[0],
                                value: 0
                            }],
                        };
                    }
                    return q;
                })
            }
        }
        case 'answerRemoved': {
            const question = questionByAnswer(action.answerId);
            return {
                ...state,
                questions: state.questions.map(q => {
                    if (q.id === question.id) {
                        return {
                            ...q,
                            answers: q.answers.filter(a => a.id !== action.answerId)
                        };
                    }
                    return q;
                })
            }
        }
        case 'answerChanged':
        case 'suggestionAdded':
        case 'suggestionRemoved':
        case 'suggestionChanged': {
            const question = state.questions.find(q => q.answers.some(a => a.id === action.answerId));
            return {
                ...state,
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
        }
        default:
            return state;
    }
};

const DispatchContext = React.createContext<React.Dispatch<Action>>(() => { });

const SuggestionBlock = (props: { answer: Answer, suggestion: Suggestion }) => {
    const { answer, suggestion } = props;
    const dispatch = useContext(DispatchContext);

    return (
        <div className="flex flex-col p-2 mt-2 bg-blue-100 border border-black">
            <p>Text</p>
            <Input
                value={suggestion.text}
                onChange={e => dispatch({ type: 'suggestionChanged', answerId: answer.id, suggestionId: suggestion.id, payload: { text: e.target.value } })}
            />
            <p className="mt-2">Link (optional)</p>
            <Input
                value={suggestion.link}
                onChange={e => dispatch({ type: 'suggestionChanged', answerId: answer.id, suggestionId: suggestion.id, payload: { link: e.target.value } })}
            />
            <Button
                className="ml-auto mt-2"
                onClick={() => dispatch({ type: 'suggestionRemoved', answerId: answer.id, suggestionId: suggestion.id })}
            >
                Remove
            </Button>
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
                onChange={e => dispatch({ type: 'answerChanged', answerId: answer.id, payload: { text: e.target.value } })}
            />
            <p className="mt-2">Measurement:</p>
            <select
                className="p-2"
                onChange={e => dispatch({ type: 'answerChanged', answerId: answer.id, payload: { measurement: e.target.value } })}
            >
                {measurements.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <p className="mt-2">Value:</p>
            <Input
                value={answer.value}
                type='number'
                min={0}
                max={5}
                step={1}
                onChange={e => dispatch({ type: 'answerChanged', answerId: answer.id, payload: { value: parseInt(e.target.value) } })}
            />
            <div className="flex flex-row items-center">
                <p className="mt-2">Suggestions</p>
                <Button
                    className="ml-auto"
                    onClick={() => dispatch({ type: 'suggestionAdded', answerId: answer.id })}
                >
                    +
                </Button>
            </div>
            {answer.suggestions?.map(s =>
                <SuggestionBlock key={s.id} suggestion={s} answer={answer} />
            )}
            <Button
                className="ml-auto mt-2"
                onClick={() => dispatch({ type: 'answerRemoved', answerId: answer.id })}
            >
                Remove
            </Button>
        </div>
    );
}

const QuestionBlock = (props: { question: Question, measurements: Measurement[] }) => {
    const { question, measurements } = props;
    const dispatch = useContext(DispatchContext);

    return (
        <div className="flex flex-col p-4 mb-4 bg-white border border-black">
            <p>Text</p>
            <Input value={question.text} onChange={e => dispatch({ type: 'questionChanged', newText: e.target.value, questionId: question.id })} />
            <div className="flex flex-row items-center">
                <p className="mt-2">Answers</p>
                <Button
                    className="ml-auto"
                    onClick={() => dispatch({ type: 'answerAdded', questionId: question.id })}
                >
                    +
                </Button>
            </div>
            {question.answers.map(a => <AnswerBlock key={a.id} answer={a} measurements={measurements}></AnswerBlock>)}
            <Button
                className="ml-auto mt-2"
                onClick={() => dispatch({ type: 'questionRemoved', questionId: question.id })}
            >
                Remove
            </Button>
        </div>
    );
}


export const QuestionsScreen = () => {
    const [state, dispatch] = useReducer(reducer, { questions: [], measurements: [] });
    const questions = getQuestions();
    const measurements = getMeasurements();
    const [isSaving, setSaving] = useState(false);

    useEffect(() => {
        if (measurements) {
            dispatch({ type: 'measurementsLoaded', payload: measurements })
        }
    }, [measurements])

    useEffect(() => {
        if (questions) {
            dispatch({ type: 'questionsLoaded', payload: questions })
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
                <div className="flex flex-row mb-2 items-center">
                    <p className="mt-2">Questions</p>
                    <Button
                        className="ml-auto"
                        onClick={() => dispatch({ type: 'questionAdded' })}
                    >
                        +
                </Button>
                </div>
                {state.questions.map(q => <QuestionBlock key={q.id} question={q} measurements={measurements} />)}
            </div>
        </DispatchContext.Provider>
    );
}