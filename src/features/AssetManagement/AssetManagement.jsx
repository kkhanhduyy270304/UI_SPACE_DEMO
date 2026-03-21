import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Cpu, Wrench, Package, Activity, Trash2, PencilLine, Plus, X } from 'lucide-react';

const ZONES = [
  { id: 'gate', name: 'Cổng vào' },
  { id: 'cardio', name: 'Khu Cardio' },
  { id: 'cashier', name: 'Quầy thu ngân' },
  { id: 'retail', name: 'Khu bán lẻ' }
];

const CATEGORY_OPTIONS = ['Thiết bị IoT', 'Máy tập', 'Hàng bán lẻ'];

const INITIAL_ASSETS = [
  {
    id: 'asset-001',
    assetCode: 'TG-IOT-001',
    name: 'Cổng từ FaceID',
    brand: 'TimeGym',
    category: 'Thiết bị IoT',
    zoneId: 'gate',
    maintenanceDate: '2026-04-18',
    status: 'active'
  },
  {
    id: 'asset-002',
    assetCode: 'TG-GYM-045',
    name: 'Máy chạy bộ Matrix',
    brand: 'Matrix',
    category: 'Máy tập',
    zoneId: 'cardio',
    maintenanceDate: '2026-04-25',
    status: 'maintenance'
  },
  {
    id: 'asset-003',
    assetCode: 'TG-POS-002',
    name: 'Máy POS thu ngân',
    brand: 'Timesoft',
    category: 'Thiết bị IoT',
    zoneId: 'cashier',
    maintenanceDate: '2026-05-02',
    status: 'active'
  },
  {
    id: 'asset-004',
    assetCode: 'TG-RTL-017',
    name: 'Kệ thực phẩm chức năng',
    brand: 'NutriStore',
    category: 'Hàng bán lẻ',
    zoneId: 'retail',
    maintenanceDate: '2026-05-10',
    status: 'inactive'
  }
];

const statusView = {
  active: {
    label: 'Đang hoạt động',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  },
  maintenance: {
    label: 'Bảo trì',
    className: 'bg-amber-50 text-amber-700 border border-amber-200'
  },
  inactive: {
    label: 'Ngừng hoạt động',
    className: 'bg-slate-100 text-slate-600 border border-slate-200'
  }
};

const getZoneName = zoneId => ZONES.find(zone => zone.id === zoneId)?.name || 'Chưa phân khu';

const buildForm = asset => ({
  assetCode: asset?.assetCode || '',
  name: asset?.name || '',
  brand: asset?.brand || '',
  category: asset?.category || CATEGORY_OPTIONS[0],
  zoneId: asset?.zoneId || ZONES[0].id,
  maintenanceDate: asset?.maintenanceDate || new Date().toISOString().split('T')[0],
  status: asset?.status || 'active'
});

const inputClassName =
  'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-0';

