import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loadDashboardData } from '../../redux/slices/dashboardSlice';
import { Card } from '../../components/common';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';
import { formatDwellTime } from '../../utils/timeFormatters';

/**
 * Dashboard page - displays global KPIs
 */
export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const {
    summary,
    loading,
    error
  } = useAppSelector(state => state.dashboard);
  useEffect(() => {
    // Load dashboard data for default store
    dispatch(loadDashboardData('store-001'));
  }, [dispatch]);
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-xl">Đang tải dữ liệu tổng quan...</p>
      </div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen">
        <p className="text-rose-400 text-xl">Lỗi: {error}</p>
      </div>;
  }
  return <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-8">Bảng điều khiển phân tích cửa hàng</h1>

      {summary && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tong luot khach */}
          <Card className="p-6">
            <p className="text-gray-300 text-sm font-medium mb-2">Tổng lượt khách</p>
            <p className="text-3xl font-bold font-mono text-white">
              {formatNumber(summary.total_people_count)}
            </p>
          </Card>

          {/* Tong doanh thu */}
          <Card className="p-6">
            <p className="text-gray-300 text-sm font-medium mb-2">Tổng doanh thu</p>
            <p className="text-3xl font-bold font-mono text-emerald-400">
              {formatCurrency(summary.total_revenue)}
            </p>
          </Card>

          {/* Thoi gian dung trung binh */}
          <Card className="p-6">
            <p className="text-gray-300 text-sm font-medium mb-2">Thời gian dừng trung bình</p>
            <p className="text-3xl font-bold font-mono text-blue-400">
              {formatDwellTime(summary.avg_dwell_time)}
            </p>
          </Card>

          {/* Ty le chuyen doi */}
          <Card className="p-6">
            <p className="text-gray-300 text-sm font-medium mb-2">Tỷ lệ chuyển đổi</p>
            <p className="text-3xl font-bold font-mono text-blue-300">
              {formatPercentage(summary.conversion_rate)}
            </p>
          </Card>
        </div>}
    </div>;
};
