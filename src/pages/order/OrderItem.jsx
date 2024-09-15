import { formatCurrency } from "../../utils/helpers";

const OrderItem = ({ item }) => {
  const { foodItemId, name, quantity, totalPrice } = item;

  return (
    <li className="py-3 flex justify-between">
      <p>{quantity} x {name}</p>
      <p>{formatCurrency(totalPrice)}</p>
    </li>
  );
};

export default OrderItem;
