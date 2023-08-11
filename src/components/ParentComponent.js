import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useEventEmitter } from '../EventEmitterContext';
import { BASE_URL } from '../constants';
import ChildComponentA from './ChildComponentA';
import ChildComponentB from './ChildComponentB';

/**
 * A React component representing the parent component with event handling.
 * @param {Object} props - Component props.
 * @param {string} props.clientId - The unique identifier of the client.
 * @returns {JSX.Element} The rendered React component.
 */
const ParentComponent = ({ clientId }) => {
    const eventEmitter = useEventEmitter();
    const [notifications, setNotifications] = useState([]);
    const [payload, setPayload] = useState('');

    // Subscribe to notifications from Child Components
    useEffect(() => {
        const handleNotification = (notification) => {
            setNotifications((prevNotifications) => [...prevNotifications, notification]);
        };
        eventEmitter.on(ParentComponent._key, handleNotification);

        return () => {
            eventEmitter.off(ParentComponent._key, handleNotification);
        };
    }, [eventEmitter]);

    // Establish connection to Server-Sent Events (SSE)
    useEffect(() => {
        const eventSource = new EventSource(`${BASE_URL}/subscribe/${clientId}`);
        eventSource.onmessage = (event) => {
            console.log('Received event:', event);
            const data = JSON.parse(event.data || '{}');
            setNotifications((prevNotifications) => [
                ...prevNotifications,
                event.data,
            ]);
            // Component Event Filter
            if (data && data.subscriptions) {
                (data.subscriptions || []).forEach((componentId) => {
                    eventEmitter.emit(componentId, JSON.stringify(data.payload || {}));
                });
            }
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

    // Send event to Server
    const sendEvent = () => {
        axios.post(`${BASE_URL}/notify/${clientId}`,
            {
                name: ParentComponent._name,
                payload: payload || '',
                subscriptions: ['*']
            }
        ).then((response) => {
            console.log(`Event sent to client ${clientId} for component ${ParentComponent._key}.`);
        }).catch((error) => {
            console.error(`Error sending event to client ${clientId} for component ${ParentComponent._key}: ${error.message}`);
        });
    };

    // Render component
    return (
        <div className="parent">
            <div className='actions'>
                <div className='component-name'> {ParentComponent._name}</div>
                <input onChange={(e) => { setPayload(e.target.value) }} />
                <button onClick={sendEvent}>Send Event</button>
            </div>
            <div className="notifications">
                <h4>Notifications for {`${ParentComponent._name}`}</h4>
                <div className='notification-contents'>
                    {notifications.map((notification, index) => (
                        <code key={index}>{notification}</code>
                    ))}
                </div>
            </div>
            <div className='children'>
                <ChildComponentA clientId={clientId} eventEmitter={eventEmitter} />
                <ChildComponentB clientId={clientId} eventEmitter={eventEmitter} />
            </div>
        </div>
    );
};

ParentComponent._name = 'Parent Component';
ParentComponent._key = 'parent-component';

export default ParentComponent;
