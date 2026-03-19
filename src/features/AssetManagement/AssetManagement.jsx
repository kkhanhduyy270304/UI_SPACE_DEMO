import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Package, Wrench, MapPin, Plus, Trash2, Edit, X } from 'lucide-react';
import { useSelector } from 'react-redux';

const ZONES = [
  { id: 'zone-entrance', name: 'Khu vực lối vào' },
  { id: 'zone-cosmetics', name: 'Khu mỹ phẩm' },
  { id: 'zone-fashion', name: 'Khu thời trang' },
  { id: 'zone-gym', name: 'Khu thiết bị gym' },
  { id: 'zone-cashier', name: 'Khu thu ngân' }
];

const CATEGORY_OPTIONS = ['Thiết bị gym', 'Kệ bán lẻ', 'Thiết bị điện tử', 'Máy POS', 'Kệ trưng bày'];

const INITIAL_ASSETS = [
  {
    id: 'asset-001',
    name: 'Treadmill Pro X',
    brand: 'PulseFit',
    category: 'Gym Equipment',
    zoneId: 'zone-gym',
    unit: 'unit',
    price: 2599,
    stockQuantity: 3,
    status: 'active',
    maintenanceDate: '2026-04-22',
    color: 'Black',
    customNote: 'Used for premium demo sessions.',
    coordinates: { x: 2, y: 6 }
  },
  {
    id: 'asset-002',
    name: 'Chanel Display Shelf',
    brand: 'LuxeStore',
    category: 'Retail Shelves',
    zoneId: 'zone-cosmetics',
    unit: 'set',
    price: 980,
    stockQuantity: 14,
    status: 'active',
    maintenanceDate: '2026-06-10',
    color: 'White',
    customNote: 'High attention score in heatmap.',
    coordinates: { x: 5, y: 3 }
  },
  {
    id: 'asset-003',
    name: 'POS Terminal V3',
    brand: 'RetailCore',
    category: 'POS Terminal',
    zoneId: 'zone-cashier',
    unit: 'unit',
    price: 1490,
    stockQuantity: 2,
    status: 'maintenance',
    maintenanceDate: '2026-03-25',
    color: 'Gray',
    customNote: 'Firmware upgrade scheduled.',
    coordinates: { x: 8, y: 8 }
  },
  {
    id: 'asset-004',
    name: 'Interactive Mirror',
    brand: 'VisionPlus',
    category: 'Electronics',
    zoneId: 'zone-fashion',
    unit: 'unit',
    price: 3200,
    stockQuantity: 0,
    status: 'inactive',
    maintenanceDate: '2026-03-20',
    color: 'Silver',
    customNote: 'Waiting for replacement part.',
    coordinates: { x: 6, y: 5 }
  }
];

const statusView = {
  active: {
    label: 'Đang hoạt động',
    className: 'bg-emerald-100 text-emerald-700 border border-emerald-200'
  },
  maintenance: {
    label: 'Bảo trì',
    className: 'bg-amber-100 text-amber-700 border border-amber-200'
  },
  inactive: {
    label: 'Ngừng hoạt động',
    className: 'bg-rose-100 text-rose-700 border border-rose-200'
  }
};

const getZoneName = zoneId => ZONES.find(zone => zone.id === zoneId)?.name || 'Khong ro khu vuc';

const toInputDate = value => value || new Date().toISOString().split('T')[0];

const buildAssetForm = asset => ({
  id: asset?.id || null,
  name: asset?.name || '',
  brand: asset?.brand || '',
  category: asset?.category || CATEGORY_OPTIONS[0],
  zoneId: asset?.zoneId || ZONES[0].id,
  unit: asset?.unit || 'unit',
  price: asset?.price ?? 0,
  stockQuantity: asset?.stockQuantity ?? 0,
  status: asset?.status || 'active',
  maintenanceDate: toInputDate(asset?.maintenanceDate),
  color: asset?.color || '',
  customNote: asset?.customNote || '',
  coordinates: asset?.coordinates || { x: 0, y: 0 }
});

const summaryCardClass = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm';

