const MOCK_DATA = {
  summary: {
    total_revenue: 25000000,
    total_people_count: 1284,
    live_occupancy: 42,
    conversion_rate: 12.5
  },
  hourlyData: [
    { hour: '08:00', count: 120 },
    { hour: '10:00', count: 450 },
    { hour: '12:00', count: 380 },
    { hour: '14:00', count: 610 },
    { hour: '16:00', count: 850 },
    { hour: '18:00', count: 720 },
    { hour: '20:00', count: 500 },
    { hour: '22:00', count: 210 },
  ],
  revenueData: [
    { day: 'T2', revenue: 2500000 },
    { day: 'T3', revenue: 2800000 },
    { day: 'T4', revenue: 2200000 },
    { day: 'T5', revenue: 3100000 },
    { day: 'T6', revenue: 3500000 },
    { day: 'T7', revenue: 4200000 },
    { day: 'CN', revenue: 5600000 },
  ],
  zoneRankingData: [
    { rank: 1, name: 'Lối vào chính', status: 'Rất nóng', statusColor: 'red' },
    { rank: 2, name: 'Quầy thanh toán', status: 'Nóng', statusColor: 'orange' },
    { rank: 3, name: 'Khu vực giảm giá', status: 'Nóng', statusColor: 'orange' },
    { rank: 4, name: 'Mỹ phẩm cao cấp', status: 'Ấm', statusColor: 'yellow' },
    { rank: 5, name: 'Đồ chơi trẻ em', status: 'Trung bình', statusColor: 'blue' },
    { rank: 6, name: 'Đồ dùng văn phòng', status: 'Ổn định', statusColor: 'cyan' },
    { rank: 7, name: 'Nội thất lớn', status: 'Lạnh', statusColor: 'indigo' },
  ]
};
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  summary: null,
  hourlyData: [],
  revenueData: [],
  zoneRankingData: [],
  loading: false,
  error: null,
  filters: {
    regionId: null,
    storeId: null,
    cameraId: null,
    date: new Date().toISOString().split('T')[0] // Default to today
  }
};

// Async thunk for fetching dashboard data
export const loadDashboardData = createAsyncThunk('dashboard/loadData', async () => {
  // Simulate API call with setTimeout
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DATA);
    }, 500);
  });
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboard: state => {
      state.summary = null;
      state.hourlyData = [];
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    }
  },
  extraReducers: builder => {
    builder.addCase(loadDashboardData.pending, state => {
      state.loading = true;
      state.error = null;
    }).addCase(loadDashboardData.fulfilled, (state, action) => {
      state.loading = false;
      state.summary = action.payload.summary;
      state.hourlyData = action.payload.hourlyData;
      state.revenueData = action.payload.revenueData;
      state.zoneRankingData = action.payload.zoneRankingData;
    }).addCase(loadDashboardData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to load dashboard data';
    });
  }
});

export const {
  clearDashboard,
  setFilters
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
