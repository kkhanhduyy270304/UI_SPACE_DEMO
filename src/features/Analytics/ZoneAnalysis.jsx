import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loadZoneData, setPeriod } from '../../redux/slices/zoneAnalyticsSlice';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Activity, Clock, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';

const cardClassName = 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm';

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

  const [selectedZone, setSelectedZone] = useState('Tất cả khu vực');

  useEffect(() => {
    dispatch(loadZoneData());
  }, [dispatch]);

  const growthColorClass = value => (value >= 0 ? 'text-emerald-600' : 'text-red-600');
  const GrowthIcon = ({ value }) => (value >= 0
    ? <TrendingUp size={14} className="text-emerald-600" />
    : <TrendingDown size={14} className="text-red-600" />);

  const recommendationBadge = recommendation => {
    const map = {
      normal: 'bg-emerald-100 text-emerald-700',
      open_counter: 'bg-red-100 text-red-700',
      promotion: 'bg-amber-100 text-amber-700'
    };
    return map[recommendation] || map.normal;
  };

  if (loading && !summary) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-lg text-slate-600">Đang tải dữ liệu khu vực...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-lg text-red-600">Lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className={cardClassName}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-slate-600">Phạm vi đang xem:</span>
            {['Tất cả khu vực', 'Lối vào chính', 'Quầy thanh toán', 'Khu vực giảm giá', 'Mỹ phẩm cao cấp'].map(zone => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${selectedZone === zone ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>

        {summary && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className={cardClassName}>
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-blue-100 p-3">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${growthColorClass(summary.traffic_growth)}`}>
                  <GrowthIcon value={summary.traffic_growth} />
                  <span>{summary.traffic_growth > 0 ? '+' : ''}{summary.traffic_growth}%</span>
                </div>
              </div>
              <p className="mb-1 text-sm text-slate-600">Tổng lưu lượng ngày</p>
              <p className="text-3xl font-bold text-slate-900">{summary.total_traffic}</p>
            </div>

            <div className={cardClassName}>
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-emerald-100 p-3">
                  <Activity className="h-5 w-5 text-emerald-600" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${growthColorClass(summary.live_growth)}`}>
                  <GrowthIcon value={summary.live_growth} />
                  <span>{summary.live_growth > 0 ? '+' : ''}{summary.live_growth}%</span>
                </div>
              </div>
              <p className="mb-1 text-sm text-slate-600">Số khách hiện tại</p>
              <p className="text-3xl font-bold text-slate-900">{summary.live_count}</p>
            </div>

            <div className={cardClassName}>
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-amber-100 p-3">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${growthColorClass(summary.dwell_growth)}`}>
                  <GrowthIcon value={summary.dwell_growth} />
                  <span>{summary.dwell_growth > 0 ? '+' : ''}{summary.dwell_growth}%</span>
                </div>
              </div>
              <p className="mb-1 text-sm text-slate-600">Thời gian dừng TB</p>
              <p className="text-3xl font-bold text-slate-900">{summary.avg_dwell_time}m</p>
            </div>

            <div className={cardClassName}>
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-violet-100 p-3">
                  <CheckCircle className="h-5 w-5 text-violet-600" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${growthColorClass(summary.performance_growth)}`}>
                  <GrowthIcon value={summary.performance_growth} />
                  <span>{summary.performance_growth > 0 ? '+' : ''}{summary.performance_growth.toFixed(1)}%</span>
                </div>
              </div>
              <p className="mb-1 text-sm text-slate-600">Hiệu suất khu vực</p>
              <p className="text-3xl font-bold text-slate-900">{summary.zone_performance}%</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
          <div className={`${cardClassName} lg:col-span-7`}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Lưu lượng biến động theo giờ</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => dispatch(setPeriod('today'))}
                  className={`rounded px-3 py-1 text-sm font-medium transition ${filters.period === 'today' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  Hôm nay
                </button>
                <button
                  onClick={() => dispatch(setPeriod('week'))}
                  className={`rounded px-3 py-1 text-sm font-medium transition ${filters.period === 'week' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  7 ngày qua
                </button>
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyVariation}>
                  <defs>
                    <linearGradient id="zoneTrafficGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: 10
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="traffic"
                    stroke="#3b82f6"
                    fill="url(#zoneTrafficGradient)"
                    strokeWidth={2}
                    name="Lưu lượng"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`${cardClassName} lg:col-span-3`}>
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Tuyến đường di chuyển</h2>
            <div className="max-h-[350px] space-y-3 overflow-y-auto pr-1">
              {movementPaths.map((path, index) => (
                <div key={`${path.from}-${path.to}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:bg-slate-100">
                  <p className="text-xs font-semibold text-slate-700">{path.from}</p>
                  <p className="mt-1 text-xs text-slate-500">→ {path.to}</p>
                  <div className="mt-2 inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                    {path.confidence}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={cardClassName}>
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Trạng thái chi tiết từng khu vực</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Khu vực</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Sensor ID</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">Hôm nay</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">So với hôm qua</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">Live</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">Avg Dwell</th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700">Khuyến nghị</th>
                </tr>
              </thead>
              <tbody>
                {zoneStatus.map((zone, idx) => {
                  const changePercent = ((zone.todayCount - zone.yesterdayCount) / zone.yesterdayCount) * 100;
                  return (
                    <tr key={`${zone.sensorId}-${idx}`} className="border-b border-slate-100 transition hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{zone.zone}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{zone.sensorId}</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">{zone.todayCount}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-semibold ${changePercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                          {zone.liveCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600">{zone.avgDwell}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${recommendationBadge(zone.recommendation)}`}>
                          {zone.recommendationText}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
