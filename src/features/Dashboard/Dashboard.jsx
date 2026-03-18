import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loadDashboardData, setFilters } from '../../redux/slices/dashboardSlice';
import { Card } from '../../components/common';
import { formatNumber, formatPercentage } from '../../utils/formatters';
import { Users, UserCheck, TrendingUp, RotateCcw, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

/**
 * Dashboard page - displays global KPIs with filters and analytics
 */
export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const {
    summary,
    hourlyData,
    revenueData,
    zoneRankingData,
    loading,
    error,
    filters
  } = useAppSelector(state => state.dashboard);

  const [regions] = useState([
    { id: 'north', name: 'Miền Bắc' },
    { id: 'central', name: 'Miền Trung' },
    { id: 'south', name: 'Miền Nam' }
  ]);

  const [stores] = useState([
    { id: 'store-001', name: 'Cửa hàng Hà Nội', regionId: 'north' },
    { id: 'store-002', name: 'Cửa hàng Đà Nẵng', regionId: 'central' },
    { id: 'store-003', name: 'Cửa hàng TP.HCM', regionId: 'south' }
  ]);

  const [cameras] = useState([
    { id: 'cam-all', name: 'Tất cả Camera' },
    { id: 'cam-entrance', name: 'Camera Cổng chính' },
    { id: 'cam-shelf-a', name: 'Camera Quầy kệ A' }
  ]);

  useEffect(() => {
    dispatch(loadDashboardData(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    if (key === 'regionId') {
      newFilters.storeId = null;
      newFilters.cameraId = null;
    } else if (key === 'storeId') {
      newFilters.cameraId = null;
    }
    dispatch(setFilters(newFilters));
  };

  const handleReset = () => {
    const defaultFilters = {
      regionId: null,
      storeId: null,
      cameraId: null,
      date: new Date().toISOString().split('T')[0]
    };
    dispatch(setFilters(defaultFilters));
  };

  const filteredStores = stores.filter(store => !filters.regionId || store.regionId === filters.regionId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-xl">Đang tải dữ liệu tổng quan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500 text-xl">Lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Bảng điều khiển phân tích cửa hàng</h1>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Khu vực</label>
              <select
                value={filters.regionId || ''}
                onChange={(e) => handleFilterChange('regionId', e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Chọn khu vực</option>
                {regions.map(region => (
                  <option key={region.id} value={region.id}>{region.name}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cửa hàng</label>
              <select
                value={filters.storeId || ''}
                onChange={(e) => handleFilterChange('storeId', e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!filters.regionId}
              >
                <option value="">Chọn cửa hàng</option>
                {filteredStores.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Camera</label>
              <select
                value={filters.cameraId || ''}
                onChange={(e) => handleFilterChange('cameraId', e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!filters.storeId}
              >
                <option value="">Chọn camera</option>
                {cameras.map(camera => (
                  <option key={camera.id} value={camera.id}>{camera.name}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày</label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 bg-white rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-gray-900">{(summary.total_revenue / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Khách trong ngày</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(summary.total_people_count)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-gray-600 text-sm font-medium">Khách hiện tại</p>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Live</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(summary.live_occupancy)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Tỷ lệ chuyển đổi</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPercentage(summary.conversion_rate)}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Analytics Chart */}
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Lưu lượng khách theo giờ</h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Revenue & Zone Rankings Section (2 columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card className="p-6 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Doanh thu theo ngày</h2>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                  <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Zone Rankings */}
          <Card className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Xếp hạng khu vực theo lưu lượng</h2>
            <div className="space-y-3 max-h-[350px] overflow-y-auto">
              {zoneRankingData && zoneRankingData.map((zone) => {
                const statusColorMap = {
                  red: 'bg-red-100 text-red-800',
                  orange: 'bg-orange-100 text-orange-800',
                  yellow: 'bg-yellow-100 text-yellow-800',
                  blue: 'bg-blue-100 text-blue-800',
                  cyan: 'bg-cyan-100 text-cyan-800',
                  indigo: 'bg-indigo-100 text-indigo-800'
                };
                
                return (
                  <div key={zone.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-500 w-6"># {zone.rank}</span>
                      <span className="text-sm font-medium text-gray-900">{zone.name}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColorMap[zone.statusColor] || 'bg-gray-100 text-gray-800'}`}>
                      {zone.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
