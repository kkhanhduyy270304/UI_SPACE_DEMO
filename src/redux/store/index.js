import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import dashboardReducer from '../slices/dashboardSlice';
import heatmapReducer from '../slices/heatmapSlice';
import settingsReducer from '../slices/settingsSlice';
import zoneReducer from '../slices/zoneSlice';
import zoneAnalyticsReducer from '../slices/zoneAnalyticsSlice';
import customerReducer from '../slices/customerSlice';
import filterReducer from '../slices/filterSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    heatmap: heatmapReducer,
    settings: settingsReducer,
    zone: zoneReducer,
    zoneAnalytics: zoneAnalyticsReducer,
    customer: customerReducer,
    filter: filterReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false
  })
});
