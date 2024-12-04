import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch tables using async thunk
export const fetchTables = createAsyncThunk('table/fetchTables', async (restaurantId) => {
  const response = await fetch(`/api/tables?restaurantId=${restaurantId}`);  // Update with actual API endpoint
  if (!response.ok) throw new Error('Failed to fetch tables');
  return response.json();
});

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
        state.tables = action.payload;
        state.loading = false;
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default tableSlice.reducer;
