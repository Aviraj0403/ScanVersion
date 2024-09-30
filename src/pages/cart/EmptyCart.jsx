

import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 min-h-screen text-center">
      <p className="font-semibold text-lg mb-5">
        Your cart is still empty. Start adding some food items :)
      </p>

      <Link
        to="/menu"
        className="rounded-md px-6 py-3 font-medium text-white bg-orange-600 transition-all duration-300 ease-in-out hover:bg-orange-700"
      >
        Add to Cart
      </Link>

      <Link
        to="/menu"
        className="mt-4 text-orange-600 font-medium transition-all duration-300 ease-in-out hover:text-orange-800"
      >
        &larr; Back to menu
      </Link>
    </div>
  );
};

export default EmptyCart;
