import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadCustomerData } from '../../../redux/slices/customerSlice';
import { Card } from '../../../components/common';
import { Search } from 'lucide-react';

const formatDate = date => date.toISOString().slice(0, 10);

const generateMemberActivityData = (memberId, visits30d, dwellMinutes) => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 365);

  const data = [];
  const dayMs = 24 * 60 * 60 * 1000;

  // Pseudo-random seed based on memberId to get consistent data
  const seed = memberId.charCodeAt(0) || 0;
  let random = seed / 100;

  for (let d = new Date(start); d <= now; d = new Date(d.getTime() + dayMs)) {
    random = (random * 9301 + 49297) % 233280 / 233280;
    const value = random > 0.65 ? Math.floor(random * 4) + 1 : 0;
    data.push({ date: new Date(d), value });
  }

  return data;
};

const getColorByValue = value => {
  if (value === 0) return 'bg-slate-100';
  if (value === 1) return 'bg-emerald-200';
  if (value === 2) return 'bg-emerald-400';
  if (value === 3) return 'bg-emerald-600';
  return 'bg-emerald-800';
};

const getGroupBadgeColor = group => {
  const colors = {
    'Thân thiết': 'bg-emerald-100 text-emerald-700',
    'Vãng lai': 'bg-blue-100 text-blue-700',
    'Tiềm năng': 'bg-amber-100 text-amber-700',
    'Nguy cơ rời đi': 'bg-rose-100 text-rose-700'
  };
  return colors[group] || 'bg-slate-100 text-slate-600';
};

/**
 * MiniHeatmap - Hiển thị dải ô heatmap 12 tháng cho 1 thành viên
 */
