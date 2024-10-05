import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layout/AppLayout.jsx";
import Home from "../pages/Home/Home.jsx";
import Menu, { loader as menuLoader } from "../pages/menu/Menu.jsx"; // Import the loader
import Cart from "../pages/cart/Cart.jsx";
import CreateOrder from "../pages/order/CreateOrder.jsx"; 
import Payment from "../pages/order/Payment.jsx"; 
import Confirmation from "../pages/order/Confirmation.jsx"; 

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/menu", element: <Menu />, loader: menuLoader }, // Attach the loader here
      { path: "/cart", element: <Cart /> },
      { path: "/order/new", element: <CreateOrder /> }, 
      { path: "/order/payment", element: <Payment /> }, 
      { path: "/order/confirmation", element: <Confirmation /> }, 
    ],
  },
]);

export default router;
