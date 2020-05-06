import React, { useState, useEffect } from 'react';
import { Question, Answer } from './getQuestions';


export interface MultipleChoiceQuestionProps {
    question: Question;
    selectedAnswers?: Answer[];
    onQuestionAnswered: (answers: Answer[]) => void;
}

interface AnswerButtonProps {
    text: string;
    selected: boolean;
    onClick: () => void;
}

const AnswerButton = (props: AnswerButtonProps) => {
    return (
        <button className="p-4 mb-4 border border-solid border-black rounded-lg" style={{ backgroundColor: props.selected ? 'green' : undefined }} onClick={props.onClick}>
            {props.text}
        </button>
    );
}

export const MultipleChoiceQuestion = (props: MultipleChoiceQuestionProps) => {
    const { question, selectedAnswers, onQuestionAnswered } = props;
    const [currentSelectedAnswers, setCurrentSelectedAnswers] = useState<Answer[]>(selectedAnswers || []);

    useEffect(() => {
        setCurrentSelectedAnswers(selectedAnswers || [])
    }, [selectedAnswers]);

    const handleAnswerClick = (answer: Answer) => {
        if (currentSelectedAnswers.some(a => a.id === answer.id)) {
            setCurrentSelectedAnswers(currentSelectedAnswers.filter(a => a.id !== answer.id));
        } else {
            setCurrentSelectedAnswers([...currentSelectedAnswers, answer]);
        }
    };

    const handleOkClick = () => {
        onQuestionAnswered(currentSelectedAnswers);
    }

    return (
        <div className="flex flex-col flex-1">
            <p>{question.text}</p>

            <div className="flex flex-col mt-8">
                {question.answers.map(a =>
                    <AnswerButton
                        key={a.id}
                        text={a.text}
                        selected={currentSelectedAnswers.includes(a)}
                        onClick={() => handleAnswerClick(a)} />
                )}
            </div>
            <button
                onClick={() => handleOkClick()}>
                OK
            </button>
        </div>
    );
}