import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loadCustomerData } from '../../redux/slices/customerSlice';
import { Card } from '../../components/common';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Users, LineChart, Clock, Sparkles, TrendingUp, AlertTriangle, Lightbulb, RotateCcw, Search, ArrowRight } from 'lucide-react';

const DEFAULT_FILTERS = {
  regionId: null,
  storeId: null,
  cameraId: null,
  date: new Date().toISOString().split('T')[0]
};

const REGION_OPTIONS = [
  { id: 'north', name: 'Miền Bắc' },
  { id: 'central', name: 'Miền Trung' },
  { id: 'south', name: 'Miền Nam' }
];

const STORE_OPTIONS = [
  { id: 'store-001', name: 'Cửa hàng Hà Nội', regionId: 'north' },
  { id: 'store-002', name: 'Cửa hàng Đà Nẵng', regionId: 'central' },
  { id: 'store-003', name: 'Cửa hàng TP.HCM', regionId: 'south' }
];

const CAMERA_OPTIONS = [
  { id: 'cam-all', name: 'Tất cả camera' },
  { id: 'cam-entrance', name: 'Camera lối vào' },
  { id: 'cam-training', name: 'Camera khu tập luyện' },
  { id: 'cam-cardio', name: 'Camera khu cardio' }
];

const insightStyles = {
  trend: {
    wrapper: 'border-green-200 bg-green-50',
    icon: <TrendingUp size={18} className="text-green-700" />,
    title: 'text-green-800',
    body: 'text-green-900'
  },
  attention: {
    wrapper: 'border-amber-200 bg-amber-50',
    icon: <AlertTriangle size={18} className="text-amber-700" />,
    title: 'text-amber-800',
    body: 'text-amber-900'
  },
  strategy: {
    wrapper: 'border-blue-200 bg-blue-50',
    icon: <Lightbulb size={18} className="text-blue-700" />,
    title: 'text-blue-800',
    body: 'text-blue-900'
  }
};

const groupBadgeStyles = {
  'Thân thiết': 'bg-green-100 text-green-800',
  'Vãng lai': 'bg-blue-100 text-blue-800',
  'Tiềm năng': 'bg-orange-100 text-orange-800',
  'Nguy cơ rời đi': 'bg-rose-100 text-rose-800'
};

const numberFormatter = new Intl.NumberFormat('vi-VN');

/**
 * CustomerAnalysis - customer segmentation, behavior and AI suggestions.
 */
