import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadCustomerData, setType, setFilters } from '../../redux/slices/customerSlice';
import { Card } from '../../components/common';
import { Search, Filter, Calendar, AlertTriangle, Star, Phone, ShoppingCart, DollarSign } from 'lucide-react';

/**
 * Customer Management Component
 * Manages both Gym Membership and Retail Customer data
 * Based on docs/common/Customer_Management_Module.md
 */
export const CustomerManagement = () => {
  const dispatch = useDispatch();
  const { type, data, loading, filters } = useSelector(state => state.customer);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(filters.category || 'all');

  useEffect(() => {
    dispatch(loadCustomerData(type));
  }, [dispatch, type]);

  const handleTypeChange = (newType) => {
    dispatch(setType(newType));
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    dispatch(setFilters({ search: value }));
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    dispatch(setFilters({ category: value }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Đang hoạt động': 'bg-green-100 text-green-800',
      'Hết hạn': 'bg-red-100 text-red-800',
      'Bảo lưu': 'bg-yellow-100 text-yellow-800'
    };
    return statusConfig[status] || 'bg-gray-100 text-gray-800';
  };

  const getRankBadge = (rank) => {
    const rankConfig = {
      'Diamond': 'bg-purple-100 text-purple-800',
      'Gold': 'bg-yellow-100 text-yellow-800',
      'Silver': 'bg-gray-100 text-gray-800'
    };
    return rankConfig[rank] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const filteredData = data.filter(item => {
    const matchesSearch = type === 'gym'
      ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      : item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm);

    const matchesCategory = selectedCategory === 'all' ||
      (type === 'gym' ? item.status === selectedCategory : item.rank === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý khách hàng</h1>
          <p className="text-slate-600">Theo dõi thông tin và hành vi khách hàng</p>
        </div>

        {/* Type Toggle */}
        <div className="flex bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => handleTypeChange('gym')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              type === 'gym'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Phòng Gym
          </button>
          <button
            onClick={() => handleTypeChange('retail')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              type === 'retail'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cửa hàng tiện lợi
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder={type === 'gym' ? 'Tìm theo tên hoặc mã thẻ...' : 'Tìm theo tên hoặc số điện thoại...'}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
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

          {/* Date Range (placeholder) */}
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-slate-400" />
            <button className="px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
              Chọn khoảng thời gian
            </button>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-slate-600">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {type === 'gym' ? (
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Thành viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Gói tập
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Tần suất
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Ngày hết hạn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Cảnh báo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredData.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="h-10 w-10 rounded-full" src={member.avatar} alt={member.name} />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{member.name}</div>
                            <div className="text-sm text-slate-500">{member.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {member.membershipPackage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(member.status)}`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {member.frequency} buổi/tuần
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {new Date(member.expiryDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {member.riskWarning && (
                          <AlertTriangle size={20} className="text-red-500" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Số lượng hóa đơn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Tổng chi tiêu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Sản phẩm mua nhiều
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Xếp hạng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredData.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-slate-900">{customer.name}</div>
                            <div className="text-sm text-slate-500 flex items-center">
                              <Phone size={14} className="mr-1" />
                              {customer.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        <div className="flex items-center">
                          <ShoppingCart size={16} className="mr-2 text-slate-400" />
                          {customer.totalInvoices}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900">
                        <div className="flex items-center">
                          <DollarSign size={16} className="mr-2 text-slate-400" />
                          {formatCurrency(customer.totalSpend)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {customer.topProduct}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRankBadge(customer.rank)}`}>
                          {customer.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <button className="text-blue-600 hover:text-blue-900">Xem lịch sử</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};