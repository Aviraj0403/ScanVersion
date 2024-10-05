// tableSlice.js
import { createSlice } from "@reduxjs/toolkit";

const tableSlice = createSlice({
  name: "table",
  initialState: {
    tables: [], // Initial state for tables
    error: null, // To capture any errors
  },
  reducers: {
    setTables(state, action) {
      state.tables = action.payload; // Set tables
    },
    setTableError(state, action) {
      state.error = action.payload; // Capture errors related to tables
    },
  },
});

// Export actions and reducer
export const { setTables, setTableError } = tableSlice.actions;

export default tableSlice.reducer;
