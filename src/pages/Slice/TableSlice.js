import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch tables using async thunk
export const fetchTables = createAsyncThunk('table/fetchTables', async () => {
  const response = await fetch('/api/tables');  // Update with actual API endpoint
  if (!response.ok) throw new Error('Failed to fetch tables');
  return response.json();
});

const tableSlice = createSlice({
  name: 'table',
  initialState: {
    tables: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.tables = action.payload;  // Store fetched tables
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.error = action.error.message;  // Store error if any
      });
  },
});

export default tableSlice.reducer;
