import apiClient from './client';
export const fetchStoreSummary = async storeId => {
  const response = await apiClient.get(`/stores/${storeId}/summary`);
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
