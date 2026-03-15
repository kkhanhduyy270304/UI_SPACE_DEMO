import apiClient from './client';
import { generateMockHeatmap } from '../../utils/mockData';
export const fetchHeatmapData = async cameraId => {
  try {
    const response = await apiClient.get(`/heatmap/${cameraId}`);
    return response.data;
  } catch (error) {
    // Keep Heatmap usable in local UI development when backend is offline.
    const fallback = generateMockHeatmap();
    return {
      ...fallback,
      camera_id: cameraId
    };
  }
};
export const fetchHeatmapByDateRange = async (cameraId, startDate, endDate) => {
  try {
    const response = await apiClient.get(`/heatmap/${cameraId}`, {
      params: {
        startDate,
        endDate
      }
    });
    return response.data;
  } catch (error) {
    const fallback = generateMockHeatmap();
    return {
      ...fallback,
      camera_id: cameraId,
      date: startDate || endDate
    };
  }
};
