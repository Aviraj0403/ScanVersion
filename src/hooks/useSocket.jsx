import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

// Update the API URL to the correct one
const BASE_API_URL = "https://backend-obet.onrender.com";  // Corrected base API URL

const useSocket = (onMessage) => {
    const socketRef = useRef(null);

    useEffect(() => {
        // Create the socket connection with the corrected base API URL
        socketRef.current = io(BASE_API_URL, {
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
