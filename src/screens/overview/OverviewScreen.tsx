import React from "react";
import getUserAnswers from "./getUserAnswers";
import { getUserId } from "./getUserId";
import getMeasurements from "../questionnaire/getMeasurements";
import getQuestions from "../questionnaire/getQuestions";
import { RadarChart } from "../../components/RadarChart";
import { Link } from "react-router-dom";
import firebase from "firebase";

export const OverviewScreen = () => {
    const userId = getUserId()!;
    const measurements = getMeasurements();
    const answers = getUserAnswers(userId);
    const questions = getQuestions();

    if (!measurements || !answers || !questions) {
        return <p>Loading</p>;
    }

    return (
        <div className="flex flex-col bg-background h-screen">
            <div className="flex flex-row items-center">
                <p className="text-3xl">Overview</p>
                <Link to="/questionaire">
                    <button className="ml-8 bg-red-400 rounded h-8 px-2">New test</button>
                </Link>
                <button className="mr-8 ml-auto" onClick={() => firebase.auth().signOut()}>Logout</button>
            </div>
            <div className="flex flex-row">
                <div className="flex flex-1 flex-col">
                    <div className="flex flex-1 flex-col pl-8">
                        {measurements.map(m => {
                            const value = answers.reduce((sum, answer) => sum + (answer.measurement === m ? answer.value : 0), 0)

                            return (
                                <div className="flex flex-col">
                                    <p className="text-2xl">{m} {value}/10</p>
                                    {
                                        answers.filter(a => a.measurement === m).map(a => {
                                            const question = questions.find(q => q.answers.some(aa => aa.id === a.id))!;

                                            return (
                                                <div className="flex flex-col pl-8">
                                                    <p className="italic">{question.text}</p>
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
                        maxValue={10}
                        minValue={0}
                        measurements={measurements.map(m => ({ label: m, value: Object.values(answers).reduce((sum, answer) => sum + (answer.measurement === m ? answer.value : 0), 0) }))}
                    />
                    }
                </div>
            </div>
        </div>
    )
};