import firebase from 'firebase';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { RadarChart } from '../../components/RadarChart';
import { convertAnswers } from '../../util/converUserAnswers';
import getMeasurements, { Measurement } from '../questionnaire/getMeasurements';
import getQuestions from '../questionnaire/getQuestions';
import { UserAnswers } from '../questionnaire/saveUserAnswers';
import getUserAnswers from './getUserAnswers';
import { getUserId } from './getUserId';

export const answerValues = (answers: UserAnswers, measurement: Measurement) => {
    return Object.values(answers)
        .flatMap((answers) => answers)
        .reduce((sum, answer) => sum + (answer.measurement === measurement ? answer.value : 0), 0);
};

const AnswersOverview = (props: { measurements: Measurement[]; answers: UserAnswers[] }) => {
    const { measurements, answers } = props;
    const questions = getQuestions();

    const currentAnswers = answers[0];
    const previousAnswers = answers[1];
    return (
        <div className="flex flex-1 flex-col px-8">
            {measurements.map((m) => {
                const currentValue = answerValues(currentAnswers, m);
                const previousValue = answerValues(previousAnswers || {}, m);

                const diff = previousAnswers && currentValue - previousValue;
                return (
                    <div className="flex flex-col" key={m}>
                        <div className="flex flex-row items-center">
                            <p className="text-2xl mr-2">
                                {m} {currentValue}/5
                            </p>
                            {diff !== undefined &&
                                (diff > 0 ? (
                                    <p className="text-xl text-green-500">▲ {diff}</p>
                                ) : diff < 0 ? (
                                    <p className="text-xl text-red-800">▼ {Math.abs(diff)}</p>
                                ) : null)}
                        </div>
                        {questions &&
                            Object.values(currentAnswers)
                                .flatMap((answers) => answers)
                                .filter((a) => a.measurement === m)
                                .map((a) => {
                                    const question = questions.find((q) => q.answers.some((aa) => aa.id === a.id));

                                    const origAnswer = question?.answers.find((aa) => aa.id === a.id);

                                    return (
                                        <div className="flex flex-col pl-8 mb-4" key={a.id}>
                                            <p className="italic mb-2 text">{question?.text}</p>
                                            <p className="p-2 mb-2 border border-sold border-black rounded-lg">
                                                ✔️ {a.text}
                                            </p>
                                            {origAnswer?.suggestions &&
                                                origAnswer?.suggestions.map((s) => (
                                                    <div className="pl-2 flex flex-row items-center">
                                                        <p>⚠ {s.text}</p>
                                                        {s.link && (
                                                            <a
                                                                className="ml-2 underline text-blue-500"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                href={s.link}
                                                            >
                                                                Link
                                                            </a>
                                                        )}
                                                    </div>
                                                ))}
                                        </div>
                                    );
                                })}
                    </div>
                );
            })}
        </div>
    );
};

export const OverviewScreen = () => {
    const userId = getUserId()!;
    const measurements = getMeasurements();
    const answers = getUserAnswers(userId);

    if (!measurements || answers.loading) {
        return <p>Loading</p>;
    }

    if (!answers.data || answers.data.length === 0) {
        // User have no answers
        // Return to main page?
        return <Redirect to="/questionaire" />;
    }

    const currentValues = convertAnswers(answers.data[0].answers, measurements);
    const previousValues = convertAnswers(answers.data[1]?.answers, measurements);

    return (
        <div className="flex flex-col bg-background h-screen">
            <div className="flex flex-row items-center">
                <p className="text-3xl">Overview</p>
                <Link to="/questionaire">
                    <button className="ml-8 bg-red-400 rounded h-8 px-2">New test</button>
                </Link>
                <Link to="/sessions">
                    <button className="ml-8 bg-red-400 rounded h-8 px-2">Sessions</button>
                </Link>
                <Link to="/sessions/new">
                    <button className="ml-8 bg-red-400 rounded h-8 px-2">New session</button>
                </Link>
                <button className="mr-8 ml-auto" onClick={() => firebase.auth().signOut()}>
                    Logout
                </button>
            </div>
            <div className="flex lg:flex-row flex-col">
                <div className="flex flex-1 flex-col">
                    <AnswersOverview answers={answers.data.map((a) => a.answers)} measurements={measurements} />
                </div>
                <div className="m-16">
                    {measurements && (
                        <RadarChart
                            maxValue={5}
                            minValue={0}
                            measurements={measurements}
                            values={currentValues}
                            previousValues={previousValues}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
