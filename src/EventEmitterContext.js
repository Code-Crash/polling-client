import React, { createContext, useContext, useMemo } from 'react';

const EventEmitterContext = createContext();

export const useEventEmitter = () => {
    const context = useContext(EventEmitterContext);
    if (!context) {
        throw new Error('useEventEmitter must be used within an EventEmitterProvider');
    }
    return context;
};

export const EventEmitterProvider = ({ children }) => {
    const listeners = {};

    const emit = (eventName, payload) => {
        if (listeners[eventName]) {
            listeners[eventName].forEach((listener) => listener(payload));
        }
    };

    const on = (eventName, listener) => {
        if (!listeners[eventName]) {
            listeners[eventName] = [];
        }
        listeners[eventName].push(listener);
    };

    const off = (eventName, listener) => {
        if (listeners[eventName]) {
            listeners[eventName] = listeners[eventName].filter((l) => l !== listener);
        }
    };

    const value = useMemo(() => ({ emit, on, off }), []);

    return (
        <EventEmitterContext.Provider value={value}>
            {children}
        </EventEmitterContext.Provider>
    );
};
