import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form } from "react-router-dom";
import EmptyCart from "../cart/EmptyCart";
import { fetchActiveDiningTables, fetchActiveOffer } from "../../services/apiRestaurant";
import { clearCart, getTotalCartPrice } from "../cart/cartSlice";
import { formatCurrency } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:4000/api/orders/create"; // Updated to point to the order endpoint
const restaurantId = "66f2f1c8f2696a3714a2d1ad"; // Hardcoded restaurant ID

const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(str);

const CreateOrder = () => {
  const [withPriority, setWithPriority] = useState(false);
  const [activeTables, setActiveTables] = useState([]);
  const [activeOffers, setActiveOffers] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.cart);
  const totalCartPrice = useSelector(getTotalCartPrice);

  // Calculate prices
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const offerDiscount = selectedOffer ? (totalCartPrice * (Number(selectedOffer.discountPercentage) || 0) / 100) : 0;
  const totalPrice = (totalCartPrice + priorityPrice - offerDiscount).toFixed(2); // Ensure this is a string

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const tables = await fetchActiveDiningTables();
        setActiveTables(tables || []);
      } catch (error) {
        console.error('Failed to fetch active tables:', error);
      }
    };

    const fetchOffersData = async () => {
      try {
        const offers = await fetchActiveOffer();
        setActiveOffers(offers || []);
      } catch (error) {
        console.error('Failed to fetch offers:', error);
      }
    };

    fetchTables();
    fetchOffersData();
  }, []);

  if (!cart.length) return <EmptyCart />;

  const handleTableSelect = (tableId) => {
    setSelectedTable((prev) => (prev === tableId ? null : tableId));
  };

  const handleOfferSelect = (offerId) => {
    if (selectedOffer && selectedOffer._id === offerId) {
      setSelectedOffer(null);
    } else {
      const selected = activeOffers.find((offer) => offer._id === offerId);
      setSelectedOffer(selected || null);
    }
  };

  const createOrder = async (order) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(order),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Order creation failed:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Current cart items:", cart);
    
    const order = {
      customer: e.target.customer.value,
      phone: e.target.phone.value,
      restaurantId,
      selectedTable: selectedTable,
      selectedOffer: selectedOffer?._id || null,  // Ensure the name matches
      cart: cart.map(item => ({
        fooditemId: item.fooditemId, // Ensure this matches 'fooditemId'
        quantity: item.quantity,
        // price: Number(item.price) || 0,
        // totalPrice: (Number(item.price) || 0) * (item.quantity || 1) 
      })),
      priority: withPriority,
    };
    console.log("Order to be submitted:", JSON.stringify(order, null, 2));
  
   
  const errors = {};
  if (!isValidPhone(order.phone)) errors.phone = "Please provide a valid phone number.";
  if (!order.selectedTable) errors.selectedTable = "Please select a table.";
  if (!order.cart || order.cart.length === 0) errors.cart = "Cart must be a non-empty array.";

  if (Object.keys(errors).length > 0) {
    setErrorMessage(errors.phone || errors.selectedTable || errors.cart);
    return;
  }

  try {
    const result = await createOrder(order);
    dispatch(clearCart());
    navigate(`/order/${result.orderId}`);
    // setSubmissionStatus(`Order placed successfully! Order ID: ${result.orderId}`);
    setErrorMessage(null);
  } catch (error) {
    setErrorMessage(error.message || "Failed to place order. Please try again.");
  }
};
  
  return (
    <div className="px-4 py-6 bg-white rounded shadow-md max-w-md mx-auto">
      <h2 className="mb-8 text-2xl font-semibold text-center">Ready to order? Let&apos;s go!</h2>

      <Form onSubmit={handleSubmit}>
        {/* Form fields */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
          <input
            className="border border-gray-300 rounded-lg shadow-sm p-2 w-full focus:ring focus:ring-orange-400 focus:outline-none transition duration-150"
            type="text"
            name="customer"
            required
            placeholder="e.g. BrTech"
          />
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
          <input
            className="border border-gray-300 rounded-lg shadow-sm p-2 w-full focus:ring focus:ring-orange-400 focus:outline-none transition duration-150"
            type="tel"
            name="phone"
            required
            placeholder="912 000 0000"
          />
          {errorMessage && <p className="mt-2 text-red-600 text-xs">{errorMessage}</p>}
        </div>

        {/* Table Selection */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">Select Table</label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {activeTables.map((table) => (
              <div
                key={table._id}
                className={`p-4 border rounded-md cursor-pointer transition duration-200 ${selectedTable === table._id ? 'bg-orange-200' : 'hover:bg-orange-100'}`}
                onClick={() => handleTableSelect(table._id)}
              >
                <h3 className="font-medium">{table.name}</h3>
                <p className="text-sm">Size: {table.size}</p>
                <span className="block mt-1 text-gray-500 text-xs italic">
                  {selectedTable === table._id ? "Selected" : "Click to select this table"}
                </span>
              </div>
            ))}
          </div>
          {!selectedTable && <p className="mt-2 text-red-600 text-xs">Please select a table.</p>}
        </div>

        {/* Offer Selection */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">Active Offers</label>
          <div className="grid grid-cols-1 gap-4">
            {activeOffers.map((offer) => (
              <div
                key={offer._id}
                className={`p-4 border rounded-md cursor-pointer transition duration-200 ${selectedOffer?._id === offer._id ? 'bg-orange-200' : 'hover:bg-orange-100'}`}
                onClick={() => handleOfferSelect(offer._id)}
              >
                <h3 className="font-medium">{offer.name}</h3>
                <p className="text-sm">Discount: {offer.discountPercentage}%</p>
                <p className="text-xs text-gray-500">
                  Valid from {new Date(offer.startDate).toLocaleDateString()} to {new Date(offer.endDate).toLocaleDateString()}
                </p>
                <span className="block mt-1 text-gray-500 text-xs italic">
                  {selectedOffer?._id === offer._id ? "Selected" : "Click to select this offer"}
                </span>
              </div>
            ))}
          </div>
          {activeOffers.length === 0 && (
            <p className="mt-2 text-yellow-700 text-xs">No active offers available at this time.</p>
          )}
        </div>

        {/* Priority Option */}
        <div className="mb-8 flex items-center gap-2">
          <input
            className="h-5 w-5 accent-orange-400 focus:ring focus:ring-orange-400"
            type="checkbox"
            name="priority"
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

      {submissionStatus && <p className="mt-4 text-green-600">{submissionStatus}</p>}
    </div>
  );
};

export default CreateOrder;
