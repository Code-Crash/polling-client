import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { COMPONENT_KEYS, BASE_URL } from '../constants';
import ChildComponentB from './ChildComponentB';
import ParentComponent from './ParentComponent';

/**
 * A React component representing Child Component A with event handling.
 * @param {Object} props - Component props.
 * @param {string} props.clientId - The unique identifier of the client.
 * @param {Object} props.eventEmitter - The event emitter for communication.
 * @returns {JSX.Element} The rendered React component.
 */
const ChildComponentA = ({ clientId, eventEmitter }) => {
    const [notifications, setNotifications] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const options = [
        { value: ChildComponentA._key, label: ChildComponentA._name },
        { value: ChildComponentB._key, label: ChildComponentB._name },
        { value: ParentComponent._key, label: ParentComponent._name },
    ];

    // Subscribe to notifications from eventEmitter
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

    // Send event to Server for this component
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

    // Send event to specific components based on selected options
    const sendEventToComponent = () => {
        axios.post(`${BASE_URL}/notify/${clientId}`,
            {
                name: ChildComponentA._name,
                events: selectedOptions.map((option) => {
                    return option.value;
                }),
                subscriptions: selectedOptions.map((option) => {
                    return option.value;
                }),
            }
        ).then((response) => {
            console.log(`Event sent to client ${clientId} for component ${ChildComponentA._key}.`);
        }).catch((error) => {
            console.error(`Error sending event to client ${clientId} for component ${ChildComponentA._key}: ${error.message}`);
        });
    };

    // Handle selection change in the multi-select dropdown
    const onSelect = (selectedOptions) => {
        setSelectedOptions(selectedOptions);
    };

    // Render component
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
ChildComponentA._name = 'Child Component A';
ChildComponentA._key = 'child-component-a';

export default ChildComponentA;
