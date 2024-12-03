import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // Extract restaurantId
import { getMenu, getDiningTables, getOffer } from '../../services/apiRestaurant'; // API functions

const Menu = () => {
  const { restaurantId } = useParams();  // Extract restaurantId from the URL
  const [menu, setMenu] = useState([]);
  const [diningTables, setDiningTables] = useState([]);
  const [activeOffers, setActiveOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch data for the menu, dining tables, and active offers
        const menuData = await getMenu(restaurantId);
        const tablesData = await getDiningTables(restaurantId, 'Active');
        const offersData = await getOffer(restaurantId, 'Active');

        // Set the fetched data to state
        setMenu(menuData);
        setDiningTables(tablesData);
        setActiveOffers(offersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [restaurantId]);  // Dependency array ensures the effect runs when restaurantId changes

  if (loading) {
    return <p>Loading menu...</p>;
  }

  return (
    <div>
      <h1>Menu for Restaurant {restaurantId}</h1>
      {/* Render menu items */}
      <div>
        {menu.map(item => (
          <div key={item.id}>
            <h2>{item.name}</h2>
            {/* Render other item details */}
          </div>
        ))}
      </div>

      {/* Display Dining Tables */}
      <div>
        <h2>Dining Tables</h2>
        {diningTables.map(table => (
          <div key={table.id}>
            <p>Table: {table.name}</p>
            {/* More table details */}
          </div>
        ))}
      </div>

      {/* Display Active Offers */}
      <div>
        <h2>Active Offers</h2>
        {activeOffers.map(offer => (
          <div key={offer.id}>
            <p>{offer.description}</p>
            {/* More offer details */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
