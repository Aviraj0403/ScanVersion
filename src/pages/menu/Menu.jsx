import { useLoaderData } from "react-router-dom";
import MenuItem from "./MenuItem.jsx";
//import PromoCard from "../../components/Promo/PromoCard.jsx";
import { getMenu } from "../../services/apiRestaurant.js";

// const promoItems = [
//   {
//     type: 'mexican-pizza',
//     title: "Mexican Pizza",
//     description: "Brief description of the Mexican Pizza.",
//   },
//   {
//     type: 'soft-drinks',
//     title: "Soft Drinks",
//     description: "Brief description of soft drinks.",
//   },
//   // Add more promo items here
// ];

const Menu = () => {
  const menu = useLoaderData();

  return (
    <div>
      {/* <div className="promo-section mb-4">
        <div className="container">
          <ul className="promo-list has-scrollbar">
            {promoItems.map((item, index) => (
              <li key={index} className="promo-item">
                <PromoCard 
                  promoType={item.type}
                  title={item.title}
                  description={item.description}
                />
              </li>
            ))}
          </ul>
        </div>
      </div> */}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {menu.map((item) => (
          <MenuItem key={item.id} pizza={item} />
        ))}
      </div>
    </div>
  );
};

export async function loader() {
  const menu = await getMenu();
  return menu;
}

export default Menu;
