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
  const [activeTables, setActiveTables] = useState([]); // Ensure this is initialized as an empty array
  const [activeOffers, setActiveOffers] = useState([]); // Ensure this is initialized as an empty array
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const { username, status: addressStatus } = useSelector((state) => state.user);
  const isLoadingAddress = addressStatus === "loading";
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const formErrors = useActionData();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice - (selectedOffer ? (totalCartPrice * selectedOffer.discountPercentage / 100) : 0);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const tables = await fetchActiveDiningTables();
        setActiveTables(tables || []); // Ensure we set an empty array if tables is undefined
      } catch (error) {
        console.error('Failed to fetch active tables:', error);
      }
    };

    const fetchOffersData = async () => {
      try {
        const offers = await fetchActiveOffer();
        setActiveOffers(offers || []); // Ensure we set an empty array if offers is undefined
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
    setSelectedOffer((prev) => (prev === offerId ? null : offerId));
  };

  return (
    <div className="px-4 py-6 bg-white rounded shadow-md">
      <h2 className="mb-8 text-2xl font-semibold text-center">Ready to order? Let&apos;s go!</h2>

      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            className="input grow border p-2 rounded"
            type="text"
            name="customer"
            required
            placeholder="e.g. John Doe"
            defaultValue={username || ''}
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <input
            className="input w-full border p-2 rounded"
            type="tel"
            name="phone"
            required
            placeholder="912 000 0000"
            defaultValue=""
          />
          {formErrors?.phone && (
            <p className="mt-2 bg-red-100 text-red-700 p-2 text-xs rounded-md">
              {formErrors.phone}
            </p>
          )}
        </div>

        {/* Table Selection */}
        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Select Table</label>
          <div className="grow">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {activeTables.map((table) => (
                <div
                  key={table.tableId}
                  className={`p-4 border rounded-md cursor-pointer transition duration-200 ${selectedTable === table.tableId ? 'bg-orange-200' : 'hover:bg-orange-100'}`}
                  onClick={() => handleTableSelect(table.tableId)}
                  onDoubleClick={() => handleTableSelect(table.tableId)}
                >
                  <h3 className="font-medium">{table.name}</h3>
                  <p className="text-sm">Size: {table.size}</p>
                  <span className="block mt-1 text-gray-500 text-xs italic">
                    {selectedTable === table.tableId ? "Selected" : "Click to select this table"}
                  </span>
                </div>
              ))}
            </div>
            {!selectedTable && <p className="mt-2 bg-red-100 text-red-700 p-2 text-xs rounded-md">Please select a table.</p>}
          </div>
        </div>

        {/* Offer Selection */}
        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Active Offers</label>
          <div className="grow">
            <div className="grid grid-cols-1 gap-4">
              {activeOffers.map((offer) => (
                <div
                  key={offer._id}
                  className={`p-4 border rounded-md cursor-pointer transition duration-200 ${selectedOffer === offer._id ? 'bg-orange-200' : 'hover:bg-orange-100'}`}
                  onClick={() => handleOfferSelect(offer._id)}
                  onDoubleClick={() => handleOfferSelect(offer._id)}
                >
                  <h3 className="font-medium">{offer.name}</h3>
                  <p className="text-sm">Discount: {offer.discountPercentage}%</p>
                  <p className="text-xs text-gray-500">
                    Valid from {new Date(offer.startDate).toLocaleDateString()} to {new Date(offer.endDate).toLocaleDateString()}
                  </p>
                  <span className="block mt-1 text-gray-500 text-xs italic">
                    {selectedOffer === offer._id ? "Selected" : "Click to select this offer"}
                  </span>
                </div>
              ))}
            </div>
            {activeOffers.length === 0 && (
              <p className="mt-2 bg-yellow-100 text-yellow-700 p-2 text-xs rounded-md">
                No active offers available at this time.
              </p>
            )}
          </div>
        </div>

        {/* Priority Option */}
        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-orange-400 focus:outline-none focus:ring focus:ring-orange-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            checked={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">Want to give your order priority?</label>
        </div>

        {/* Hidden Inputs */}
        <input type="hidden" name="cart" value={JSON.stringify(cart)} />
        <input type="hidden" name="selectedTable" value={selectedTable} />
        <input type="hidden" name="selectedOffer" value={selectedOffer} />

        {/* Submit Button */}
        <button
          disabled={isSubmitting || !selectedTable}
          className="rounded bg-orange-600 px-4 py-2 font-medium text-white disabled:opacity-50 hover:bg-orange-500 transition duration-200"
        >
          {isSubmitting ? "Placing order...." : `Order now from ${formatCurrency(totalPrice)}`}
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
