import React, { useRef, useEffect } from "react";
import { Chart } from 'chart.js';

export const RadarChart = () => {

    const chartRef = useRef<HTMLCanvasElement | null>(null);
    
    useEffect(() => {
        if (chartRef.current) {
            const context = chartRef.current.getContext('2d');
            if (context) {
    
                const data = {
                    labels: ['Jumping', 'Running', 'Swimming', 'Skiing', 'Playing chess'],
                    datasets: [
                        {
                            data: [5, 3, 1, 1, 9]
                        }
                    ]
                };
                const options = {
                    scale: {
                        ticks: {
                            max: 10,
                            min: 0
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
    
    }, [])

    return (
        <div style={{ width: 500, height: 500 }}>
            <canvas ref={chartRef} width={500} height={500} />
        </div>
    )

};