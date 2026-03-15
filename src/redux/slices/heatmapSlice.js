import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchHeatmapByDateRange, fetchHeatmapData } from '../../services/api/heatmapApi';
const initialState = {
  data: null,
  loading: false,
  error: null
};

// Async thunk for fetching heatmap data
export const loadHeatmapData = createAsyncThunk('heatmap/loadData', async cameraId => {
  const response = await fetchHeatmapData(cameraId);
  return response;
});
export const loadHeatmapByRange = createAsyncThunk('heatmap/loadByRange', async ({
  cameraId,
  startDate,
  endDate
}) => {
  const response = await fetchHeatmapByDateRange(cameraId, startDate, endDate);
  return response;
});
const heatmapSlice = createSlice({
  name: 'heatmap',
  initialState,
  reducers: {
    clearHeatmap: state => {
      state.data = null;
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder.addCase(loadHeatmapData.pending, state => {
      state.loading = true;
      state.error = null;
    }).addCase(loadHeatmapData.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    }).addCase(loadHeatmapData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to load heatmap data';
    }).addCase(loadHeatmapByRange.pending, state => {
      state.loading = true;
      state.error = null;
    }).addCase(loadHeatmapByRange.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    }).addCase(loadHeatmapByRange.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to load heatmap data by range';
    });
  }
});
export const {
  clearHeatmap
} = heatmapSlice.actions;
export default heatmapSlice.reducer;
