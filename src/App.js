import React from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitterProvider } from './EventEmitterContext';
import ParentComponent from './components/ParentComponent';

function App() {
  let clientId = localStorage.getItem('clientId'); // Retrieve clientId from localStorage

  if (!clientId) {
    clientId = uuidv4(); // Generate a unique client identifier if not found in localStorage
    localStorage.setItem('clientId', clientId); // Store clientId in localStorage
  }

  return (
    <EventEmitterProvider>
      <div className="App">
        <h1>{process.env.REACT_APP_TITLE || 'Polling Client'}</h1>
        <ParentComponent clientId={clientId} />
      </div>
    </EventEmitterProvider>
  );
}

App._name = 'App Component';
App._key = 'app-component';

export default App;
