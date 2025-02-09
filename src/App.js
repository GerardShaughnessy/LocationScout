import React from 'react';
import MapTest from './components/Map/MapTest';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>LocationScout</h1>
      <div style={{ padding: '20px' }}>
        <MapTest />
      </div>
    </div>
  );
}

export default App;
