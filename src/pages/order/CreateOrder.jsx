import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import EmptyCart from "../cart/EmptyCart";
import { createOrder, fetchActiveDiningTables, fetchActiveOffer } from "../../services/apiRestaurant";
import store from "../../store";
import { clearCart, getTotalCartPrice } from "../cart/cartSlice";
import { formatCurrency } from "../../utils/helpers";

const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(str);

const CreateOrder = () => {
  const [withPriority, setWithPriority] = useState(false);
  const [activeTables, setActiveTables] = useState([]);
  const [activeOffers, setActiveOffers] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const { username } = useSelector((state) => state.user);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const formErrors = useActionData();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const offerDiscount = selectedOffer ? (Number(selectedOffer.discountPercentage) || 0) : 0;
  const totalPrice = totalCartPrice + priorityPrice - (totalCartPrice * offerDiscount / 100);

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

  const handleOfferDoubleClick = (offerId) => {
    if (selectedOffer && selectedOffer._id === offerId) {
      setSelectedOffer(null);
    }
  };

  return (
    <div className="px-4 py-6 bg-white rounded shadow-md max-w-md mx-auto">
      <h2 className="mb-8 text-2xl font-semibold text-center">Ready to order? Let&apos;s go!</h2>

      <Form method="POST">
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
          <input
            className="border border-gray-300 rounded-lg shadow-sm p-2 w-full focus:ring focus:ring-orange-400 focus:outline-none transition duration-150"
            type="text"
            name="customer"
            required
            placeholder="e.g. BrTech"
            defaultValue={username || ''}
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
            defaultValue=""
          />
          {formErrors?.phone && (
            <p className="mt-2 text-red-600 text-xs">{formErrors.phone}</p>
          )}
        </div>

        {/* Table Selection */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">Select Table</label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {activeTables.map((table) => (
              <div
                key={table.tableId}
                className={`p-4 border rounded-md cursor-pointer transition duration-200 ${selectedTable === table.tableId ? 'bg-orange-200' : 'hover:bg-orange-100'}`}
                onClick={() => handleTableSelect(table.tableId)}
              >
                <h3 className="font-medium">{table.name}</h3>
                <p className="text-sm">Size: {table.size}</p>
                <span className="block mt-1 text-gray-500 text-xs italic">
                  {selectedTable === table.tableId ? "Selected" : "Click to select this table"}
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
                onDoubleClick={() => handleOfferDoubleClick(offer._id)}
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

        {/* Hidden Inputs */}
        <input type="hidden" name="cart" value={JSON.stringify(cart)} />
        <input type="hidden" name="selectedTable" value={selectedTable} />
        <input type="hidden" name="selectedOffer" value={selectedOffer?._id || ''} />

        {/* Submit Button */}
        <button
          disabled={isSubmitting || !selectedTable}
          className="w-full rounded-lg bg-orange-600 px-4 py-2 font-medium text-white disabled:opacity-50 hover:bg-orange-500 transition duration-200"
        >
          {isSubmitting ? "Placing order..." : `Order now from ${formatCurrency(totalPrice)}`}
        </button>
      </Form>
    </div>
  );
};

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
    selectedTable: data.selectedTable,
    selectedOffer: data.selectedOffer,
  };

  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone = "Please provide a valid phone number.";

  if (!order.selectedTable)
    errors.selectedTable = "Please select a table.";

  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
