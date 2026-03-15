import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchStoreSummary } from '../../services/api/dashboardApi';
const initialState = {
  summary: null,
  loading: false,
  error: null
};

// Async thunk for fetching dashboard data
export const loadDashboardData = createAsyncThunk('dashboard/loadData', async storeId => {
  const response = await fetchStoreSummary(storeId);
  return response;
});
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboard: state => {
      state.summary = null;
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder.addCase(loadDashboardData.pending, state => {
      state.loading = true;
      state.error = null;
    }).addCase(loadDashboardData.fulfilled, (state, action) => {
      state.loading = false;
      state.summary = action.payload;
    }).addCase(loadDashboardData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to load dashboard data';
    });
  }
});
export const {
  clearDashboard
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