export const AssetManagement = () => {
  const { locationId, cameraId, date } = useSelector(state => state.filter);
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState(null);
  const [form, setForm] = useState(buildAssetForm());

  const summary = useMemo(() => {
    const total = assets.length;
    const activeCount = assets.filter(asset => asset.status === 'active').length;
    const pendingMaintenance = assets.filter(asset => new Date(asset.maintenanceDate) <= new Date('2026-04-01')).length;
    return { total, activeCount, pendingMaintenance };
  }, [assets]);

  const openAddModal = () => {
    setEditingAssetId(null);
    setForm(buildAssetForm());
    setIsModalOpen(true);
  };

  const openEditModal = asset => {
    setEditingAssetId(asset.id);
    setForm(buildAssetForm(asset));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAssetId(null);
  };

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const saveAsset = () => {
    const payload = {
      ...form,
      id: editingAssetId || `asset-${Date.now()}`,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity)
    };

    if (editingAssetId) {
      setAssets(prev => prev.map(item => (item.id === editingAssetId ? payload : item)));
    } else {
      setAssets(prev => [payload, ...prev]);
    }

    closeModal();
  };

  const deleteAsset = assetId => {
    const confirmed = window.confirm('Bạn chắc chắn muốn xóa tài sản này?');
    if (!confirmed) return;
    setAssets(prev => prev.filter(asset => asset.id !== assetId));
  };

  const setCoordinate = (x, y) => {
    setForm(prev => ({ ...prev, coordinates: { x, y } }));
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto w-full max-w-[1760px] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quan ly tai san</h1>
            <p className="mt-1 text-sm text-slate-600">
              Quản lý tài sản vật lý theo khu vực. Filter: {locationId} / {cameraId} / {date}
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            <Plus size={16} />
            Them tai san
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className={summaryCardClass}>
            <div className="mb-3 inline-flex rounded-lg bg-blue-100 p-2">
              <Package size={18} className="text-blue-600" />
            </div>
            <p className="text-sm text-slate-600">Tong tai san</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{summary.total}</p>
          </div>

          <div className={summaryCardClass}>
            <div className="mb-3 inline-flex rounded-lg bg-emerald-100 p-2">
              <MapPin size={18} className="text-emerald-600" />
            </div>
            <p className="text-sm text-slate-600">Dang trien khai</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{summary.activeCount}</p>
          </div>

          <div className={summaryCardClass}>
            <div className="mb-3 inline-flex rounded-lg bg-amber-100 p-2">
              <Wrench size={18} className="text-amber-600" />
            </div>
            <p className="text-sm text-slate-600">Cho bao tri</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{summary.pendingMaintenance}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Danh sach tai san</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="px-3 py-3 font-medium">Ten tai san & Thuong hieu</th>
                  <th className="px-3 py-3 font-medium">Khu vuc</th>
                  <th className="px-3 py-3 font-medium">Toa do ban do</th>
                  <th className="px-3 py-3 font-medium">Gia / Don vi</th>
                  <th className="px-3 py-3 font-medium">Ton kho</th>
                  <th className="px-3 py-3 font-medium">Trang thai</th>
                  <th className="px-3 py-3 text-right font-medium">Tac vu</th>
                </tr>
              </thead>
              <tbody>
                {assets.map(asset => {
                  const stockPercent = Math.max(0, Math.min(100, Math.round((asset.stockQuantity / 20) * 100)));
                  const stockBarColor = asset.stockQuantity <= 3 ? 'bg-rose-500' : asset.stockQuantity <= 8 ? 'bg-amber-500' : 'bg-emerald-500';
                  const status = statusView[asset.status] || statusView.active;

                  return (
                    <tr key={asset.id} className="border-b border-slate-200 text-slate-800 hover:bg-slate-50">
                      <td className="px-3 py-3">
                        <p className="font-semibold text-slate-900">{asset.name}</p>
                        <p className="text-xs text-slate-500">{asset.brand} • {asset.category}</p>
                      </td>
                      <td className="px-3 py-3 text-slate-700">{getZoneName(asset.zoneId)}</td>
                      <td className="px-3 py-3 text-slate-700 font-mono">({asset.coordinates.x}, {asset.coordinates.y})</td>
                      <td className="px-3 py-3 text-slate-700">${asset.price.toLocaleString()} / {asset.unit}</td>
                      <td className="px-3 py-3">
                        <p className="mb-1 text-xs text-slate-600">{asset.stockQuantity} don vi</p>
                        <div className="h-2 w-36 rounded-full bg-slate-200">
                          <div className={`h-full rounded-full ${stockBarColor}`} style={{ width: `${stockPercent}%` }} />
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(asset)}
                            className="inline-flex items-center rounded-lg border border-slate-300 p-2 text-slate-600 transition hover:border-indigo-500 hover:text-indigo-600"
                            aria-label="Sua tai san"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => deleteAsset(asset.id)}
                            className="inline-flex items-center rounded-lg border border-slate-300 p-2 text-slate-600 transition hover:border-rose-500 hover:text-rose-600"
                            aria-label="Xoa tai san"
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
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="max-h-[92vh] w-full max-w-4xl overflow-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {editingAssetId ? 'Sua tai san' : 'Them tai san'}
                </h3>
                <button
                  onClick={closeModal}
                  className="rounded-lg border border-slate-300 p-2 text-slate-600 hover:text-slate-900"
                  aria-label="Dong hop thoai"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-xs font-medium text-slate-600">Ten san pham</span>
                  <input
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/20 focus:ring"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-medium text-slate-600">Thuong hieu</span>
                  <input
                    value={form.brand}
                    onChange={e => handleChange('brand', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/20 focus:ring"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-medium text-slate-600">Danh muc</span>
                  <select
                    value={form.category}
                    onChange={e => handleChange('category', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/20 focus:ring"
                  >
                    {CATEGORY_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-medium text-slate-600">Khu vuc trien khai</span>
                  <select
                    value={form.zoneId}
                    onChange={e => handleChange('zoneId', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/20 focus:ring"
                  >
                    {ZONES.map(zone => (
                      <option key={zone.id} value={zone.id}>{zone.name}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-medium text-slate-600">Gia</span>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={e => handleChange('price', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/20 focus:ring"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-medium text-slate-600">So luong ton kho</span>
                  <input
                    type="number"
                    min="0"
                    value={form.stockQuantity}
                    onChange={e => handleChange('stockQuantity', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/20 focus:ring"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-medium text-slate-600">Don vi</span>
                  <input
                    value={form.unit}
                    onChange={e => handleChange('unit', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/20 focus:ring"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-xs font-medium text-slate-600">Trang thai</span>
                  <select
                    value={form.status}
                    onChange={e => handleChange('status', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/20 focus:ring"
                  >
                    <option value="active">Dang hoat dong</option>
                    <option value="maintenance">Bao tri</option>
                    <option value="inactive">Ngung hoat dong</option>
                  </select>
                </label>

                <label className="space-y-1 lg:col-span-2">
                  <span className="text-xs font-medium text-slate-600">Lich bao tri</span>
                  <input
                    type="date"
                    value={form.maintenanceDate}
                    onChange={e => handleChange('maintenanceDate', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/20 focus:ring"
                  />
                </label>

                <label className="space-y-1 lg:col-span-2">
                  <span className="text-xs font-medium text-slate-600">Mau sac / Thuoc tinh</span>
                  <input
                    value={form.color}
                    onChange={e => handleChange('color', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/20 focus:ring"
                  />
                </label>

                <label className="space-y-1 lg:col-span-2">
                  <span className="text-xs font-medium text-slate-600">Ghi chu</span>
                  <textarea
                    rows={3}
                    value={form.customNote}
                    onChange={e => handleChange('customNote', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-indigo-500/20 focus:ring"
                  />
                </label>
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">Cong cu mini-map</p>
                  <p className="text-xs text-slate-600">
                    Pin: ({form.coordinates.x}, {form.coordinates.y})
                  </p>
                </div>

                <div className="grid grid-cols-10 gap-1">
                  {Array.from({ length: 100 }).map((_, index) => {
                    const x = index % 10;
                    const y = Math.floor(index / 10);
                    const isPinned = form.coordinates.x === x && form.coordinates.y === y;
                    return (
                      <button
                        key={`${x}-${y}`}
                        type="button"
                        onClick={() => setCoordinate(x, y)}
                        className={`aspect-square rounded ${isPinned ? 'bg-indigo-500' : 'bg-slate-200 hover:bg-slate-300'}`}
                        aria-label={`Ghim vi tri ${x}-${y}`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={closeModal}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Huy
                </button>
                <button
                  onClick={saveAsset}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  Luu tai san
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
