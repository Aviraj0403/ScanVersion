import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [restaurantId, setRestaurantId] = useState(null); // State for restaurantId
  const [loading, setLoading] = useState(true); // State to track if data is loading
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Try to fetch restaurantId from localStorage or another source
    const fetchRestaurantId = () => {
      try {
        const storedRestaurantId = localStorage.getItem('restaurantId');  // Or fetch from other sources
        if (storedRestaurantId) {
          setRestaurantId(storedRestaurantId);
        } else {
          setError("No restaurant ID found in storage.");
        }
      } catch (err) {
        // Catch potential errors from localStorage access
        setError("Failed to fetch restaurant ID.");
        console.error("Error fetching restaurantId:", err);
      } finally {
        setLoading(false);  // Set loading to false once operation is complete
      }
    };

    fetchRestaurantId();
  }, []);  // Empty dependency array means this effect runs only once

  // While data is loading or there's an error, we can render a loading state or an error message
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <RestaurantContext.Provider value={{ restaurantId, setRestaurantId }}>
      {children}
    </RestaurantContext.Provider>
  );
};

// Custom hook to access the restaurantId from context
export const useRestaurantContext = () => useContext(RestaurantContext);
