import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTables = createAsyncThunk('table/fetchTables', async () => {
  const response = await fetch('/api/tables'); // Update with your actual endpoint
  if (!response.ok) throw new Error('Failed to fetch tables');
  return response.json();
});

const tableSlice = createSlice({
  name: "table",
  initialState: {
    tables: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.tables = action.payload;
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

// Export actions and reducer
export default tableSlice.reducer;
