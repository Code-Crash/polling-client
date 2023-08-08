import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useEventEmitter } from '../EventEmitterContext';
import { COMPONENT_KEYS } from '../constants';
import ChildComponentA from './ChildComponentA';
import ParentComponent from './ParentComponent';

const BASE_URL = process.env.REACT_APP_BASE_URL || `http://localhost:3001`;

const ChildComponentB = ({ clientId }) => {
    const eventEmitter = useEventEmitter();
    const [notifications, setNotifications] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const options = [
        { value: ChildComponentB._key, label: ChildComponentB._name },
        { value: ChildComponentA._key, label: ChildComponentA._name },
        { value: ParentComponent._key, label: ParentComponent._name },
    ];

    useEffect(() => {
        const handleNotification = (notification) => {
            setNotifications((prevNotifications) => [...prevNotifications, notification]);
        };
        eventEmitter.on(ChildComponentB._key, handleNotification);
        eventEmitter.on(COMPONENT_KEYS.wildcard, handleNotification);

        return () => {
            eventEmitter.off(ChildComponentB._key, handleNotification);
            eventEmitter.off(COMPONENT_KEYS.wildcard, handleNotification);
        };
    }, [eventEmitter]);

    const sendEvent = () => {
        axios.post(`${BASE_URL}/notify/${clientId}`,
            {
                name: ChildComponentB._name,
                subscriptions: [ChildComponentB._key]
            }
        ).then((response) => {
            console.log(`Event sent to client ${clientId} for component ${ChildComponentB._key}.`);
        }).catch((error) => {
            console.error(`Error sending event to client ${clientId} for component ${ChildComponentB._key}: ${error.message}`);
        });
    };

    const sendEventToComponent = () => {
        axios.post(`${BASE_URL}/notify/${clientId}`,
            {
                name: ChildComponentB._name,
                events: selectedOptions.map((option) => {
                    return option.value;
                }),
                subscriptions: selectedOptions.map((option) => {
                    return option.value;
                }),
            }
        ).then((response) => {
            console.log(`Event sent to client ${clientId} for component ${ChildComponentB._key}.`);
        }).catch((error) => {
            console.error(`Error sending event to client ${clientId} for component ${ChildComponentB._key}: ${error.message}`);
        });
    };

    const onSelect = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
    };

    return (
        <div className="child-component-b">
            <div className='actions'>
                <div className='component-name'> {ChildComponentB._name}</div>
                <button onClick={sendEvent}>Send Event</button>
            </div>
            <div className="notifications">
                <h4>Notifications for {`${ChildComponentB._name}`}</h4>
                <div className='notification-contents'>
                    {notifications.map((notification, index) => (
                        <code key={index}>{notification}</code>
                    ))}
                </div>
            </div>
            <h4>Send Event to Specific Component</h4>
            <div className='select-actions'>
                <Select
                    isMulti
                    options={options}
                    value={selectedOptions}
                    onChange={onSelect}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                />
                <button onClick={sendEventToComponent}>Send Event</button>
            </div>
        </div>
    );
};

ChildComponentB._name = 'Child Component B';
ChildComponentB._key = 'child-component-b';

export default ChildComponentB;
