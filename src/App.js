import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const BASE_URL = process.env.REACT_APP_BASE_URL || `http://localhost:3001`;

function App() {
  const [notifications, setNotifications] = useState([]);
  const [payload, setPayload] = useState();
  let clientId = localStorage.getItem('clientId'); // Retrieve clientId from localStorage

  if (!clientId) {
    clientId = uuidv4(); // Generate a unique client identifier if not found in localStorage
    localStorage.setItem('clientId', clientId); // Store clientId in localStorage
  }

  useEffect(() => {
    const eventSource = new EventSource(`${BASE_URL}/subscribe/${clientId}`);
    eventSource.onmessage = (event) => {
      console.log('Received event:', event);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        event.data,
      ]);
    };

    eventSource.onclose = () => {
      console.log('Connection closed.');
      // Handle reconnection or cleanup if needed
    };

    eventSource.onopen = () => {
      console.log('Connection open.');
      // Handle reconnection or cleanup if needed
    };

    eventSource.onerror = (error) => {
      console.log('Connection error:', error);
      // Handle reconnection or cleanup if needed
    };
    return () => {
      eventSource.close();
    };
  }, [clientId]);

  const sendEvent = () => {
    axios.post(`${BASE_URL}/notify/${clientId}`, { data: payload })
      .then((response) => {
        console.log(`Event sent to ${clientId}.`);
        console.log(`Event sent response ${response.status}.`);
      })
      .catch((error) => {
        console.error(`Error sending event to ${clientId}: ${error.message}`);
      });
  };

  return (
    <div className="App">
      <h1>{process.env.REACT_APP_TITLE || 'Polling Client'}</h1>
      <input onChange={(e) => { setPayload(e.target.value) }} />
      <button onClick={sendEvent}>Send Event</button>
      <div className="Notifications">
        {notifications.map((notification, index) => (
          <p key={index}>{notification}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
