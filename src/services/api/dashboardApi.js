import apiClient from './client';

export const fetchStoreSummary = async ({ regionId, storeId, cameraId, date }) => {
  const params = {};
  if (regionId) params.regionId = regionId;
  if (storeId) params.storeId = storeId;
  if (cameraId) params.cameraId = cameraId;
  if (date) params.date = date;

  const response = await apiClient.get('/dashboard/summary', { params });
  return response.data;
};

export const fetchStoreSummaryByDateRange = async (storeId, startDate, endDate) => {
  const response = await apiClient.get(`/stores/${storeId}/summary`, {
    params: {
      startDate,
      endDate
    }
  });
  return response.data;
};
