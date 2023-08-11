import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { COMPONENT_KEYS, BASE_URL } from '../constants';
import ChildComponentA from './ChildComponentA';
import ParentComponent from './ParentComponent';

/**
 * A React component representing Child Component A with event handling.
 * @param {Object} props - Component props.
 * @param {string} props.clientId - The unique identifier of the client.
 * @param {Object} props.eventEmitter - The event emitter for communication.
 * @returns {JSX.Element} The rendered React component.
 */
const ChildComponentB = ({ clientId, eventEmitter }) => {
    const [notifications, setNotifications] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const options = [
        { value: ChildComponentB._key, label: ChildComponentB._name },
        { value: ChildComponentA._key, label: ChildComponentA._name },
        { value: ParentComponent._key, label: ParentComponent._name },
    ];

    // Subscribe to notifications from eventEmitter
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

    // Send event to Server for this component
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

    // Send event to specific components based on selected options
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

    // Handle selection change in the multi-select dropdown
    const onSelect = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
    };

    // Render component
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

// Static properties for the ChildComponentA component
ChildComponentB._name = 'Child Component B';
ChildComponentB._key = 'child-component-b';

export default ChildComponentB;
