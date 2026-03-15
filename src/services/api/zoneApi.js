import apiClient from './client';
export const fetchZoneStats = async storeId => {
  const response = await apiClient.get(`/zones/${storeId}/stats`);
  return response.data;
};
export const fetchZoneStatsByDateRange = async (storeId, startDate, endDate) => {
  const response = await apiClient.get(`/zones/${storeId}/stats`, {
    params: {
      startDate,
      endDate
    }
  });
  return response.data;
};
export const fetchSingleZoneStats = async zoneId => {
  const response = await apiClient.get(`/zones/${zoneId}`);
  return response.data;
};
