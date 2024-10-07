import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const useSocket = (onMessage) => {
    const socketRef = useRef(null);

    useEffect(() => {
        // Create the socket connection
        socketRef.current = io('http://localhost:4000', {
            transports: ['websocket'], // Use websocket transport
            reconnection: true,        // Enable reconnection
            reconnectionAttempts: 5,   // Number of reconnection attempts
            reconnectionDelay: 1000,   // Delay between reconnection attempts
        });

        // Listen for messages
        socketRef.current.on('message', onMessage);

        // Handle connection errors
        socketRef.current.on('connect_error', (err) => {
            console.error('Connection Error:', err);
        });

        // Handle disconnection
        socketRef.current.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

        // Cleanup on unmount
        return () => {
            socketRef.current.disconnect();
        };
    }, [onMessage]);

    return socketRef.current; // Return the socket instance if needed
};

export default useSocket;
