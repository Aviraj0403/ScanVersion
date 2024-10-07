import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        username: "",
        orderHistory: [], // Ensure this is initialized as an empty array
        error: null,
    },
    reducers: {
        updateName(state, action) {
            state.username = action.payload; // Update the username
        },
        addOrderToHistory(state, action) {
            if (!state.orderHistory) {
                state.orderHistory = []; // Safeguard against undefined
            }
            state.orderHistory.push(action.payload); // Add an order to the history
        },
        setUserError(state, action) {
            state.error = action.payload; // Capture errors related to user actions
        },
    },
});

// Export actions and reducer
export const { updateName, addOrderToHistory, setUserError } = userSlice.actions;

export default userSlice.reducer;