const MiniHeatmap = ({ memberId, activityData }) => {
  const today = new Date();
  const [hoveredDay, setHoveredDay] = useState(null);

  const monthLabels = useMemo(() => {
    const labels = [];
    const d = new Date(today);
    d.setDate(d.getDate() - 365);
    while (d <= today) {
      labels.push(d.toLocaleString('vi-VN', { month: 'short', year: '2-digit' }));
      d.setMonth(d.getMonth() + 1);
    }
    return labels;
  }, []);

  return (
    <div className="relative">
      <div className="flex gap-1 overflow-x-auto pb-2">
        {activityData.map((item, idx) => (
          <div
            key={idx}
            className={`shrink-0 h-5 w-5 rounded border border-slate-200 cursor-pointer transition-all hover:ring-1 hover:ring-offset-1 hover:ring-teal-400 ${getColorByValue(
              item.value
            )}`}
            title={`${formatDate(item.date)}: ${item.value} buổi`}
            onMouseEnter={() => setHoveredDay(item)}
            onMouseLeave={() => setHoveredDay(null)}
          >
            {hoveredDay?.date.toISOString() === item.date.toISOString() && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded whitespace-nowrap z-10">
                {formatDate(item.date)}: {item.value} buổi
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * WorkoutRow - Hàng đại diện cho 1 khách hàng
 */
const WorkoutRow = ({ member, activityData, isHighlighted }) => {
  return (
    <div
      className={`flex items-center gap-4 border-b border-slate-100 py-3 px-4 transition-colors ${
        isHighlighted ? 'bg-teal-50' : 'hover:bg-slate-50'
      }`}
    >
      {/* Cột trái: Thông tin khách hàng (Fixed) */}
      <div className="w-64 flex items-center gap-3 shrink-0">
        <img
          src={member.avatar || `https://i.pravatar.cc/40?img=${member.id.charCodeAt(0)}`}
          alt={member.fullName}
          className="w-10 h-10 rounded-full border border-slate-200 object-cover"
        />
        <div className="min-w-0">
          <p className="font-semibold text-slate-900 truncate">{member.fullName}</p>
          <div className="flex items-center gap-2">
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getGroupBadgeColor(member.group)}`}>
              {member.group}
            </span>
            <span className="text-xs text-slate-500">{member.id}</span>
          </div>
        </div>
      </div>

      {/* Cột phải: Heatmap mini (Scrollable) */}
      <div className="flex-1 overflow-x-auto">
        <MiniHeatmap memberId={member.id} activityData={activityData} />
      </div>

      {/* Cột thống kê */}
      <div className="w-32 shrink-0 text-right text-sm">
        <p className="font-semibold text-slate-900">{member.visits30d}</p>
        <p className="text-xs text-slate-500">buổi/30 ngày</p>
      </div>
    </div>
  );
};

/**
 * CustomerWorkoutCalendar - Component chính - Activity Tracker
 */
export const CustomerWorkoutCalendar = () => {
  const dispatch = useDispatch();
  const { analytics, loading } = useSelector(state => state.customer);
  const [searchQuery, setSearchQuery] = useState('');

  useMemo(() => {
    dispatch(loadCustomerData('analysis'));
  }, [dispatch]);

  const memberList = analytics.memberList || [];

  // Lọc danh sách khách hàng theo tìm kiếm
  const filteredMembers = useMemo(() => {
    return memberList.filter(
      member =>
        member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [memberList, searchQuery]);

  // Tính toán dữ liệu heatmap cho mỗi member
  const memberActivityMap = useMemo(() => {
    const map = {};
    memberList.forEach(member => {
      map[member.id] = generateMemberActivityData(member.id, member.visits30d, member.dwellMinutes);
    });
    return map;
  }, [memberList]);

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card className="p-4">
        <h1 className="text-2xl font-semibold text-slate-900">Bảng Theo Dõi Hoạt Động</h1>
        <p className="text-sm text-slate-500 mt-2">Xem lịch tập chi tiết của từng khách hàng trong 12 tháng qua</p>
      </Card>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên khách hàng hoặc ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-slate-700">Chú thích:</span>
          <div className="flex gap-2 flex-wrap">
            <span className="flex items-center gap-1"><span className="h-4 w-4 rounded bg-slate-100 border border-slate-200" /><span className="text-xs text-slate-600">0 buổi</span></span>
            <span className="flex items-center gap-1"><span className="h-4 w-4 rounded bg-emerald-200 border border-emerald-300" /><span className="text-xs text-slate-600">1 buổi</span></span>
            <span className="flex items-center gap-1"><span className="h-4 w-4 rounded bg-emerald-400 border border-emerald-500" /><span className="text-xs text-slate-600">2 buổi</span></span>
            <span className="flex items-center gap-1"><span className="h-4 w-4 rounded bg-emerald-600 border border-emerald-700" /><span className="text-xs text-slate-600">3 buổi</span></span>
            <span className="flex items-center gap-1"><span className="h-4 w-4 rounded bg-emerald-800 border border-emerald-900" /><span className="text-xs text-slate-600">4+ buổi</span></span>
          </div>
        </div>
      </Card>

      {/* Main Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto" />
            <p className="mt-2 text-slate-600">Đang tải dữ liệu...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <p>Không tìm thấy khách hàng phù hợp</p>
          </div>
        ) : (
          <div className="overflow-hidden">
            {/* Header Row */}
            <div className="flex items-center gap-4 border-b-2 border-slate-200 py-3 px-4 bg-slate-50">
              <div className="w-64 shrink-0 font-semibold text-slate-700 text-sm">Khách Hàng</div>
              <div className="flex-1 font-semibold text-slate-700 text-sm">Lịch Tập 12 Tháng</div>
              <div className="w-32 shrink-0 font-semibold text-slate-700 text-sm text-right">Tần Suất</div>
            </div>

            {/* Data Rows */}
            <div className="max-h-[600px] overflow-y-auto">
              {filteredMembers.map(member => (
                <WorkoutRow
                  key={member.id}
                  member={member}
                  activityData={memberActivityMap[member.id] || []}
                  isHighlighted={false}
                />
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
