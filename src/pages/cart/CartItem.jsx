import { FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { formatCurrency } from "../../utils/helpers";
import { getCurrentQuantityById, removeItem } from "./cartSlice";
import UpdateItemQuantity from "./UpdateItemQuantity";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const { fooditemId, name, quantity, totalPrice } = item;

  const currentQuantity = useSelector(getCurrentQuantityById(fooditemId));

  return (
    <li className="py-3 sm:flex sm:items-center sm:justify-between">
      <p className="mb-1 sm:mb-0">
        {quantity}&times; {name}
      </p>
      <div className="flex items-center justify-between sm:gap-6">
        <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>
        <div className="rounded-lg bg-gray-200 p-1">
          <UpdateItemQuantity fooditemId={fooditemId} quantity={currentQuantity} />
        </div>
        <button onClick={() => dispatch(removeItem(fooditemId))}>
          <FiX />
        </button>
      </div>
    </li>
  );
};

export default CartItem;
