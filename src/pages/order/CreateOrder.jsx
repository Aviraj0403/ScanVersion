import React, { useState, useMemo, useEffect } from "react";
import { Form } from "react-router-dom";
import EmptyCart from "../cart/EmptyCart";
import { useOrderContext } from "../../contexts/OrderContext";
import { getTotalCartPrice } from "../cart/cartSlice";
import { storeOrderTemporarily } from "../../pages/order/orderSlice";
import { formatCurrency } from "../../utils/helpers";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchFoods } from "../../pages/Slice/FoodSlice"; // Import fetch action
import { fetchOffers } from "../../pages/Slice/OfferSlice"; // Import fetch action
import { fetchTables } from "../../pages/Slice/TableSlice"; // Import fetch action

const restaurantId = "66f2f1c8f2696a3714a2d1ad";

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
    const { activeTables, activeOffers } = useOrderContext();

    // Fetch foods, offers, and tables when the component mounts
    useEffect(() => {
        dispatch(fetchFoods());
        dispatch(fetchOffers());
        dispatch(fetchTables());
    }, [dispatch]);
    
    useEffect(() => {
        console.log('Active Offers from Redux:', activeOffers);
        console.log('Active Tables from Redux:', activeTables); // Debugging the active offers
    }, [activeOffers]);
    const totalPrice = useMemo(() => {
        const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
        const offerDiscount = selectedOffer ? (totalCartPrice * (Number(selectedOffer.discountPercentage) || 0) / 100) : 0;
        return parseFloat((totalCartPrice + priorityPrice - offerDiscount).toFixed(2));
    }, [totalCartPrice, withPriority, selectedOffer]);

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
            totalPrice
        };

        const errors = validateOrder(order);
        if (Object.keys(errors).length > 0) {
            setErrorMessage(Object.values(errors).join(", "));
            return;
        }

        // Dispatch the order to store temporarily in Redux
        dispatch(storeOrderTemporarily(order));

        // Navigate to payment page
        navigate('/order/payment');
    };

    return (
        <div className="px-4 py-6 bg-white rounded shadow-md max-w-md mx-auto">
            <h2 className="mb-8 text-2xl font-semibold text-center">Ready to order? Let&apos;s go!</h2>

            <Form onSubmit={handleSubmit}>
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

                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Active Offers</label>
                    <div className="grid grid-cols-1 gap-4">
                        {activeOffers.length > 0 ? (
                            activeOffers.map((offer) => (
                                <div
                                    key={offer._id}
                                    className={`p-4 border rounded-md cursor-pointer transition duration-200 ${selectedOffer?._id === offer._id ? 'bg-green-200' : 'hover:bg-green-100'}`}
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
                            <p className="mt-2 text-red-600 text-xs">No offers available.</p>
                        )}
                    </div>
                </div>

                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Priority Service</label>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={withPriority}
                            onChange={(e) => setWithPriority(e.target.checked)}
                        />
                        <span>Check for priority service (+20% fee)</span>
                    </div>
                </div>

                <div className="mb-5">
                    <p className="font-medium">Total Price: {formatCurrency(totalPrice)}</p>
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-500 transition duration-200"
                >
                    Create Order
                </button>
            </Form>
        </div>
    );
};

export default CreateOrder;
