import React from 'react';
import Calendar from './components/Calendar.jsx';
import Navbar from './components/Navbar.jsx';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Calendar />
      </main>
    </div>
  );
}

export default App;
