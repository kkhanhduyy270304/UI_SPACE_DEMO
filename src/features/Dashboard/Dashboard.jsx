import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loadDashboardData } from '../../redux/slices/dashboardSlice';
import { StandardChartCard } from '../../components/common';
import { formatNumber, formatPercentage } from '../../utils/formatters';
import { Users, DollarSign, TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

/**
 * Dashboard page - displays global KPIs with filters and analytics
 */
export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { locationId, cameraId, date } = useAppSelector(state => state.filter);
  const {
    summary,
    hourlyData,
    revenueData,
    zoneRankingData,
    loading,
    error
  } = useAppSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(loadDashboardData({ locationId, cameraId, date }));
  }, [dispatch, locationId, cameraId, date]);

  useEffect(() => {
    const realtimeInterval = setInterval(() => {
      dispatch(loadDashboardData({ locationId, cameraId, date }));
    }, 30000);

    return () => clearInterval(realtimeInterval);
  }, [dispatch, locationId, cameraId, date]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="mx-auto w-full max-w-[1760px] space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map(item => (
              <div key={item} className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="h-[300px] animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
            <div className="h-[300px] animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-red-500 text-xl">Lỗi: {error}</p>
      </div>
    );
  }

  // ============================================================================
  // STEP 0: Dashboard container setup
  // ============================================================================
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full space-y-6">
        

        {/* ======================================================================
            STEP 1: Layout Row 1 - Analysis & Real-time Status (Split Bar)
            grid grid-cols-5 gap-6 mb-6
            ====================================================================== */}
        {summary && (
          <div className="grid grid-cols-5 gap-6 mb-6">
            {/* 1.1: Standard KPI Cards (Left 3/5 Columns) */}
            <div className="col-span-3 grid grid-cols-3 gap-3">
              {/* KPI 1: Total Revenue */}
              <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">Tổng Doanh Thu</p>
                    <p className="text-gray-900 text-4xl font-bold mt-1 font-mono">
                      {(summary.total_revenue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="p-2.5 bg-amber-500/20 rounded-lg">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
              </div>

              {/* KPI 2: Total Visitors */}
              <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">Tổng Khách Hàng</p>
                    <p className="text-gray-900 text-4xl font-bold mt-1 font-mono">
                      {formatNumber(summary.total_people_count)}
                    </p>
                  </div>
                  <div className="p-2.5 bg-teal-500/20 rounded-lg">
                    <Users className="w-5 h-5 text-teal-400" />
                  </div>
                </div>
              </div>

              {/* KPI 3: Conversion Rate */}
              <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">Tỷ Lệ Chuyển Đổi</p>
                    <p className="text-gray-900 text-4xl font-bold mt-1 font-mono">
                      {formatPercentage(summary.conversion_rate)}
                    </p>
                  </div>
                  <div className="p-2.5 bg-emerald-500/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* 1.2: Real-time Status Card (Right 2/5 Columns) */}
            <div className="col-span-2 rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
              <div className="space-y-6">
                {/* Live Indicator with Pulsing Effect */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative w-2.5 h-2.5">
                    <div className="absolute inset-0 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 bg-emerald-500 rounded-full"></div>
                  </div>
                  <span className="text-emerald-600 text-xs font-semibold uppercase tracking-widest">Live</span>
                </div>

                {/* Visitors Currently Inside */}
                <div className="mb-4">
                  <p className="text-gray-600 text-xs font-medium uppercase tracking-wider mb-1">
                    Khách Hiện Tại Trong Cửa Hàng
                  </p>
                  <p className="text-gray-900 text-5xl font-bold font-mono">
                    {formatNumber(summary.live_occupancy)}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Cập nhật {new Date().toLocaleTimeString('vi-VN')}
                  </p>
                </div>

                {/* Waiting in Queue */}
                <div>
                  <p className="text-gray-600 text-xs font-medium uppercase tracking-wider mb-1">
                    Chờ Tại Quầy
                  </p>
                  <p className="text-gray-900 text-3xl font-bold font-mono">
                    {summary.queue_length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================
            STEP 2: Layout Row 2 - Deep Dive Charts
            grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6
            ====================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 2.1: Hourly Visitor Traffic Chart (Left) */}
          <StandardChartCard title="Lưu Lượng Khách Theo Giờ" data={hourlyData} fileName="hourly-traffic">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTeal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="hour" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#14B8A6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTeal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </StandardChartCard>

          {/* 2.2: Daily Revenue Chart (Right) */}
          <StandardChartCard title="Doanh Thu Theo Ngày (7 Ngày Gần Đây)" data={revenueData} fileName="daily-revenue">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                    labelStyle={{ color: '#374151' }}
                    formatter={(value) => `${(value / 1000000).toFixed(2)}M`}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="#FBBF24" 
                    radius={[8, 8, 0, 0]}
                    opacity={0.9}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </StandardChartCard>
        </div>

        {/* ======================================================================
            STEP 3: Layout Row 3 - Zone Performance Tables
            grid grid-cols-1 lg:grid-cols-2 gap-6
            ====================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 3.1: Top Zones Ranking by Traffic (Left) */}
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
            <h2 className="text-gray-900 text-lg font-semibold mb-4">Các Khu Vực Hàng Đầu Theo Lưu Lượng</h2>
            <div className="space-y-0 max-h-[320px] overflow-y-auto">
              {zoneRankingData && zoneRankingData.length > 0 ? (
                zoneRankingData.map((zone, index) => (
                  <div
                    key={zone.rank || index}
                    className="flex items-center justify-between py-3 px-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 text-sm font-mono w-6">#{zone.rank}</span>
                      <div>
                        <p className="text-gray-900 font-medium">{zone.name}</p>
                        <p className="text-gray-500 text-xs">Lưu lượng: {formatNumber(zone.traffic)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-teal-600 text-lg font-bold font-mono">{zone.traffic}</p>
                      <p className="text-gray-500 text-xs">người</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-sm py-8 text-center">Không có dữ liệu</p>
              )}
            </div>
          </div>

          {/* 3.2: Detailed Zone Performance Metrics (Right) */}
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
            <h2 className="text-gray-900 text-lg font-semibold mb-4">Chi Tiết Hiệu Suất Khu Vực</h2>
            <div className="space-y-0 max-h-[320px] overflow-y-auto">
              {zoneRankingData && zoneRankingData.length > 0 ? (
                zoneRankingData.map((zone, index) => {
                  // Mock performance data for display
                  const avgDwellTime = Math.floor(Math.random() * 20) + 5; // 5-25 minutes
                  const staffHits = Math.floor(Math.random() * 50) + 10;
                  const conversionRatio = Math.floor(Math.random() * 40) + 10; // 10-50%
                  const performance = conversionRatio > 30 ? 'high' : conversionRatio > 20 ? 'medium' : 'low';
                  const perfColor = performance === 'high' ? 'bg-emerald-500' : performance === 'medium' ? 'bg-amber-500' : 'bg-slate-600';

                  return (
                    <div key={zone.rank || index} className="py-3 px-3 border-b border-gray-200 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-900 font-medium text-sm">{zone.name}</p>
                        <div className={`w-2 h-2 rounded-full ${perfColor}`}></div>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Thời gian dừng</span>
                          <span className="text-gray-900 font-mono">{avgDwellTime} phút</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Tỷ lệ chuyển đổi</span>
                          <span className="text-amber-600 font-mono">{conversionRatio}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${perfColor}`}
                            style={{ width: `${conversionRatio}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-400 text-sm py-8 text-center">Không có dữ liệu</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
