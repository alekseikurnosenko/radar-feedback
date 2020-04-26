import React, { useRef, useEffect } from "react";
import { Chart } from 'chart.js';

export interface Measurement {
    label: string,
    value: number;
}

export interface RadarChartProps {
    minValue: number;
    maxValue: number;
    measurements: Measurement[];
}

export const RadarChart = (props: RadarChartProps) => {
    console.log(JSON.stringify(props))
    const chartRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            const context = chartRef.current.getContext('2d');
            if (context) {
                

                const data = {
                    labels: props.measurements.map(m => m.label),
                    datasets: [
                        {
                            data: props.measurements.map(m => m.value) 
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
        <div style={{ width: 500, height: 500 }}>
            <canvas ref={chartRef} width={500} height={500} />
        </div>
    )

};