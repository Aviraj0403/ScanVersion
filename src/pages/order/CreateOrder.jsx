import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form } from "react-router-dom";
import EmptyCart from "../cart/EmptyCart";
import { fetchActiveDiningTables, fetchActiveOffer } from "../../services/apiRestaurant";
import { getTotalCartPrice } from "../cart/cartSlice";
import { storeOrderTemporarily, setActiveTables, setActiveOffers } from "../../pages/order/orderSlice";
import { formatCurrency } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

const restaurantId = "66f2f1c8f2696a3714a2d1ad";

// Regex for validating phone numbers
const isValidPhone = (str) => 
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(str);

const CreateOrder = () => {
  const [withPriority, setWithPriority] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.cart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const activeTables = useSelector((state) => state.order.activeTables) || [];
  const activeOffers = useSelector((state) => state.order.activeOffers) || [];

  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const offerDiscount = selectedOffer ? (totalCartPrice * (Number(selectedOffer.discountPercentage) || 0) / 100) : 0;
  const totalPrice = parseFloat((totalCartPrice + priorityPrice - offerDiscount).toFixed(2));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tables, offers] = await Promise.all([
          fetchActiveDiningTables(),
          fetchActiveOffer(),
        ]);
        dispatch(setActiveTables(tables || []));
        dispatch(setActiveOffers(offers || []));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  if (!cart.length) return <EmptyCart />;

  const toggleTableSelect = (tableId) => {
    setSelectedTable(prev => (prev === tableId ? null : tableId));
  };

  const toggleOfferSelect = (offerId) => {
    const selected = activeOffers.find((offer) => offer._id === offerId);
    setSelectedOffer(prev => (selected && prev?._id !== offerId ? selected : null));
  };

  const validateOrder = (order) => {
    const errors = {};
    if (!isValidPhone(order.phone)) errors.phone = "Please provide a valid phone number.";
    if (!selectedTable) errors.selectedTable = "Please select a table.";
    if (!order.cart || order.cart.length === 0) errors.cart = "Cart must be a non-empty array.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const order = {
      customer: e.target.customer.value.trim(),
      phone: e.target.phone.value.trim(),
      restaurantId,
      selectedTable,
      selectedOffer: selectedOffer?._id || null,
      cart: cart.map(item => ({
        fooditemId: item.fooditemId,
        name: item.name,
        quantity: item.quantity,
      })),
      priority: withPriority,
    };

    const errors = validateOrder(order);
    if (Object.keys(errors).length > 0) {
      setErrorMessage(Object.values(errors).join(", "));
      return;
    }

    order.totalPrice = totalPrice;  // Add totalPrice directly to the order

    dispatch(storeOrderTemporarily(order));
    navigate('/order/payment');
  };

  return (
    <div className="px-4 py-6 bg-white rounded shadow-md max-w-md mx-auto">
      <h2 className="mb-8 text-2xl font-semibold text-center">Ready to order? Let&apos;s go!</h2>

      <Form onSubmit={handleSubmit}>
        {/* Customer Input Fields */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
          <input
            className="border border-gray-300 rounded-lg shadow-sm p-2 w-full"
            type="text"
            name="customer"
            required
            placeholder="e.g. John"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
          <input
            className="border border-gray-300 rounded-lg shadow-sm p-2 w-full"
            type="tel"
            name="phone"
            required
            placeholder="e.g. +1234567890"
          />
          {errorMessage && <p className="mt-2 text-red-600 text-xs">{errorMessage}</p>}
        </div>

        {/* Table Selection */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">Select Table</label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {activeTables.length > 0 ? (
              activeTables.map((table) => (
                <div
                  key={table._id}
                  className={`p-4 border rounded-md cursor-pointer transition duration-200 ${selectedTable === table._id ? 'bg-orange-200' : 'hover:bg-orange-100'}`}
                  onClick={() => toggleTableSelect(table._id)}
                >
                  <h3 className="font-medium">{table.name}</h3>
                  <p className="text-sm">Size: {table.size}</p>
                  <span className="block mt-1 text-gray-500 text-xs italic">
                    {selectedTable === table._id ? "Selected" : "Click to select this table"}
                  </span>
                </div>
              ))
            ) : (
              <p className="mt-2 text-red-600 text-xs">No tables available.</p>
            )}
          </div>
          {!selectedTable && <p className="mt-2 text-red-600 text-xs">Please select a table.</p>}
        </div>

        {/* Offer Selection */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">Active Offers</label>
          <div className="grid grid-cols-1 gap-4">
            {activeOffers.length > 0 ? (
              activeOffers.map((offer) => (
                <div
                  key={offer._id}
                  className={`p-4 border rounded-md cursor-pointer transition duration-200 ${selectedOffer?._id === offer._id ? 'bg-orange-200' : 'hover:bg-orange-100'}`}
                  onClick={() => toggleOfferSelect(offer._id)}
                >
                  <h3 className="font-medium">{offer.name}</h3>
                  <p className="text-sm">Discount: {offer.discountPercentage}%</p>
                  <span className="block mt-1 text-gray-500 text-xs italic">
                    {selectedOffer?._id === offer._id ? "Selected" : "Click to select this offer"}
                  </span>
                </div>
              ))
            ) : (
              <p className="mt-2 text-yellow-700 text-xs">No active offers available at this time.</p>
            )}
          </div>
        </div>

        {/* Priority Option */}
        <div className="mb-8 flex items-center gap-2">
          <input
            className="h-5 w-5 accent-orange-400"
            type="checkbox"
            id="priority"
            checked={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium text-sm">Want to give your order priority?</label>
        </div>

        {/* Submit Button */}
        <button
          className="w-full rounded-lg bg-orange-600 px-4 py-2 font-medium text-white hover:bg-orange-500 transition duration-200"
          type="submit"
        >
          Order now from {formatCurrency(totalPrice)}
        </button>
      </Form>
    </div>
  );
};

export default CreateOrder;


//Work reduc from here new update