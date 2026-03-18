import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const MOCK_DATA = {
  summary: {
    total_traffic: 769,
    live_count: 122,
    avg_dwell_time: '10:26',
    zone_performance: 88.2,
    traffic_growth: 12,
    live_growth: -2,
    dwell_growth: -2,
    performance_growth: 5.4
  },
  hourlyVariation: [
    { hour: '08:00', traffic: 85, capacity: 200 },
    { hour: '10:00', traffic: 250, capacity: 200 },
    { hour: '12:00', traffic: 320, capacity: 200 },
    { hour: '14:00', traffic: 280, capacity: 200 },
    { hour: '16:00', traffic: 410, capacity: 200 },
    { hour: '18:00', traffic: 390, capacity: 200 },
    { hour: '20:00', traffic: 220, capacity: 200 },
    { hour: '22:00', traffic: 95, capacity: 200 },
  ],
  movementPaths: [
    { from: 'Lối vào chính', to: 'Quầy thanh toán', confidence: 45.8 },
    { from: 'Lối vào chính', to: 'Khu vực giảm giá', confidence: 32.5 },
    { from: 'Khu vực giảm giá', to: 'Quầy thanh toán', confidence: 38.2 },
    { from: 'Mỹ phẩm cao cấp', to: 'Quầy thanh toán', confidence: 52.1 },
    { from: 'Đồ chơi trẻ em', to: 'Quầy thanh toán', confidence: 41.5 },
    { from: 'Nội thất lớn', to: 'Quầy thanh toán', confidence: 29.8 },
  ],
  zoneStatus: [
    {
      zone: 'Lối vào chính',
      sensorId: 'SEN-001',
      todayCount: 250,
      yesterdayCount: 240,
      liveCount: 32,
      avgDwell: '5:20',
      recommendation: 'normal',
      recommendationText: 'Vận hành bình thường'
    },
    {
      zone: 'Quầy thanh toán',
      sensorId: 'SEN-002',
      todayCount: 185,
      yesterdayCount: 195,
      liveCount: 28,
      avgDwell: '8:45',
      recommendation: 'open_counter',
      recommendationText: 'Mở thêm quầy thanh toán'
    },
    {
      zone: 'Khu vực giảm giá',
      sensorId: 'SEN-003',
      todayCount: 212,
      yesterdayCount: 240,
      liveCount: 18,
      avgDwell: '12:30',
      recommendation: 'promotion',
      recommendationText: 'Đẩy mạnh khuyến mãi'
    },
    {
      zone: 'Mỹ phẩm cao cấp',
      sensorId: 'SEN-004',
      todayCount: 89,
      yesterdayCount: 92,
      liveCount: 8,
      avgDwell: '14:20',
      recommendation: 'normal',
      recommendationText: 'Vận hành bình thường'
    },
    {
      zone: 'Đồ chơi trẻ em',
      sensorId: 'SEN-005',
      todayCount: 112,
      yesterdayCount: 145,
      liveCount: 22,
      avgDwell: '11:15',
      recommendation: 'promotion',
      recommendationText: 'Đẩy mạnh khuyến mãi'
    },
    {
      zone: 'Nội thất lớn',
      sensorId: 'SEN-006',
      todayCount: 78,
      yesterdayCount: 88,
      liveCount: 14,
      avgDwell: '18:50',
      recommendation: 'normal',
      recommendationText: 'Vận hành bình thường'
    },
  ]
};

const initialState = {
  summary: null,
  hourlyVariation: [],
  movementPaths: [],
  zoneStatus: [],
  loading: false,
  error: null,
  filters: {
    regionId: null,
    storeId: null,
    cameraId: null,
    date: new Date().toISOString().split('T')[0],
    period: 'today'
  }
};

// Async thunk for fetching zone analytics data
export const loadZoneData = createAsyncThunk('zoneAnalytics/loadData', async () => {
  // Simulate API call with setTimeout
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DATA);
    }, 500);
  });
});

const zoneAnalyticsSlice = createSlice({
  name: 'zoneAnalytics',
  initialState,
  reducers: {
    clearZoneData: (state) => {
      state.summary = null;
      state.hourlyVariation = [];
      state.movementPaths = [];
      state.zoneStatus = [];
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPeriod: (state, action) => {
      state.filters.period = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadZoneData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadZoneData.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.summary;
        state.hourlyVariation = action.payload.hourlyVariation;
        state.movementPaths = action.payload.movementPaths;
        state.zoneStatus = action.payload.zoneStatus;
      })
      .addCase(loadZoneData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load zone data';
      });
  }
});

export const { clearZoneData, setFilters, setPeriod } = zoneAnalyticsSlice.actions;
export default zoneAnalyticsSlice.reducer;
