import React, { useState } from 'react';
import axios from 'axios';
import ParentComponent from './ParentComponent';
import { BASE_URL } from '../constants';

/**
 * A React component representing a webhook client to send test events.
 * @param {Object} props - Component props.
 * @param {string} props.clientId - The unique identifier of the client.
 * @returns {JSX.Element} The rendered React component.
 */
const WebhookClient = ({ clientId }) => {
  const [payload, setPayload] = useState('');

  /**
   * Sends a test event via a webhook.
   */
  const sendEvent = () => {
    axios.post(`${BASE_URL}/webhook/${clientId}`,
      {
        name: WebhookClient._name,
        payload: payload || '',
        subscriptions: [ParentComponent._key]
      }
    ).then((response) => {
      console.log(`Event sent to client ${clientId} for component ${WebhookClient._key}.`);
    }).catch((error) => {
      console.error(`Error sending event to client ${clientId} for component ${WebhookClient._key}: ${error.message}`);
    });
  };

  return (
    <div>
      <div className='actions'>
        <div className='component-name'> {WebhookClient._name}</div>
        <input onChange={(e) => { setPayload(e.target.value) }} />
        <button onClick={sendEvent}>Send Webhook Test Event</button>
      </div>
    </div>
  );
};

// Static properties for the WebhookClient component
WebhookClient._name = 'Webhook Component';
WebhookClient._key = 'webhook-component';

export default WebhookClient;
