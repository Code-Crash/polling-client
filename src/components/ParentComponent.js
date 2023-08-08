import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useEventEmitter } from '../EventEmitterContext';
import ChildComponentA from './ChildComponentA';
import ChildComponentB from './ChildComponentB';

const BASE_URL = process.env.REACT_APP_BASE_URL || `http://localhost:3001`;

const ParentComponent = ({ clientId }) => {
    const eventEmitter = useEventEmitter();
    const [notifications, setNotifications] = useState([]);
    const [payload, setPayload] = useState('');

    useEffect(() => {
        const handleNotification = (notification) => {
            setNotifications((prevNotifications) => [...prevNotifications, notification]);
        };
        eventEmitter.on(ParentComponent._key, handleNotification);

        return () => {
            eventEmitter.off(ParentComponent._key, handleNotification);
        };
    }, [eventEmitter]);

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
                <ChildComponentA clientId={clientId} />
                <ChildComponentB clientId={clientId} />
            </div>
        </div>
    );
};

ParentComponent._name = 'Parent Component';
ParentComponent._key = 'parent-component';

export default ParentComponent;
