import React from 'react';
import { Question, Answer } from '../types';


export interface QuestionBlockProps {
    question: Question;
    selectedAnswer?: Answer;
    onAnswerSelected: (answer: Answer) => void;
}

interface AnswerButtonProps {
    text: string;
    selected: boolean;
    onClick: () => void;
}

const AnswerButton = (props: AnswerButtonProps) => {
    return (
        <button style={{ border: '1px solid black', padding: '8px', borderRadius: '8px', backgroundColor: props.selected ? 'green' : undefined }} onClick={props.onClick}>
            {props.text}
        </button>
    );
}

export const QuestionBlock = (props: QuestionBlockProps) => {
    return (
        <div className="flex flex-col flex-1">
            <p>{props.question.text}?</p>
            <div className="flex flex-row mt-8">
                {props.question.answers.map(a =>
                    <AnswerButton
                        text={a.text}
                        selected={props.selectedAnswer?.text === a.text}
                        onClick={() => { props.onAnswerSelected(a) }} />
                )}
            </div>
        </div>
    );
}