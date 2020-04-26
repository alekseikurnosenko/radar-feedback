import React from 'react';
import logo from './logo.svg';
import './App.css';
import { RadarChart } from './components/RadarChart';

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
    }
  ];

  return (
    <div className="App">
      <RadarChart maxValue={10} minValue={0} measurements={data} />
    </div>
  );
}

export default App;
