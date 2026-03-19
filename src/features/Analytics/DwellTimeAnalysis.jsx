import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Activity, Clock, Timer, TrendingDown, TrendingUp, UserCheck } from 'lucide-react';

const BASE_ZONES = [
  'Entrance Display',
  'Perfume Zone',
  'Checkout Area',
  'Promotional Shelf',
  'Premium Cosmetics',
  'Kids Corner'
];

const DWELL_BUCKETS = [
  { bucket: '0-5 min', midpoint: 2.5 },
  { bucket: '5-15 min', midpoint: 10 },
  { bucket: '15-30 min', midpoint: 22.5 },
  { bucket: '30+ min', midpoint: 40 }
];

const hashString = (value) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash +=
      (hash << 1) +
      (hash << 4) +
      (hash << 7) +
      (hash << 8) +
      (hash << 24);
  }
  return hash >>> 0;
};

const createRng = (seed) => {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const createDwellDataset = ({ locationId, cameraId, date }) => {
  const seed = hashString(`${locationId}|${cameraId}|${date}`);
  const rng = createRng(seed);

  const totalSessions = 900 + Math.floor(rng() * 700);
  const distribution = [
    0.27 + rng() * 0.08,
    0.32 + rng() * 0.07,
    0.23 + rng() * 0.06,
    0.13 + rng() * 0.06
  ];
  const sumDistribution = distribution.reduce((acc, value) => acc + value, 0);
  const normalized = distribution.map(value => value / sumDistribution);

  const distributionData = DWELL_BUCKETS.map((bucket, index) => ({
    bucket: bucket.bucket,
    visitors: index === DWELL_BUCKETS.length - 1
      ? totalSessions
      : Math.floor(totalSessions * normalized[index])
  }));
  const distributionSumExceptLast = distributionData
    .slice(0, DWELL_BUCKETS.length - 1)
    .reduce((acc, item) => acc + item.visitors, 0);
  distributionData[DWELL_BUCKETS.length - 1].visitors = totalSessions - distributionSumExceptLast;

  const avgStoreDwell = distributionData.reduce((acc, item, index) => {
    return acc + item.visitors * DWELL_BUCKETS[index].midpoint;
  }, 0) / totalSessions;

  const hourlyData = [];
  for (let hour = 8; hour <= 22; hour += 2) {
    const daytimeBoost = hour >= 16 && hour <= 20 ? 1.25 : hour >= 10 && hour < 16 ? 1.1 : 0.9;
    const avgDwell = (7 + rng() * 6) * daytimeBoost;
    hourlyData.push({
      hour: `${String(hour).padStart(2, '0')}:00`,
      avgMinutes: Number(avgDwell.toFixed(1))
    });
  }

  const zoneRanking = BASE_ZONES.map((zoneName, index) => {
    const avgMinutes = Number((8 + rng() * 28).toFixed(1));
    const trendRoll = rng();
    const trend = trendRoll > 0.66 ? 'up' : trendRoll < 0.33 ? 'down' : 'flat';
    const trendDelta = Number((rng() * 12).toFixed(1));
    const status = avgMinutes >= 25 ? 'High' : avgMinutes >= 14 ? 'Normal' : 'Low';

    return {
      rank: index + 1,
      zoneName,
      avgMinutes,
      trend,
      trendDelta,
      status
    };
  }).sort((a, b) => b.avgMinutes - a.avgMinutes).map((item, index) => ({
    ...item,
    rank: index + 1
  }));

  const peakZoneDwell = zoneRanking[0]?.avgMinutes || 0;
  const highEngagementSessions = distributionData[2].visitors + distributionData[3].visitors;
  const highEngagementRatio = (highEngagementSessions / totalSessions) * 100;

  return {
    kpis: {
      avgStoreDwell,
      peakZoneDwell,
      highEngagementRatio,
      totalSessions
    },
    distributionData,
    hourlyData,
    zoneRanking
  };
};

const trendView = (trend) => {
  if (trend === 'up') {
    return {
      icon: <TrendingUp size={15} className="text-emerald-400" />,
      label: 'Tăng',
      textClass: 'text-emerald-400'
    };
  }
  if (trend === 'down') {
    return {
      icon: <TrendingDown size={15} className="text-rose-400" />,
      label: 'Giảm',
      textClass: 'text-rose-400'
    };
  }
  return {
    icon: <Activity size={15} className="text-slate-400" />,
    label: 'Ổn định',
    textClass: 'text-slate-400'
  };
};

const statusClass = {
  High: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  Normal: 'bg-amber-100 text-amber-700 border border-amber-200',
  Low: 'bg-slate-100 text-slate-700 border border-slate-200'
};

const statusLabel = {
  High: 'Cao',
  Normal: 'Trung bình',
  Low: 'Thấp'
};

/**
 * DwellTimeAnalysis - Analyze customer engagement duration across zones.
 */
export const DwellTimeAnalysis = () => {
  const { locationId, cameraId, date } = useSelector(state => state.filter);
  const [analyticsData, setAnalyticsData] = useState(() => createDwellDataset({ locationId, cameraId, date }));

  useEffect(() => {
    setAnalyticsData(createDwellDataset({ locationId, cameraId, date }));
  }, [locationId, cameraId, date]);

  const kpiCards = useMemo(() => ([
    {
      title: 'Thời gian dừng trung bình toàn cửa hàng',
      value: `${analyticsData.kpis.avgStoreDwell.toFixed(1)} phút`,
      icon: <Clock className="h-5 w-5 text-teal-600" />
    },
    {
      title: 'Thời gian dừng cao nhất theo khu vực',
      value: `${analyticsData.kpis.peakZoneDwell.toFixed(1)} phút`,
      icon: <Timer className="h-5 w-5 text-indigo-600" />
    },
    {
      title: 'Tỷ lệ tương tác cao',
      value: `${analyticsData.kpis.highEngagementRatio.toFixed(1)}%`,
      icon: <UserCheck className="h-5 w-5 text-teal-600" />
    },
    {
      title: 'Tổng phiên theo dõi',
      value: analyticsData.kpis.totalSessions.toLocaleString('en-US'),
      icon: <Activity className="h-5 w-5 text-indigo-600" />
    }
  ]), [analyticsData]);

  return (
    <div className="min-h-screen rounded-2xl bg-white p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Phân tích thời gian dừng</h1>
          <p className="mt-2 text-sm text-slate-600">Phân tích mức độ tương tác của khách hàng theo từng khu vực.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map(card => (
            <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="rounded-xl bg-slate-100 p-3">{card.icon}</span>
              </div>
              <p className="mt-4 text-sm text-slate-500">{card.title}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Phân bố thời gian dừng</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.distributionData} margin={{ top: 16, right: 14, left: -20, bottom: 6 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="bucket" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      color: '#0f172a'
                    }}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Bar dataKey="visitors" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Thời gian dừng trung bình theo giờ</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.hourlyData} margin={{ top: 16, right: 14, left: -20, bottom: 6 }}>
                  <defs>
                    <linearGradient id="dwellGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={value => [`${value} phút`, 'TB dừng']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      color: '#0f172a'
                    }}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Area type="monotone" dataKey="avgMinutes" stroke="#818cf8" strokeWidth={2} fill="url(#dwellGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Xếp hạng mức độ tương tác theo khu vực</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="px-3 py-3 font-medium">Hạng</th>
                    <th className="px-3 py-3 font-medium">Tên khu vực</th>
                    <th className="px-3 py-3 font-medium text-right">Thời gian dừng TB</th>
                    <th className="px-3 py-3 font-medium text-right">Xu hướng</th>
                    <th className="px-3 py-3 font-medium text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.zoneRanking.map(zone => {
                    const trend = trendView(zone.trend);

                    return (
                      <tr key={zone.zoneName} className="border-b border-slate-200 text-slate-700">
                        <td className="px-3 py-3 font-mono text-slate-800">#{zone.rank}</td>
                        <td className="px-3 py-3 font-medium text-slate-800">{zone.zoneName}</td>
                        <td className="px-3 py-3 text-right font-mono text-slate-900">{zone.avgMinutes.toFixed(1)} phút</td>
                        <td className="px-3 py-3">
                          <div className={`flex items-center justify-end gap-2 ${trend.textClass}`}>
                            {trend.icon}
                            <span className="font-medium">{trend.label} {zone.trendDelta}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[zone.status]}`}>
                            {statusLabel[zone.status]}
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
    </div>
  );
};

export default DwellTimeAnalysis;
