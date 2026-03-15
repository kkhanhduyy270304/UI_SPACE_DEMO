import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchZoneStats } from '../../services/api/zoneApi';
const initialState = {
  zones: [],
  loading: false,
  error: null
};

// Async thunk for fetching zone statistics
export const loadZoneStats = createAsyncThunk('zone/loadStats', async storeId => {
  const response = await fetchZoneStats(storeId);
  return response;
});
const zoneSlice = createSlice({
  name: 'zone',
  initialState,
  reducers: {
    clearZones: state => {
      state.zones = [];
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder.addCase(loadZoneStats.pending, state => {
      state.loading = true;
      state.error = null;
    }).addCase(loadZoneStats.fulfilled, (state, action) => {
      state.loading = false;
      state.zones = action.payload;
    }).addCase(loadZoneStats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to load zone statistics';
    });
  }
});
export const {
  clearZones
} = zoneSlice.actions;
export default zoneSlice.reducer;
