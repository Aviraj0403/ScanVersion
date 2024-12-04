import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch tables using an async thunk that accepts restaurantId
export const fetchTables = createAsyncThunk('table/fetchTables', async (restaurantId) => {
  const response = await fetch(`/api/tables?restaurantId=${restaurantId}`); // Include restaurantId in the API request
  if (!response.ok) throw new Error('Failed to fetch tables');
  return response.json();
});

const tableSlice = createSlice({
  name: "table",
  initialState: {
    tables: [], // Stores fetched tables
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.tables = action.payload; // Store fetched tables
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.error = action.error.message; // Store error if any
      });
  },
});

export default tableSlice.reducer;