export const CustomerAnalysis = () => {
  const dispatch = useAppDispatch();
  const { analytics, loading, error } = useAppSelector(state => state.customer);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(loadCustomerData('analysis'));
  }, [dispatch, filters]);

  const stores = useMemo(() => {
    return STORE_OPTIONS.filter(store => !filters.regionId || store.regionId === filters.regionId);
  }, [filters.regionId]);

  const kpi = analytics?.kpi;
  const segments = analytics?.segments || [];
  const aiInsights = analytics?.aiInsights || [];
  const typicalFlow = analytics?.typicalFlow || [];

  const members = analytics?.memberList || [];
  const filteredMembers = useMemo(() => {
    return members.filter(member => member.fullName.toLowerCase().includes(search.toLowerCase()));
  }, [members, search]);

  const areaPriorityData = useMemo(() => {
    return (analytics?.areaPriorities || []).map(item => ({
      ...item,
      avgDwellLabel: `${item.avgDwellMinutes} phút`
    }));
  }, [analytics?.areaPriorities]);

  const handleFilterChange = (key, value) => {
    const next = { ...filters, [key]: value };

    if (key === 'regionId') {
      next.storeId = null;
      next.cameraId = null;
    }

    if (key === 'storeId') {
      next.cameraId = null;
    }

    setFilters(next);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch('');
  };

  if (!kpi) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F9FA]">
        <p className="text-gray-600 text-xl">{loading ? 'Đang tải phân tích khách hàng...' : 'Đang chuẩn bị dữ liệu phân tích...'}</p>
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
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Phân tích khách hàng</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Khu vực</label>
              <select
                value={filters.regionId || ''}
                onChange={(event) => handleFilterChange('regionId', event.target.value || null)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Chọn khu vực</option>
                {REGION_OPTIONS.map(region => (
                  <option key={region.id} value={region.id}>{region.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cửa hàng</label>
              <select
                value={filters.storeId || ''}
                onChange={(event) => handleFilterChange('storeId', event.target.value || null)}
                disabled={!filters.regionId}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">Chọn cửa hàng</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Camera</label>
              <select
                value={filters.cameraId || ''}
                onChange={(event) => handleFilterChange('cameraId', event.target.value || null)}
                disabled={!filters.storeId}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">Chọn camera</option>
                {CAMERA_OPTIONS.map(camera => (
                  <option key={camera.id} value={camera.id}>{camera.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày</label>
              <input
                type="date"
                value={filters.date}
                onChange={(event) => handleFilterChange('date', event.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={resetFilters}
              className="h-10 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 inline-flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <Card className="col-span-12 md:col-span-4 p-6 bg-white rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-green-600">+{kpi.totalMembersGrowth}%</span>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Tổng thành viên</p>
            <p className="text-3xl font-bold text-gray-900">{numberFormatter.format(kpi.totalMembers)}</p>
          </Card>

          <Card className="col-span-12 md:col-span-4 p-6 bg-white rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <LineChart className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-green-600">+{kpi.returnRateGrowth}%</span>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Tỷ lệ quay lại</p>
            <p className="text-3xl font-bold text-gray-900">{kpi.returnRate}%</p>
          </Card>

          <Card className="col-span-12 md:col-span-4 p-6 bg-white rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm font-semibold text-green-600">+{kpi.avgDwellGrowthMinutes} phút</span>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Thời gian dừng TB</p>
            <p className="text-3xl font-bold text-gray-900">{kpi.avgDwellMinutes} phút</p>
          </Card>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <Card className="col-span-12 xl:col-span-5 p-6 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Phân bổ nhóm đối tượng</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={segments}
                      dataKey="percent"
                      nameKey="label"
                      innerRadius={58}
                      outerRadius={92}
                      label={({ percent }) => `${percent}%`}
                      labelLine={false}
                    >
                      {segments.map(segment => (
                        <Cell key={segment.key} fill={segment.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {segments.map(segment => (
                  <div key={segment.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                      <span className="text-sm text-gray-700">{segment.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {segment.percent}% ({numberFormatter.format(segment.members)})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="col-span-12 xl:col-span-7 p-6 bg-white rounded-xl shadow-sm border border-violet-200">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-violet-600" size={20} />
              <h2 className="text-xl font-semibold text-gray-900">GenAI Assistant</h2>
            </div>

            <div className="space-y-3">
              {aiInsights.map(insight => {
                const style = insightStyles[insight.type];
                return (
                  <div key={insight.id} className={`rounded-lg border p-4 ${style.wrapper}`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{style.icon}</div>
                      <div>
                        <h3 className={`text-sm font-semibold ${style.title}`}>{insight.title}</h3>
                        <p className={`text-sm mt-1 ${style.body}`}>{insight.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Danh sách thành viên</h2>

            <div className="relative w-full sm:w-72">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm kiếm theo tên..."
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Họ và tên</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nhóm</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Lần cuối</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Lượt/30d</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Dwell Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map(member => (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{member.fullName}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${groupBadgeStyles[member.group] || 'bg-gray-100 text-gray-700'}`}>
                        {member.group}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{member.lastSeen}</td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">{member.visits30d}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{member.dwellMinutes} phút</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid grid-cols-12 gap-6">
          <Card className="col-span-12 lg:col-span-6 p-6 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ưu tiên khu vực</h2>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={areaPriorityData} margin={{ left: 12, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="zone" width={90} />
                  <Tooltip formatter={(value, _, item) => [`${value} lượt`, `${item.payload.avgDwellMinutes} phút TB`]} />
                  <Bar dataKey="visitors" fill="#2563EB" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="col-span-12 lg:col-span-6 p-6 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Lộ trình điển hình</h2>
            <div className="h-[320px] flex items-center">
              <div className="w-full flex flex-wrap items-center justify-center gap-3">
                {typicalFlow.map((node, index, arr) => (
                  <div key={node.step} className="flex items-center gap-2">
                    <div className="px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 min-w-28 text-center">
                      <p className="font-semibold text-slate-800">{node.step}</p>
                      {typeof node.transitionRate === 'number' && (
                        <p className="text-xs text-slate-600 mt-1">{node.transitionRate}% chuyển tiếp</p>
                      )}
                    </div>

                    {index < arr.length - 1 && <ArrowRight size={18} className="text-slate-400" />}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
