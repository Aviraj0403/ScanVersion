import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import EmptyCart from "../cart/EmptyCart";
import { createOrder } from "../../services/apiRestaurant";
import store from "../../store";
import { clearCart, getTotalCartPrice } from "../cart/cartSlice";
import { formatCurrency } from "../../utils/helpers";
import { fetchActiveDiningTables } from "../../services/apiRestaurant";

const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(str);

const CreateOrder = () => {
  const [withPriority, setWithPriority] = useState(false);
  const [activeTables, setActiveTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  const { username, status: addressStatus } = useSelector((state) => state.user);
  const isLoadingAddress = addressStatus === "loading";
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const formErrors = useActionData();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  // Fetch active tables on component mount
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const tables = await fetchActiveDiningTables();
        setActiveTables(tables);
      } catch (error) {
        console.error('Failed to fetch active tables:', error);
      }
    };
    fetchTables();
  }, []);

  if (!cart.length) return <EmptyCart />;

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
            defaultValue={username}
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input
              className="input w-full border p-2 rounded"
              type="tel"
              name="phone"
              required
              placeholder="912 000 0000"
            />
            {formErrors?.phone && (
              <p className="mt-2 bg-red-100 text-red-700 p-2 text-xs rounded-md">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Select Table</label>
          <div className="grow">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {activeTables.map((table) => (
                <div
                  key={table.tableId}
                  className={`p-4 border rounded-md cursor-pointer transition duration-200
                              ${selectedTable === table.tableId ? 'bg-orange-200' : 'hover:bg-orange-100'} 
                              ${table.status === 'Active' ? 'border-green-500' : 'border-gray-300'}`}
                  onClick={() => setSelectedTable(table.tableId)}
                >
                  <h3 className="font-medium">{table.name}</h3>
                  <p className="text-sm">Size: {table.size}</p>
                  {table.status === 'Active' && (
                    <span className="text-green-500 font-semibold text-xs">Available</span>
                  )}
                  <span className="block mt-1 text-gray-500 text-xs italic">
                    {selectedTable === table.tableId ? "Selected" : "Click to select this table"}
                  </span>
                </div>
              ))}
            </div>
            {!selectedTable && (
              <p className="mt-2 bg-red-100 text-red-700 p-2 text-xs rounded-md">
                Please select a table.
              </p>
            )}
          </div>
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-orange-400 focus:outline-none focus:ring focus:ring-orange-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            checked={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input type="hidden" name="selectedTable" value={selectedTable} />
          <button
            disabled={isSubmitting || !selectedTable}
            className="rounded bg-orange-600 px-4 py-2 font-medium text-white disabled:opacity-50 hover:bg-orange-500 transition duration-200"
          >
            {isSubmitting
              ? "Placing order...."
              : `Order now from ${formatCurrency(totalPrice)}`}
          </button>
        </div>
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
  };

  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      "Please give us your correct phone number. We might need it to contact you.";

  if (!order.selectedTable)
    errors.selectedTable = "Please select a table.";

  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
