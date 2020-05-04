import React, { useRef, useEffect } from "react";
import { Chart } from 'chart.js';
import { UserAnswers } from "../screens/questionnaire/saveUserAnswers";

export interface RadarChartProps {
    minValue: number;
    maxValue: number;
    measurements: string[];
    userAnswers?: UserAnswers;
    previousUserAnswers?: UserAnswers;
}

const convertAnswers = (answers: UserAnswers | undefined, measurements: string[]) => {
    const userMeasurements = Object.values(answers || {})
        .flatMap(answers => answers)
        .reduce<{ [measurement: string]: number }>((measurements, answer) => ({
            ...measurements,
            [answer.measurement]: answer.value + (measurements[answer.measurement] || 0)
        }), {});

        return measurements.map(m => userMeasurements[m] || 0);
}

export const RadarChart = (props: RadarChartProps) => {
    const { userAnswers, previousUserAnswers, measurements } = props;

    const userMeasurements = convertAnswers(userAnswers, measurements);
    const hasPrevious = previousUserAnswers !== undefined;
    const previousUserMeasurements = convertAnswers(previousUserAnswers, measurements);

    const chartRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            const context = chartRef.current.getContext('2d');
            if (context) {


                const data = {
                    labels: measurements,
                    datasets: [
                        {
                            label: 'Current',
                            data: userMeasurements,
                            backgroundColor: 'rgba(0, 255, 0, 0.6)',
                        },
                        hasPrevious ? {
                            label: 'Previous',
                            data: previousUserMeasurements,
                            backgroundColor: 'rgba(0, 255, 0, 0.1)',
                        } : {}
                    ]
                };
                const options = {
                    scale: {
                        ticks: {
                            max: props.maxValue,
                            min: props.minValue,
                        }
                    },
                    legend: {
                        display: hasPrevious
                    }
                };
                const chart = new Chart(context, {
                    type: 'radar',
                    data,
                    options
                })

            }
        }

    }, [props])

    return (
        <div className="shadow-md rounded-chart bg-white p-8" style={{ width: 500, height: 500 }}>
            <canvas ref={chartRef} width={500} height={500} />
        </div>
    )

};