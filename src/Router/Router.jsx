import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layout/AppLayout.jsx";
import Home from "../pages/Home/Home.jsx";
import Menu, { loader as menuLoader } from "../pages/menu/Menu.jsx";
import Cart from "../pages/cart/Cart.jsx";
import Order, { loader as orderLoader } from "../pages/order/Order.jsx";
import OrderError from "../pages/order/Order.jsx";
import CreateOrder, {
  action as createOrderAction,
} from "../pages/order/CreateOrder.jsx";
import { action as updateOrderAction } from "../pages/order/UpdateOrder.jsx";

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
        element: <CreateOrder />,
        action: createOrderAction,
      },
      {
        path: "/order/:orderId",
        element: <Order />,
        loader: orderLoader,
        errorElement: <OrderError />,
        action: updateOrderAction,
      },
    ],
  },
]);

export default router;
