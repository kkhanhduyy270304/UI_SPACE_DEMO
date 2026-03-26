import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadCustomerData, setFilters, deleteCustomer, updateCustomer } from '../../redux/slices/customerSlice';
import { Card } from '../../components/common';
import { Search, Filter, Calendar, AlertTriangle, Phone, ShoppingCart, DollarSign, Eye, Pencil, Trash2, ChevronDown } from 'lucide-react';
import { Cell, PieChart, Pie, ResponsiveContainer, Tooltip } from 'recharts';

/**
 * Unified Customer Management + Analytics Dashboard
 */
export const CustomerManagement = () => {
  const dispatch = useDispatch();
  const { type, data, loading, filters, analytics, error } = useSelector(state => state.customer);

  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(filters.category || 'all');
  const [isAnalyticsCollapsed, setIsAnalyticsCollapsed] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  useEffect(() => {
    dispatch(loadCustomerData(type));
    dispatch(loadCustomerData('analysis'));
  }, [dispatch, type]);

  const memberBehaviorMap = useMemo(() => {
    const map = {};
    (analytics.memberList || []).forEach(member => {
      if (member.id) map[member.id] = member;
      if (member.fullName) map[member.fullName] = member;
    });
    return map;
  }, [analytics.memberList]);

  const getBehaviorBadge = (group) => {
    const style = {
      'Thân thiết': 'bg-emerald-100 text-emerald-700',
      'Vãng lai': 'bg-blue-100 text-blue-700',
      'Tiềm năng': 'bg-amber-100 text-amber-700',
      'Nguy cơ rời đi': 'bg-rose-100 text-rose-700',
      'Không xác định': 'bg-slate-100 text-slate-600'
    };
    return style[group] || 'bg-slate-100 text-slate-600';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Đang hoạt động': 'bg-green-100 text-green-800',
      'Hết hạn': 'bg-red-100 text-red-800',
      'Bảo lưu': 'bg-yellow-100 text-yellow-800'
    };
    return statusConfig[status] || 'bg-gray-100 text-gray-800';
  };

  const mapGroupToTier = (group) => {
    if (!group) return 'Không xác định';
    const mapping = {
      'Thân thiết': 'Gold/VIP',
      'Vãng lai': 'Silver',
      'Tiềm năng': 'New Member',
      'Nguy cơ rời đi': 'Silver'
    };
    return mapping[group] || 'Không xác định';
  };

  const getMemberInsight = (member) => {
    if (!member || !analytics?.memberList) return {
      group: 'Không xác định',
      lastSeen: 'Chưa có dữ liệu',
      visits30d: 'Chưa có dữ liệu',
      dwellMinutes: 'Chưa có dữ liệu'
    };
    
    const found = analytics.memberList.find(item => 
      item.id === member.id || item.fullName === member.name || item.id === member.name
    );
    
    return found || {
      group: 'Không xác định',
      lastSeen: 'Chưa có dữ liệu',
      visits30d: 'Chưa có dữ liệu',
      dwellMinutes: 'Chưa có dữ liệu'
    };
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    dispatch(setFilters({ search: value }));
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    dispatch(setFilters({ category: value }));
  };

  const openDetail = (member) => {
    setSelectedMember(member);
    setShowDetailModal(true);
  };

  const openEdit = (member) => {
    setSelectedMember(member);
    setEditFormData({ ...member });
    setShowEditModal(true);
  };

  const confirmDelete = (member) => {
    setSelectedMember(member);
    setShowDeleteConfirm(true);
  };

  const handleApplyUpdate = () => {
    if (!editFormData) return;
    dispatch(updateCustomer(editFormData));
    setShowEditModal(false);
    setSelectedMember(editFormData);
  };

  const handleDelete = () => {
    if (!selectedMember?.id) return;
    dispatch(deleteCustomer(selectedMember.id));
    setShowDeleteConfirm(false);
    setShowDetailModal(false);
    setSelectedMember(null);
  };

  const filteredData = data.filter(item => {
    const text = searchTerm.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(text) || (item.id || '').toLowerCase().includes(text) || (item.phone || '').includes(text);
    const matchesCategory = selectedCategory === 'all' ||
      (type === 'gym' ? item.status === selectedCategory : item.rank === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const preferredZone = analytics?.areaPriorities?.[0]?.zone || 'N/A';

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Dashboard Quản lý khách hàng</h2>
          <button onClick={() => setIsAnalyticsCollapsed(prev => !prev)} className="inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-sm text-slate-700 hover:bg-slate-100">
            <span>{isAnalyticsCollapsed ? 'Mở rộng' : 'Thu gọn'}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isAnalyticsCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {!isAnalyticsCollapsed && (
          <div className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-4 bg-white border border-slate-200">
                <p className="text-sm text-slate-500">Tổng thành viên</p>
                <h3 className="text-3xl font-bold text-slate-900">{analytics.kpi?.totalMembers?.toLocaleString() ?? '--'}</h3>
                <p className="text-xs text-slate-500">Tăng: {analytics.kpi?.totalMembersGrowth ?? '--'}%</p>
              </Card>
              <Card className="p-4 bg-white border border-slate-200">
                <p className="text-sm text-slate-500">Tỷ lệ quay lại</p>
                <h3 className="text-3xl font-bold text-slate-900">{analytics.kpi?.returnRate?.toFixed(1) ?? '--'}%</h3>
                <p className="text-xs text-slate-500">Tăng: {analytics.kpi?.returnRateGrowth ?? '--'}%</p>
              </Card>
              <Card className="p-4 bg-white border border-slate-200">
                <p className="text-sm text-slate-500">Thời gian dừng trung bình</p>
                <h3 className="text-3xl font-bold text-slate-900">{analytics.kpi?.avgDwellMinutes?.toFixed(1) ?? '--'} phút</h3>
                <p className="text-xs text-slate-500">Tăng: {analytics.kpi?.avgDwellGrowthMinutes ?? '--'} phút</p>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-4 bg-white border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Phân bổ nhóm đối tượng</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={analytics.segments || []} cx="50%" cy="50%" innerRadius={70} outerRadius={100} dataKey="percent" paddingAngle={2}>
                        {(analytics.segments || []).map((segment, idx) => <Cell key={idx} fill={segment.color} />)}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-4 bg-white border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Chiến lược đề xuất</h3>
                <div className="space-y-2">
                  {(analytics.aiInsights || []).map(insight => (
                    <div key={insight.id} className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                      <p className="text-sm font-semibold text-slate-800">{insight.title}</p>
                      <p className="text-sm text-slate-700">{insight.message}</p>
                    </div>
                  ))}
                  {!(analytics.aiInsights || []).length && <p className="text-sm text-slate-500">Chưa có gợi ý.</p>}
                </div>
              </Card>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="min-w-[240px] grow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Tìm theo tên, mã, số điện thoại..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-slate-400" />
            <select value={selectedCategory} onChange={(e) => handleCategoryChange(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">Tất cả</option>
              {type === 'gym' ? (
                <>
                  <option value="Đang hoạt động">Đang hoạt động</option>
                  <option value="Hết hạn">Hết hạn</option>
                  <option value="Bảo lưu">Bảo lưu</option>
                </>
              ) : (
                <>
                  <option value="Diamond">Diamond</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                </>
              )}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-slate-400" />
            <button className="px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">Chọn khoảng thời gian</button>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {error && <div className="p-4 text-red-600">Lỗi: {error}</div>}
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-2 text-slate-600">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Thành viên</th>
                  <th className="px-4 py-3">Gói tập</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Tần suất</th>
                  <th className="px-4 py-3">Ngày hết hạn</th>
                  <th className="px-4 py-3">Cảnh báo</th>
                  <th className="px-4 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredData.map(member => {
                  return (
                    <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {member.avatar && <img className="h-10 w-10 rounded-full object-cover" src={member.avatar} alt={member.name} />}
                          <div>
                            <p className="font-medium text-slate-900">{member.name}</p>
                            <p className="text-xs text-slate-500">{member.id || (member.phone || '---')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{member.membershipPackage || '-'}</td>
                      <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadge(member.status || 'Không xác định')}`}>{member.status || 'Không xác định'}</span></td>
                      <td className="px-4 py-3">{member.frequency != null ? `${member.frequency} buổi/tuần` : '-'}</td>
                      <td className="px-4 py-3">{member.expiryDate ? new Date(member.expiryDate).toLocaleDateString('vi-VN') : '-'}</td>
                      <td className="px-4 py-3">{member.riskWarning ? <AlertTriangle size={16} className="text-rose-500" /> : '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openDetail(member)} className="rounded-lg p-1 hover:bg-slate-100 text-slate-600"><Eye size={16} /></button>
                          <button onClick={() => openEdit(member)} className="rounded-lg p-1 hover:bg-slate-100 text-slate-600"><Pencil size={16} /></button>
                          <button onClick={() => confirmDelete(member)} className="rounded-lg p-1 hover:bg-slate-100 text-rose-600"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {!filteredData.length && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">Không tìm thấy dữ liệu phù hợp.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showDetailModal && selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-4xl rounded-xl bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Chi tiết khách hàng</h3>
                <button onClick={() => setShowDetailModal(false)} className="text-slate-500 hover:text-slate-900">Đóng</button>
              </div>

              {(() => {
                const insight = getMemberInsight(selectedMember);
                const behaviorGroup = insight?.group || 'Không xác định';
                const tier = selectedMember?.rank || mapGroupToTier(insight?.group) || 'Không xác định';
                const lastSeen = insight?.lastSeen || 'Chưa có dữ liệu';
                const visits30d = insight?.visits30d ?? 'Chưa có dữ liệu';
                const dwellMinutes = insight?.dwellMinutes ?? 'Chưa có dữ liệu';

                return (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-slate-900 border-b pb-2">Thông tin quản lý</h4>
                      <div className="grid gap-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-slate-600">Tên:</span>
                          <span className="text-sm text-slate-900">{selectedMember.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-slate-600">Điện thoại:</span>
                          <span className="text-sm text-slate-900">{selectedMember.phone || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-slate-600">Email:</span>
                          <span className="text-sm text-slate-900">{selectedMember.email || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-slate-600">ID:</span>
                          <span className="text-sm text-slate-900">{selectedMember.id || 'Chưa có'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-slate-600">Gói tập:</span>
                          <span className="text-sm text-slate-900">{selectedMember.membershipPackage || 'Chưa có'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-slate-600">Ngày hết hạn:</span>
                          <span className="text-sm text-slate-900">{selectedMember.expiryDate ? new Date(selectedMember.expiryDate).toLocaleDateString('vi-VN') : 'Chưa có'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-slate-600">Trạng thái:</span>
                          <span className="text-sm text-slate-900">{selectedMember.status || 'Không xác định'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-slate-900 border-b pb-2">Phân tích hành vi</h4>
                      <div className="grid gap-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-slate-600">Nhóm hành vi:</span>
                          <span className="text-sm text-slate-900">{behaviorGroup}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-slate-600">Tier:</span>
                          <span className="text-sm text-slate-900">{tier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-slate-600">Lần cuối:</span>
                          <span className="text-sm text-slate-900">{lastSeen}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-slate-600">Lượt/30 ngày:</span>
                          <span className="text-sm text-slate-900">{visits30d}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-slate-600">Thời gian dừng:</span>
                          <span className="text-sm text-slate-900">{dwellMinutes} phút</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-slate-600">Zone ưa thích:</span>
                          <span className="text-sm text-slate-900">{preferredZone}</span>
                        </div>
                      </div>

                      <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
                        <p className="text-sm font-semibold text-blue-800 mb-2">AI Insight</p>
                        <p className="text-sm text-blue-700">Khuyến nghị: Thiết lập chương trình khuyến mãi 1:1 cho nhóm {behaviorGroup} để tăng giữ chân.</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="mt-6 flex justify-end gap-3 border-t pt-4">
                <button onClick={() => setShowDetailModal(false)} className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Đóng</button>
                <button onClick={() => { setShowDetailModal(false); openEdit(selectedMember); }} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Sửa</button>
                <button onClick={handleDelete} className="rounded-md bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700">Xóa</button>
              </div>
            </div>
          </div>
      )}

      {showEditModal && editFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Cập nhật khách hàng</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-500 hover:text-slate-900">Đóng</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-600">Tên</label>
                <input
                  value={editFormData.name || ''}
                  onChange={e => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600">Số điện thoại</label>
                <input
                  value={editFormData.phone || ''}
                  onChange={e => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setShowEditModal(false)} className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700">Hủy</button>
              <button onClick={handleApplyUpdate} className="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white">Lưu</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5">
            <h3 className="text-lg font-semibold">Xác nhận xóa</h3>
            <p className="mt-2 text-sm text-slate-700">Bạn có chắc muốn xóa khách hàng {selectedMember.name} không?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowDeleteConfirm(false)} className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700">Hủy</button>
              <button onClick={handleDelete} className="rounded-md bg-rose-600 px-3 py-2 text-sm text-white">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