export const AssetManagement = () => {
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [form, setForm] = useState(buildForm());
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const summary = useMemo(() => {
    return {
      total: assets.length,
      active: assets.filter(item => item.status === 'active').length,
      maintenance: assets.filter(item => item.status === 'maintenance').length
    };
  }, [assets]);

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setEditingId(null);
    setForm(buildForm());
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const submitForm = () => {
    const payload = {
      id: editingId || `asset-${Date.now()}`,
      assetCode: form.assetCode.trim(),
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      zoneId: form.zoneId,
      maintenanceDate: form.maintenanceDate,
      status: form.status
    };

    if (!payload.assetCode || !payload.name) {
      return;
    }

    if (editingId) {
      setAssets(prev => prev.map(item => (item.id === editingId ? payload : item)));
    } else {
      setAssets(prev => [payload, ...prev]);
    }

    resetForm();
    setIsModalOpen(false);
  };

  const editAsset = asset => {
    setEditingId(asset.id);
    setForm(buildForm(asset));
    setIsModalOpen(true);
  };

  const deleteAsset = id => {
    const confirmed = window.confirm('Bạn chắc chắn muốn xóa tài sản này?');
    if (!confirmed) return;
    setAssets(prev => prev.filter(item => item.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-['DM_Sans']">
      <div className="mx-auto w-full max-w-[1760px] space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 inline-flex rounded-lg bg-indigo-50 p-2">
              <Package size={18} className="text-indigo-600" />
            </div>
            <p className="text-sm text-slate-500">Tổng tài sản</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{summary.total}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 inline-flex rounded-lg bg-emerald-50 p-2">
              <Activity size={18} className="text-emerald-600" />
            </div>
            <p className="text-sm text-slate-500">Đang hoạt động</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{summary.active}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 inline-flex rounded-lg bg-amber-50 p-2">
              <Wrench size={18} className="text-amber-600" />
            </div>
            <p className="text-sm text-slate-500">Cần bảo trì</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{summary.maintenance}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-1">
            <div className="mb-4 inline-flex items-center gap-2 text-slate-800">
              <Cpu size={18} className="text-indigo-600" />
              <span className="font-semibold">Nhập tài sản TimeGym</span>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-slate-600">Thêm thiết bị hoặc nhãn hàng mới qua cửa sổ ẩn để giao diện chính luôn gọn gàng.</p>
              <button
                onClick={openCreateModal}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                <Plus size={15} /> Thêm thiết bị / nhãn hàng
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden xl:col-span-2">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-3 font-semibold">Mã tài sản</th>
                    <th className="px-4 py-3 font-semibold">Tên thiết bị</th>
                    <th className="px-4 py-3 font-semibold">Khu vực</th>
                    <th className="px-4 py-3 font-semibold">Ngày bảo trì</th>
                    <th className="px-4 py-3 font-semibold">Trạng thái</th>
                    <th className="px-4 py-3 text-right font-semibold">Tác vụ</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset, index) => {
                    const status = statusView[asset.status] || statusView.active;
                    return (
                      <tr
                        key={asset.id}
                        className={`border-t border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'} hover:bg-slate-50`}
                      >
                        <td className="px-4 py-3 font-medium text-slate-700">{asset.assetCode}</td>
                        <td className="px-4 py-3 text-slate-900">
                          <p>{asset.name}</p>
                          <p className="text-xs text-slate-500">{asset.brand || 'Chưa có nhãn hàng'}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{getZoneName(asset.zoneId)}</td>
                        <td className="px-4 py-3 text-slate-700">{asset.maintenanceDate}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => editAsset(asset)}
                              className="inline-flex items-center rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
                              aria-label="Sửa tài sản"
                            >
                              <PencilLine size={14} />
                            </button>
                            <button
                              onClick={() => deleteAsset(asset.id)}
                              className="inline-flex items-center rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-rose-400 hover:text-rose-600"
                              aria-label="Xóa tài sản"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-5 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">{editingId ? 'Cập nhật thiết bị' : 'Thêm thiết bị / nhãn hàng'}</h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:text-slate-900"
                  aria-label="Đóng"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-3">
                <label className="block space-y-1">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Mã tài sản</span>
                  <input
                    value={form.assetCode}
                    onChange={e => updateForm('assetCode', e.target.value)}
                    className={inputClassName}
                    placeholder="TG-IOT-001"
                  />
                </label>

                <label className="block space-y-1">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Tên thiết bị</span>
                  <input
                    value={form.name}
                    onChange={e => updateForm('name', e.target.value)}
                    className={inputClassName}
                    placeholder="Máy chạy bộ Matrix"
                  />
                </label>

                <label className="block space-y-1">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Nhãn hàng</span>
                  <input
                    value={form.brand}
                    onChange={e => updateForm('brand', e.target.value)}
                    className={inputClassName}
                    placeholder="Matrix / Timesoft"
                  />
                </label>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <label className="block space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Danh mục</span>
                    <select
                      value={form.category}
                      onChange={e => updateForm('category', e.target.value)}
                      className={inputClassName}
                    >
                      {CATEGORY_OPTIONS.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Khu vực triển khai</span>
                    <select
                      value={form.zoneId}
                      onChange={e => updateForm('zoneId', e.target.value)}
                      className={inputClassName}
                    >
                      {ZONES.map(zone => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <label className="block space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Ngày bảo trì</span>
                    <input
                      type="date"
                      value={form.maintenanceDate}
                      onChange={e => updateForm('maintenanceDate', e.target.value)}
                      className={inputClassName}
                    />
                  </label>

                  <label className="block space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Trạng thái</span>
                    <select
                      value={form.status}
                      onChange={e => updateForm('status', e.target.value)}
                      className={inputClassName}
                    >
                      <option value="active">Đang hoạt động</option>
                      <option value="maintenance">Bảo trì</option>
                      <option value="inactive">Ngừng hoạt động</option>
                    </select>
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={submitForm}
                    className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                  >
                    {editingId ? 'Cập nhật' : 'Thêm tài sản'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};