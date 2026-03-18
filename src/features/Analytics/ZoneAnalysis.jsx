import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loadZoneData, setFilters, setPeriod } from '../../redux/slices/zoneAnalyticsSlice';
import { Card } from '../../components/common';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Activity, Clock, CheckCircle, RotateCcw, TrendingUp, TrendingDown } from 'lucide-react';

/**
 * ZoneAnalysis - Detailed zone performance analysis with movement paths and AI recommendations
 */
export const ZoneAnalysis = () => {
  const dispatch = useAppDispatch();
  const {
    summary,
    hourlyVariation,
    movementPaths,
    zoneStatus,
    loading,
    error,
    filters
  } = useAppSelector(state => state.zoneAnalytics);

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
    dispatch(loadZoneData());
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
      date: new Date().toISOString().split('T')[0],
      period: 'today'
    };
    dispatch(setFilters(defaultFilters));
  };

  const handlePeriodChange = (period) => {
    dispatch(setPeriod(period));
  };

  const filteredStores = stores.filter(store => !filters.regionId || store.regionId === filters.regionId);

  const getGrowthColor = (growth) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? <TrendingUp size={16} className="text-green-600" /> : <TrendingDown size={16} className="text-red-600" />;
  };

  const getRecommendationBadge = (recommendation) => {
    const badges = {
      normal: { bg: 'bg-green-100', text: 'text-green-800', label: 'Vận hành bình thường' },
      open_counter: { bg: 'bg-red-100', text: 'text-red-800', label: 'Mở thêm quầy thanh toán' },
      promotion: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Đẩy mạnh khuyến mãi' }
    };
    return badges[recommendation] || badges.normal;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F9FA]">
        <p className="text-gray-600 text-xl">Đang tải dữ liệu khu vực...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F9FA]">
        <p className="text-red-500 text-xl">Lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Phân tích khu vực</h1>

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

        {/* Zone KPI Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 bg-white rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className={`flex items-center gap-1 ${getGrowthColor(summary.traffic_growth)}`}>
                  {getGrowthIcon(summary.traffic_growth)}
                  <span className="text-sm font-semibold">{summary.traffic_growth > 0 ? '+' : ''}{summary.traffic_growth}%</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Tổng lưu lượng ngày</p>
              <p className="text-3xl font-bold text-gray-900">{summary.total_traffic}</p>
            </Card>

            <Card className="p-6 bg-white rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <div className={`flex items-center gap-1 ${getGrowthColor(summary.live_growth)}`}>
                  {getGrowthIcon(summary.live_growth)}
                  <span className="text-sm font-semibold">{summary.live_growth > 0 ? '+' : ''}{summary.live_growth}%</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Số khách hiện tại</p>
              <p className="text-3xl font-bold text-gray-900">{summary.live_count}</p>
            </Card>

            <Card className="p-6 bg-white rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className={`flex items-center gap-1 ${getGrowthColor(summary.dwell_growth)}`}>
                  {getGrowthIcon(summary.dwell_growth)}
                  <span className="text-sm font-semibold">{summary.dwell_growth > 0 ? '+' : ''}{summary.dwell_growth}%</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Thời gian dừng TB</p>
              <p className="text-3xl font-bold text-gray-900">{summary.avg_dwell_time}</p>
            </Card>

            <Card className="p-6 bg-white rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div className={`flex items-center gap-1 ${getGrowthColor(summary.performance_growth)}`}>
                  {getGrowthIcon(summary.performance_growth)}
                  <span className="text-sm font-semibold">{summary.performance_growth > 0 ? '+' : ''}{summary.performance_growth.toFixed(1)}%</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Hiệu suất khu vực</p>
              <p className="text-3xl font-bold text-gray-900">{summary.zone_performance}%</p>
            </Card>
          </div>
        )}

        {/* Mid Section - Chart and Movement Paths */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hourly Variation Chart */}
          <Card className="lg:col-span-2 p-6 bg-white rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Lưu lượng biến động theo giờ</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePeriodChange('today')}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    filters.period === 'today' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Hôm nay
                </button>
                <button
                  onClick={() => handlePeriodChange('week')}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    filters.period === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  7 ngày qua
                </button>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyVariation}>
                  <defs>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
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
                    dataKey="traffic"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorTraffic)"
                    name="Lưu lượng"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Movement Paths */}
          <Card className="p-6 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tuyến đường di chuyển</h2>
            <div className="space-y-3 max-h-[350px] overflow-y-auto">
              {movementPaths && movementPaths.map((path, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 transition">
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 font-medium">{path.from}</p>
                    <p className="text-xs text-gray-500">→ {path.to}</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">{path.confidence}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Zone Status Detail Table */}
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Trạng thái chi tiết từng khu vực</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Khu vực</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Sensor ID</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Hôm nay</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">So với hôm qua</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Live</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg Dwell</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Khuyến nghị</th>
                </tr>
              </thead>
              <tbody>
                {zoneStatus && zoneStatus.map((zone, idx) => {
                  const changePercent = ((zone.todayCount - zone.yesterdayCount) / zone.yesterdayCount * 100).toFixed(1);
                  const badgeStyle = getRecommendationBadge(zone.recommendation);
                  
                  return (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{zone.zone}</td>
                      <td className="py-3 px-4 text-gray-600 text-xs">{zone.sensorId}</td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">{zone.todayCount}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`text-sm font-semibold ${changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {changePercent >= 0 ? '+' : ''}{changePercent}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">{zone.liveCount}</span>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">{zone.avgDwell}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeStyle.bg} ${badgeStyle.text}`}>
                          {zone.recommendationText}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
