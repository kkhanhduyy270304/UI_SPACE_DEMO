import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Cell,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Users, TrendingUp, MoreHorizontal } from 'lucide-react';

const MEMBER_SEGMENTS = [
  { name: 'Khách hàng thân thiết', value: 996, percent: 35, color: '#10b981' },
  { name: 'Khách hàng vàng lại', value: 1139, percent: 40, color: '#3b82f6' },
  { name: 'Khách hàng tiềm năng', value: 569, percent: 20, color: '#f59e0b' },
  { name: 'Nhân viên', value: 143, percent: 5, color: '#a855f7' }
];

const SEGMENT_COLORS = {
  'Thân thiết': 'bg-emerald-500/20 text-emerald-500',
  'Vàng lại': 'bg-blue-500/20 text-blue-500',
  'Tiềm năng': 'bg-amber-500/20 text-amber-500',
  'Nguy cơ rời đi': 'bg-red-500/20 text-red-500'
};

const MOCK_MEMBERS = [
  { id: 1, name: 'Nguyen Van An', phone: '0987123456', segment: 'Thân thiết', lastVisit: '2 giờ trước', visits30d: 24, dwellTime: '48 phút' },
  { id: 2, name: 'Tran Minh Chau', phone: '0987654321', segment: 'Vàng lại', lastVisit: '5 giờ trước', visits30d: 8, dwellTime: '21 phút' },
  { id: 3, name: 'Le Thu Trang', phone: '0912345678', segment: 'Tiềm năng', lastVisit: '1 ngày trước', visits30d: 14, dwellTime: '33 phút' },
  { id: 4, name: 'Pham Quoc Huy', phone: '0945678901', segment: 'Nguy cơ rời đi', lastVisit: '4 ngày trước', visits30d: 3, dwellTime: '12 phút' },
  { id: 5, name: 'Bui Ngoc Anh', phone: '0923456789', segment: 'Thân thiết', lastVisit: '3 giờ trước', visits30d: 27, dwellTime: '52 phút' },
  { id: 6, name: 'Hoang Gia Bao', phone: '0934567890', segment: 'Vàng lại', lastVisit: '8 giờ trước', visits30d: 6, dwellTime: '18 phút' },
  { id: 7, name: 'Do Khanh Linh', phone: '0956789012', segment: 'Tiềm năng', lastVisit: '12 giờ trước', visits30d: 11, dwellTime: '26 phút' },
  { id: 8, name: 'Vo Tuan Kiet', phone: '0967890123', segment: 'Nguy cơ rời đi', lastVisit: '6 ngày trước', visits30d: 2, dwellTime: '10 phút' }
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

const buildDataset = ({ locationId, cameraId, date }) => {
  const seed = hashString(`${locationId}|${cameraId}|${date}`);
  const rng = createRng(seed);

  // Generate deterministic KPIs
  const baseTotalMembers = 2700 + Math.floor(rng() * 300);
  const baseReturnRate = 62 + Math.floor(rng() * 12);
  const trendTotalMembers = 8 + Math.floor((rng() - 0.5) * 20);
  const trendReturnRate = 3 + Math.floor((rng() - 0.5) * 10);

  return {
    totalMembers: baseTotalMembers,
    returnRate: baseReturnRate,
    trendTotalMembers,
    trendReturnRate
  };
};

const cardClassName = 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm';

/**
 * CustomerAnalysis - Dark-themed member analytics page with KPIs, segment chart, and member table.
 */
export const CustomerAnalysis = () => {
  const { locationId, cameraId, date } = useSelector(state => state.filter);
  const [data, setData] = useState(() => buildDataset({ locationId, cameraId, date }));

  useEffect(() => {
    setData(buildDataset({ locationId, cameraId, date }));
  }, [locationId, cameraId, date]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      return (
        <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-900 shadow-lg">
          <p className="font-semibold">{entry.name}</p>
          <p className="text-slate-600">{entry.value} members ({entry.percent}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Total Members Card */}
          <div className={cardClassName}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600">Tổng thành viên</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{data.totalMembers.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-emerald-100 px-2 py-1">
                <p className="text-xs font-semibold text-emerald-600">+{data.trendTotalMembers.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Return Rate Card */}
          <div className={cardClassName}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-emerald-100 p-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600">Tỷ lệ quay lại</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{data.returnRate.toFixed(1)}%</p>
              </div>
              <div className="rounded-lg bg-emerald-100 px-2 py-1">
                <p className="text-xs font-semibold text-emerald-600">+{data.trendReturnRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pie Chart Row */}
        <div className={cardClassName}>
          <h2 className="mb-6 text-lg font-semibold text-slate-900">Phân bổ nhóm đối tượng</h2>
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
            <div className="w-full lg:w-1/2">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={MEMBER_SEGMENTS}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {MEMBER_SEGMENTS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="w-full space-y-4 lg:w-1/2">
              {MEMBER_SEGMENTS.map((segment, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: segment.color }} />
                  <div className="flex flex-1 items-center justify-between">
                    <p className="text-sm text-slate-700">{segment.name}</p>
                    <p className="text-xs font-semibold text-slate-600">
                      {segment.percent}% ({segment.value.toLocaleString()})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Member List Table */}
        <div className={cardClassName}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Danh sách thành viên</h2>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên..."
              className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-slate-400 focus:outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 font-semibold text-slate-700">Hộ và tên</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Nhóm</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Lần cuối</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Lượt/30d</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Dwell Time</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_MEMBERS.map(member => (
                  <tr key={member.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-900">{member.name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${SEGMENT_COLORS[member.segment]}`}>
                        {member.segment}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{member.lastVisit}</td>
                    <td className="px-4 py-3 text-slate-900">{member.visits30d}</td>
                    <td className="px-4 py-3 text-slate-900">{member.dwellTime}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="rounded-lg p-1 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
