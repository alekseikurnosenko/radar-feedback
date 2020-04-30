import React, { useState } from "react";
import { QuestionBlock } from "./QuestionBlock";
import { Question, Answer } from "./getQuestions";
import { SelectedAnswers } from "./QuestionaireScreen";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

export interface QuestionSectionProps {
    questions: Question[];
    selectedAnswers: SelectedAnswers;
    onAnswerSelected: (question: Question, answer: Answer) => void;
    onComplete: () => void;
}

const DELAY = 800;

export const QuestionSection = (props: QuestionSectionProps) => {
    const { questions, selectedAnswers, onAnswerSelected, onComplete } = props;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    if (questions.length === 0) {
        return <p className="m-16">No questions available</p>;
    }

    const question = questions[currentQuestionIndex];

    if (!question) {
        onComplete();
        return <p className="m-16">Thank you!</p>
    }

    return (
        <div className="m-16 overflow-y-auto">            
                <QuestionBlock
                    question={question}
                    selectedAnswer={selectedAnswers[question.id]}
                    onAnswerSelected={answer => {
                        onAnswerSelected(question, answer);

                        setTimeout(() => {
                            setCurrentQuestionIndex(currentQuestionIndex + 1)                        
                        }, DELAY);
                    }}
                />            
        </div>
    );
}