import React, { useState } from "react";
import { SingleChoiceQuestion } from "./SingleChoiceQuestion";
import { Question, Answer } from "./getQuestions";
import { UserAnswers } from "./saveUserAnswers";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";

export interface QuestionSectionProps {
    questions: Question[];
    selectedAnswers: UserAnswers;
    onQuestionAnswered: (question: Question, answers: Answer[]) => void;
    onComplete: () => void;
}

const DELAY = 0;

export const QuestionList = (props: QuestionSectionProps) => {
    const { questions, selectedAnswers, onQuestionAnswered, onComplete } = props;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    if (questions.length === 0) {
        return <p className="m-16">No questions available</p>;
    }

    const question = questions[currentQuestionIndex];

    const handleQuestionAnswered = (answers: Answer[]) => {        
        onQuestionAnswered(question, answers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
        } else {
            onComplete();
        }
    };

    return (
        <div className="overflow-y-auto">
            {question.isMultipleChoice
                ?
                <MultipleChoiceQuestion
                    question={question}
                    selectedAnswers={selectedAnswers[question.id]}
                    onQuestionAnswered={answers => handleQuestionAnswered(answers)}
                />
                :
                <SingleChoiceQuestion
                    question={question}
                    selectedAnswer={selectedAnswers[question.id]?.[0]}
                    onQuestionAnswered={answer => handleQuestionAnswered([answer])}
                />
            }
        </div>
    );
}