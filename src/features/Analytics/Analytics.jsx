import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loadZoneStats } from '../../redux/slices/zoneSlice';
import { Card } from '../../components/common';
import { formatPercentage } from '../../utils/formatters';
import { formatDwellTime } from '../../utils/timeFormatters';

/**
 * Analytics page - displays zone comparison and dwell time analysis
 */
export const Analytics = () => {
  const dispatch = useAppDispatch();
  const {
    zones,
    loading,
    error
  } = useAppSelector(state => state.zone);
  useEffect(() => {
    // Load zone statistics for default store
    dispatch(loadZoneStats('store-001'));
  }, [dispatch]);
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-700 text-xl">Đang tải dữ liệu phân tích...</p>
      </div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen">
        <p className="text-rose-400 text-xl">Lỗi: {error}</p>
      </div>;
  }
    return <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {zones.map(zone => <Card key={zone.zone_id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-slate-900">{zone.zone_name || zone.zone_id}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${zone.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : zone.trend === 'down' ? 'bg-rose-500/20 text-rose-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {zone.trend}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Số người:</span>
                <span className="text-slate-900 font-medium font-mono">{zone.people_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tỷ lệ chuyển đổi:</span>
                <span className="text-slate-900 font-medium font-mono">
                  {formatPercentage(zone.performance.conversion_rate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Thời gian dừng TB:</span>
                <span className="text-slate-900 font-medium font-mono">
                  {formatDwellTime(zone.performance.avg_dwell_time)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Lượt dừng lại:</span>
                <span className="text-slate-900 font-medium font-mono">{zone.performance.total_stop_events}</span>
              </div>
            </div>
          </Card>)}
      </div>
    </div>;
};
