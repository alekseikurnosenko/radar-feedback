import React from "react";
import getUserAnswers from "./getUserAnswers";
import { getUserId } from "./getUserId";
import getMeasurements from "../questionnaire/getMeasurements";
import getQuestions from "../questionnaire/getQuestions";
import { RadarChart } from "../../components/RadarChart";
import { Link, useHistory, Redirect } from "react-router-dom";
import firebase from "firebase";
import { UserAnswers } from "../questionnaire/saveUserAnswers";

export const OverviewScreen = () => {
    const userId = getUserId()!;
    const measurements = getMeasurements();
    const [answers, isAnswersLoading] = getUserAnswers(userId);
    const questions = getQuestions();

    if (!measurements || !answers || !questions) {
        return <p>Loading</p>;
    }

    if (answers.length === 0) {
        // User have no answers  
        // Return to main page?      
        return <Redirect to="/questionaire" />
    }

    const currentAnswers = answers[0].answers;
    const previousAnswers = answers[1]?.answers as UserAnswers | undefined;

    return (
        <div className="flex flex-col bg-background h-screen">
            <div className="flex flex-row items-center">
                <p className="text-3xl">Overview</p>
                <Link to="/questionaire">
                    <button className="ml-8 bg-red-400 rounded h-8 px-2">New test</button>
                </Link>
                <button className="mr-8 ml-auto" onClick={() => firebase.auth().signOut()}>Logout</button>
            </div>
            <div className="flex lg:flex-row flex-col">
                <div className="flex flex-1 flex-col">
                    <div className="flex flex-1 flex-col pl-8">
                        {measurements.map(m => {
                            const currentValue = Object.values(currentAnswers).flatMap(answers => answers).reduce((sum, answer) => sum + (answer.measurement === m ? answer.value : 0), 0)
                            const previousValue = Object.values(previousAnswers || {}).flatMap(answers => answers).reduce((sum, answer) => sum + (answer.measurement === m ? answer.value : 0), 0)

                            const diff = previousAnswers && (currentValue - previousValue);
                            return (
                                <div className="flex flex-col" key={m}>
                                    <div className="flex flex-row items-center">
                                        <p className="text-2xl mr-2">{m} {currentValue}/5</p>
                                        {diff !== undefined && (
                                            diff > 0 ? <p className="text-xl text-green-500">▲ {diff}</p> :
                                                diff < 0 ? <p className="text-xl text-red-800">▼ {Math.abs(diff)}</p> : null
                                        )
                                        }
                                    </div>
                                    {
                                        Object.values(currentAnswers).flatMap(answers => answers).filter(a => a.measurement === m).map(a => {
                                            const question = questions.find(q => q.answers.some(aa => aa.id === a.id));

                                            return (
                                                <div className="flex flex-col pl-8" key={a.id}>
                                                    <p className="italic">{question?.text}</p>
                                                    <p>>{a.text}</p>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                        }
                    </div>
                </div>
                <div className="m-16">
                    {measurements && <RadarChart
                        maxValue={5}
                        minValue={0}
                        measurements={measurements}
                        userAnswers={currentAnswers}
                        previousUserAnswers={previousAnswers}
                    />
                    }
                </div>
            </div>
        </div>
    )
};