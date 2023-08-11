import React from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitterProvider } from './EventEmitterContext';
import ParentComponent from './components/ParentComponent';
import WebhookClient from './components/WebhookClient';

/**
 * The main application component that renders ParentComponent and WebhookClient.
 * Generates a unique clientId and stores it in localStorage if not found.
 * @returns {JSX.Element} The rendered React component.
 */
function App() {
  let clientId = localStorage.getItem('clientId'); // Retrieve clientId from localStorage

  if (!clientId) {
    clientId = uuidv4(); // Generate a unique client identifier if not found in localStorage
    localStorage.setItem('clientId', clientId); // Store clientId in localStorage
  }

  return (
    <EventEmitterProvider>
      <div className="App">
        <h1>{process.env.REACT_APP_TITLE || 'SSE Client'}</h1>
        {/* Render ParentComponent and WebhookClient */}
        <ParentComponent clientId={clientId} />
        <WebhookClient clientId={clientId} />
      </div>
    </EventEmitterProvider>
  );
}

// Static properties for the App component
App._name = 'App Component';
App._key = 'app-component';

export default App;
