import React, { useReducer } from 'react';
import logo from './logo.svg';
import './App.css';
import { RadarChart } from './components/RadarChart';
import { QuestionBlock } from './components/QuestionBlock';
import { Question, Answer } from './types';

type State = {
  questions: {
    question: Question;
    selectedAnswer: Answer | undefined;
  }[];
}

type Action =
  | { type: 'answerSelected', question: Question, answer: Answer }

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'answerSelected':
      return {
        questions: state.questions.map(({ question, selectedAnswer }) =>
          question.text === action.question.text ?
            { question, selectedAnswer: action.answer } :
            { question, selectedAnswer }
        )
      }
  }
}

function App() {

  const data = [
    {
      label: 'Jumping',
      value: 5,
    }, {
      label: 'Running',
      value: 3,
    }, {
      label: 'Swimming',
      value: 1,
    }, {
      label: 'Skiing',
      value: 1,
    }, {
      label: 'Playing chess',
      value: 9
    },
    {
      label: 'Juggling',
      value: 7
    }
  ];

  const questions: Question[] = data.map(d => ({
    text: d.label,
    answers: Array.range(0, 10).map(i => ({ text: i.toString(), value: i, measurement: d.label }))
  }));

  const intialState: State = {
    questions: questions.map(q => ({ question: q, selectedAnswer: undefined }))
  };

  const [state, dispatch] = useReducer(reducer, intialState);

  return (
    <div className="flex flex-row items-center h-screen bg-gray-100">
      <div className="flex flex-1 flex-col">
        {state.questions.map(({ question, selectedAnswer }) =>
          <QuestionBlock
            question={question}
            selectedAnswer={selectedAnswer}
            key={question.text}
            onAnswerSelected={answer => dispatch({ type: 'answerSelected', question, answer })}
          />
        )}
      </div>
      <div className="flex-shrink p-8 m-16 shadow-md rounded-chart bg-white">
        <RadarChart
          maxValue={10}
          minValue={0}
          measurements={state.questions.map(({ question, selectedAnswer }) => ({ label: question.text, value: selectedAnswer?.value ?? 0 }))}
        />
      </div>
    </div>
  );
}

export default App;
