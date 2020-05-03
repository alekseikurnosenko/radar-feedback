import React, { useRef, useEffect } from "react";
import { Chart } from 'chart.js';
import { UserAnswers } from "../screens/questionnaire/saveUserAnswers";

export interface RadarChartProps {
    minValue: number;
    maxValue: number;
    measurements: string[];
    userAnswers?: UserAnswers;
}

export const RadarChart = (props: RadarChartProps) => {
    const { userAnswers, measurements } = props;

    const userMeasurements = Object.values(userAnswers || {}).flatMap(answers => answers).reduce<{ [measurement: string]: number }>((measurements, answer) => ({
        ...measurements,
        [answer.measurement]: answer.value + (measurements[answer.measurement] || 0)
      }), {});
    
    const chartRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            const context = chartRef.current.getContext('2d');
            if (context) {
                

                const data = {
                    labels: measurements,
                    datasets: [
                        {
                            data: measurements.map(m => userMeasurements[m] || 0) 
                        }
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
                        display: false
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