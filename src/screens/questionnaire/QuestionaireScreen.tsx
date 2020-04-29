import React, { useReducer, useState } from 'react';
import { QuestionSection } from './QuestionSection';
import { RadarChart } from '../../components/RadarChart';
import getQuestions, { Answer, Question } from './getQuestions';
import getMeasurements from './getMeasurements';

// export type State = {
//   questions: {
//     question: Question;
//     selectedAnswer: Answer | undefined;
//   }[];
// }

// export type Action =
//   | { type: 'answerSelected', question: Question, answer: Answer }

// function reducer(state: State, action: Action) {
//   switch (action.type) {
//     case 'answerSelected':
//       return {
//         questions: state.questions.map(({ question, selectedAnswer }) =>
//           question.text === action.question.text ?
//             { question, selectedAnswer: action.answer } :
//             { question, selectedAnswer }
//         )
//       }
//   }
// }

export interface SelectedAnswers {
  [questionId: string]: Answer
}

export const QuestionaireScreen = () => {
  const questions = getQuestions();
  const measurements = getMeasurements();
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});

  // const intialState: State = {
  //   questions: questions.map(q => ({ question: q, selectedAnswer: undefined }))
  // };

  // const [state, dispatch] = useReducer(reducer, intialState);

  console.log(measurements);
  return (
    <div className="flex flex-row items-center h-screen bg-gray-100">
      <div className="flex flex-1 flex-col">
        {questions &&
          <QuestionSection
            questions={questions}
            selectedAnswers={selectedAnswers}
            onAnswerSelected={(question, answer) => {
              setSelectedAnswers({
                ...selectedAnswers,
                [question.id]: answer,
              })
            }} />
        }
      </div>
      <div className="flex-shrink p-8 m-16 shadow-md rounded-chart bg-white">
        {measurements && <RadarChart
          maxValue={10}
          minValue={0}
          measurements={measurements.map(m => ({ label: m, value: Object.values(selectedAnswers).reduce((sum, answer) => sum + (answer.measurement === m ? answer.value : 0), 0) }))}
        />
        }
      </div>
    </div>
  );
}
