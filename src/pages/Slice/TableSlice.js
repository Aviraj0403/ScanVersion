import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDiningTables } from '../../services/apiRestaurant';  // Import your custom API function

// Create AsyncThunk to fetch tables for a specific restaurant using dynamic restaurantId
export const fetchTables = createAsyncThunk(
  'table/fetchTables',
  async (restaurantId, { rejectWithValue }) => {
    if (!restaurantId) {
      throw new Error('Restaurant ID is required');
    }

    try {
      // Fetch the dining tables for the given restaurantId using the custom API function
      const data = await getDiningTables(restaurantId, 'Active');  // Example: Fetch active tables
      return data;  // Return the fetched data to Redux
    } catch (error) {
      // If an error occurs, reject the promise with the error message
      return rejectWithValue(error.message);
    }
  }
);

const tableSlice = createSlice({
  name: 'table',
  initialState: {
    tables: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.tables = action.payload;  // Store fetched tables in the state
        state.loading = false;
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.error = action.payload || action.error.message;  // Store the error message
        state.loading = false;
      });
  },
});

export default tableSlice.reducer;
