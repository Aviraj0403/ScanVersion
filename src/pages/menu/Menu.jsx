import { useLoaderData } from "react-router-dom";
import MenuItem from "./MenuItem.jsx";
import { getMenu } from "../../services/apiRestaurant.js";

const Menu = () => {
  const menu = useLoaderData(); // Fetch data from your backend using `getMenu`

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {menu.map((item) => (
          <MenuItem key={item._id} fooditem={item} /> 
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
