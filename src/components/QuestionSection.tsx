import { Question } from "../types";
import React, { useState } from "react";
import { QuestionBlock } from "./QuestionBlock";
import { Action, State } from "../App";

export interface QuestionSectionProps {
    state: State;
    dispatch: React.Dispatch<Action>;
}

export const QuestionSection = (props: QuestionSectionProps) => {
    const { state, dispatch } = props;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    if (state.questions.length === 0) {
        return <p className="m-16">No questions available</p>;
    }

    const question = state.questions[currentQuestionIndex];

    if (!question) {
        return <p className="m-16">Thank you!</p>
    }

    return (
        <div className="m-16 overflow-y-auto">            
                <QuestionBlock
                    question={question.question}
                    selectedAnswer={question.selectedAnswer}
                    onAnswerSelected={answer => {
                        dispatch({ type: 'answerSelected', question: question.question, answer })
                        setTimeout(() => {
                            setCurrentQuestionIndex(currentQuestionIndex + 1)                        
                        }, 300);
                    }}
                />            
        </div>
    );
}