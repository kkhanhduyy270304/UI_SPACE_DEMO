import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import dashboardReducer from '../slices/dashboardSlice';
import heatmapReducer from '../slices/heatmapSlice';
import zoneReducer from '../slices/zoneSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    heatmap: heatmapReducer,
    zone: zoneReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false
  })
});
