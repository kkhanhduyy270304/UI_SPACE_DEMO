import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const GYM_CUSTOMERS = [
  {
    id: 'GYM-001',
    name: 'Nguyen Minh Anh',
    avatar: 'https://i.pravatar.cc/80?img=32',
    membershipPackage: 'Premium 12 thang',
    status: 'Đang hoạt động',
    frequency: 5,
    expiryDate: '2026-08-15',
    riskWarning: false
  },
  {
    id: 'GYM-002',
    name: 'Tran Quoc Bao',
    avatar: 'https://i.pravatar.cc/80?img=12',
    membershipPackage: 'Basic 6 thang',
    status: 'Hết hạn',
    frequency: 1,
    expiryDate: '2025-12-28',
    riskWarning: true
  },
  {
    id: 'GYM-003',
    name: 'Le Thu Ha',
    avatar: 'https://i.pravatar.cc/80?img=47',
    membershipPackage: 'Standard 3 thang',
    status: 'Bảo lưu',
    frequency: 0,
    expiryDate: '2026-03-30',
    riskWarning: true
  },
  {
    id: 'GYM-004',
    name: 'Pham Gia Huy',
    avatar: 'https://i.pravatar.cc/80?img=15',
    membershipPackage: 'Premium 12 thang',
    status: 'Đang hoạt động',
    frequency: 4,
    expiryDate: '2026-10-10',
    riskWarning: false
  }
];

const RETAIL_CUSTOMERS = [
  {
    id: 'RTL-001',
    name: 'Do Khanh Linh',
    phone: '0901234567',
    totalInvoices: 26,
    totalSpend: 18450000,
    topProduct: 'Sua hat organic',
    rank: 'Diamond'
  },
  {
    id: 'RTL-002',
    name: 'Hoang Tuan Kiet',
    phone: '0917890123',
    totalInvoices: 17,
    totalSpend: 9750000,
    topProduct: 'Mi goi cao cap',
    rank: 'Gold'
  },
  {
    id: 'RTL-003',
    name: 'Bui Ngoc Trinh',
    phone: '0934567890',
    totalInvoices: 11,
    totalSpend: 5360000,
    topProduct: 'Do uong giai nhiet',
    rank: 'Silver'
  },
  {
    id: 'RTL-004',
    name: 'Vu Dang Khoa',
    phone: '0987654321',
    totalInvoices: 22,
    totalSpend: 12900000,
    topProduct: 'Snack healthy',
    rank: 'Gold'
  }
];

const CUSTOMER_ANALYTICS_DATA = {
  kpi: {
    totalMembers: 2847,
    totalMembersGrowth: 12.5,
    returnRate: 68.4,
    returnRateGrowth: 5.2,
    avgDwellMinutes: 24.3,
    avgDwellGrowthMinutes: 3.1
  },
  segments: [
    { key: 'loyal', label: 'Khach than thiet', percent: 35, members: 996, color: '#22C55E' },
    { key: 'walkin', label: 'Khach vang lai', percent: 40, members: 1139, color: '#2563EB' },
    { key: 'potential', label: 'Khach tiem nang', percent: 20, members: 569, color: '#F59E0B' },
    { key: 'staff', label: 'Nhan vien', percent: 5, members: 143, color: '#A855F7' }
  ],
  aiInsights: [
    {
      id: 'insight-1',
      type: 'trend',
      title: 'Xu huong tich cuc',
      message: 'Nhom Khach than thiet tang 7.8% trong 14 ngay gan day o khung gio 17:00-20:00.'
    },
    {
      id: 'insight-2',
      type: 'attention',
      title: 'Can chu y',
      message: 'Nhom Nguy co roi di tang 11.2% tai khu vuc Cardio, can cham soc som qua tin nhan ca nhan hoa.'
    },
    {
      id: 'insight-3',
      type: 'strategy',
      title: 'Goi y chien luoc',
      message: 'Tang nhan su tu van o 18:00-19:30 tai khu Tap the luc de toi uu ty le quay lai cua khach moi.'
    }
  ],
  memberList: [
    { id: 'MB-001', fullName: 'Nguyen Van An', group: 'Thân thiết', lastSeen: '2 giờ trước', visits30d: 24, dwellMinutes: 48 },
    { id: 'MB-002', fullName: 'Tran Minh Chau', group: 'Vãng lai', lastSeen: '5 giờ trước', visits30d: 8, dwellMinutes: 21 },
    { id: 'MB-003', fullName: 'Le Thu Trang', group: 'Tiềm năng', lastSeen: '1 ngày trước', visits30d: 14, dwellMinutes: 33 },
    { id: 'MB-004', fullName: 'Pham Quoc Huy', group: 'Nguy cơ rời đi', lastSeen: '4 ngày trước', visits30d: 3, dwellMinutes: 12 },
    { id: 'MB-005', fullName: 'Bui Ngoc Anh', group: 'Thân thiết', lastSeen: '3 giờ trước', visits30d: 27, dwellMinutes: 52 },
    { id: 'MB-006', fullName: 'Hoang Gia Bao', group: 'Vãng lai', lastSeen: '8 giờ trước', visits30d: 6, dwellMinutes: 18 },
    { id: 'MB-007', fullName: 'Do Khanh Linh', group: 'Tiềm năng', lastSeen: '12 giờ trước', visits30d: 11, dwellMinutes: 26 },
    { id: 'MB-008', fullName: 'Vo Tuan Kiet', group: 'Nguy cơ rời đi', lastSeen: '6 ngày trước', visits30d: 2, dwellMinutes: 10 }
  ],
  areaPriorities: [
    { zone: 'Tap the luc', visitors: 780, avgDwellMinutes: 31 },
    { zone: 'Cardio', visitors: 655, avgDwellMinutes: 26 },
    { zone: 'Yoga', visitors: 410, avgDwellMinutes: 38 },
    { zone: 'Giai khat', visitors: 285, avgDwellMinutes: 14 }
  ],
  typicalFlow: [
    { step: 'Le tan', transitionRate: null },
    { step: 'Thay do', transitionRate: 95 },
    { step: 'Tap the luc', transitionRate: 65 },
    { step: 'Cardio', transitionRate: 45 }
  ]
};

const initialState = {
  type: 'gym',
  data: [],
  analytics: {
    kpi: null,
    segments: [],
    aiInsights: [],
    memberList: [],
    areaPriorities: [],
    typicalFlow: []
  },
  loading: false,
  error: null,
  filters: {
    search: '',
    category: 'all'
  }
};

export const loadCustomerData = createAsyncThunk('customer/loadCustomerData', async (type = 'gym') => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (type === 'analysis') {
        resolve({ viewType: 'analysis', payload: CUSTOMER_ANALYTICS_DATA });
        return;
      }

      resolve({
        viewType: type,
        payload: type === 'gym' ? GYM_CUSTOMERS : RETAIL_CUSTOMERS
      });
    }, 300);
  });
});

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setType: (state, action) => {
      state.type = action.payload;
      state.filters.category = 'all';
      state.filters.search = '';
    },
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    clearCustomerData: state => {
      state.data = [];
      state.error = null;
      state.filters = {
        search: '',
        category: 'all'
      };
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loadCustomerData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCustomerData.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.viewType === 'analysis') {
          state.analytics = action.payload.payload;
          return;
        }

        state.data = action.payload.payload;
      })
      .addCase(loadCustomerData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load customer data';
      });
  }
});

export const { setType, setFilters, clearCustomerData } = customerSlice.actions;
export default customerSlice.reducer;