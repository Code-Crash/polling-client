import React, { createContext, useContext, useMemo, useCallback } from 'react';

// Create a context for the event emitter
const EventEmitterContext = createContext();

/**
 * Custom hook for accessing the event emitter context.
 * @returns {object} The event emitter context.
 * @throws {Error} Throws an error if used outside of an EventEmitterProvider.
 */
export const useEventEmitter = () => {
    const context = useContext(EventEmitterContext);
    if (!context) {
        throw new Error('useEventEmitter must be used within an EventEmitterProvider');
    }
    return context;
};

/**
 * A component that provides event emitter functionality to its descendants.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 * @returns {React.ReactNode} The wrapped components with access to the event emitter context.
 */
export const EventEmitterProvider = ({ children }) => {
    // Store event listeners using a memoized object
    const listeners = useMemo(() => ({}), []);

    /**
     * Emit an event with optional payload, invoking all registered listeners.
     * @param {string} eventName - The name of the event to emit.
     * @param {*} payload - The data payload associated with the event.
     */
    const emit = useCallback((eventName, payload) => {
        if (listeners[eventName]) {
            listeners[eventName].forEach((listener) => listener(payload));
        }
    }, [listeners]);

    /**
     * Register an event listener for a specific event.
     * @param {string} eventName - The name of the event to listen for.
     * @param {function} listener - The callback function to be invoked when the event is emitted.
     */
    const on = useCallback((eventName, listener) => {
        if (!listeners[eventName]) {
            listeners[eventName] = [];
        }
        listeners[eventName].push(listener);
    }, [listeners]);

    /**
     * Unregister an event listener for a specific event.
     * @param {string} eventName - The name of the event to remove the listener from.
     * @param {function} listener - The callback function to be removed from the listeners.
     */
    const off = useCallback((eventName, listener) => {
        if (listeners[eventName]) {
            listeners[eventName] = listeners[eventName].filter((l) => l !== listener);
        }
    }, [listeners]);

    // Create the value object to be provided to the context
    const value = useMemo(() => ({ emit, on, off }), [emit, on, off]);

    // Provide the event emitter context to the descendants
    return (
        <EventEmitterContext.Provider value={value}>
            {children}
        </EventEmitterContext.Provider>
    );
};
