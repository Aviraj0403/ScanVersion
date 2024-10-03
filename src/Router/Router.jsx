import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layout/AppLayout.jsx";
import Home from "../pages/Home/Home.jsx";
import Menu, { loader as menuLoader } from "../pages/menu/Menu.jsx";
import Cart from "../pages/cart/Cart.jsx";
import Order, { loader as orderLoader } from "../pages/order/Order.jsx";
import OrderError from "../pages/order/OrderError.jsx"; // Assuming you have a separate error component
import CreateOrder from "../pages/order/CreateOrder.jsx"; // Removed action import if not used

// Define the router configuration
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
        loader: menuLoader,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/order/new",
        element: <CreateOrder />, // Direct handling of form submission
      },
      {
        path: "/order/:orderId",
        element: <Order />,
        loader: orderLoader,
        errorElement: <OrderError />, // Ensure this points to a dedicated error component
      },
    ],
  },
]);

export default router;
