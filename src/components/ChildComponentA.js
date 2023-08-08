import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useEventEmitter } from '../EventEmitterContext';
import { COMPONENT_KEYS } from '../constants';

const BASE_URL = process.env.REACT_APP_BASE_URL || `http://localhost:3001`;

const ChildComponentA = ({ clientId }) => {
    const eventEmitter = useEventEmitter();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const handleNotification = (notification) => {
            setNotifications((prevNotifications) => [...prevNotifications, notification]);
        };
        eventEmitter.on(ChildComponentA._key, handleNotification);
        eventEmitter.on(COMPONENT_KEYS.wildcard, handleNotification);

        return () => {
            eventEmitter.off(ChildComponentA._key, handleNotification);
            eventEmitter.off(COMPONENT_KEYS.wildcard, handleNotification);
        };
    }, [eventEmitter]);

    const sendEvent = () => {
        axios.post(`${BASE_URL}/notify/${clientId}`,
            {
                name: ChildComponentA._name,
                subscriptions: [ChildComponentA._key]
            }
        ).then((response) => {
            console.log(`Event sent to client ${clientId} for component ${ChildComponentA._key}.`);
        }).catch((error) => {
            console.error(`Error sending event to client ${clientId} for component ${ChildComponentA._key}: ${error.message}`);
        });
    };

    return (
        <div className="child-component-a">
            <div className='actions'>
                <div className='component-name'> {ChildComponentA._name}</div>
                <button onClick={sendEvent}>Send Event</button>
            </div>
            <div className="notifications">
                <h4>Notifications for {`${ChildComponentA._name}`}</h4>
                <div className='notification-contents'>
                    {notifications.map((notification, index) => (
                        <code key={index}>{notification}</code>
                    ))}
                </div>
            </div>
        </div>
    );
};

ChildComponentA._name = 'Child Component A';
ChildComponentA._key = 'child-component-a';

export default ChildComponentA;
