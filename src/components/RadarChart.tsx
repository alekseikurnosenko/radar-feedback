import { Chart } from 'chart.js';
import React, { useEffect, useRef } from 'react';

export interface RadarChartProps {
    minValue: number;
    maxValue: number;
    measurements: string[];
    values: number[];
    previousValues?: number[];
}

export const RadarChart = (props: RadarChartProps) => {
    const { values, previousValues, measurements } = props;

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
                            data: values,
                            backgroundColor: 'rgba(0, 255, 0, 0.6)',
                        },
                        previousValues
                            ? {
                                  label: 'Previous',
                                  data: previousValues,
                                  backgroundColor: 'rgba(0, 255, 0, 0.1)',
                              }
                            : {},
                    ],
                };
                const options = {
                    scale: {
                        ticks: {
                            max: props.maxValue,
                            min: props.minValue,
                            stepSize: 1,
                        },
                    },
                    legend: {
                        display: previousValues !== undefined,
                    },
                };
                new Chart(context, {
                    type: 'radar',
                    data,
                    options,
                });
            }
        }
    }, [props]);

    return (
        <div className="shadow-md rounded-chart bg-white p-8" style={{ width: 500, height: 500 }}>
            <canvas ref={chartRef} width={500} height={500} />
        </div>
    );
};
