import { useMemo, useState } from 'react';
import { Camera, CirclePlay, PenLine, Plus, Save, Store, Trash2, Video, Wifi, WifiOff, X } from 'lucide-react';
const STORAGE_KEY = 'storelens.camera.manager';
const stores = [{
  id: 'STORE001',
  name: 'Cua hang Trung tam'
}, {
  id: 'STORE002',
  name: 'Cua hang Quan 7'
}, {
  id: 'STORE003',
  name: 'Cua hang Thu Duc'
}];
const initialCameras = [{
  id: 'cam-01',
  name: 'Camera cua ra vao',
  rtsp_url: 'rtsp://admin:123456@192.168.1.10:554/live/entrance',
  store_id: 'STORE001',
  description: 'Giam sat luong khach tai cua ra vao chinh.',
  status: 'active'
}, {
  id: 'cam-02',
  name: 'Camera quay thu ngan',
  rtsp_url: 'rtsp://admin:123456@192.168.1.11:554/live/checkout',
  store_id: 'STORE001',
  description: 'Theo doi khu vuc thanh toan.',
  status: 'issue'
}, {
  id: 'cam-03',
  name: 'Camera ke trung tam',
  rtsp_url: 'rtsp://admin:123456@192.168.1.12:554/live/aisle',
  store_id: 'STORE002',
  description: 'Theo doi hanh vi dung lai tai khu vuc trung tam.',
  status: 'inactive'
}];
const getMaskedRtsp = url => {
  try {
    const parsed = new URL(url);
    const protocol = parsed.protocol || 'rtsp:';
    const host = parsed.host || 'unknown';
    const path = parsed.pathname || '';
    return `${protocol}//***:***@${host}${path}`;
  } catch {
    return url;
  }
};
const statusBadge = status => {
  if (status === 'active') {
    return {
      label: 'Dang hoat dong',
      className: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    };
  }
  if (status === 'issue') {
    return {
      label: 'Loi ket noi',
      className: 'bg-rose-50 text-rose-700 border border-rose-200'
    };
  }
  return {
    label: 'Khong hoat dong',
    className: 'bg-slate-100 text-slate-600 border border-slate-200'
  };
};
const StatCard = ({
  title,
  value,
  accent,
  icon
}) => {
  return <div className="rounded-xl border border-white/20 bg-white/60 backdrop-blur-md p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent}`}>{icon}</div>
      </div>
    </div>;
};
export const CameraManager = () => {
  const [cameras, setCameras] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return initialCameras;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialCameras;
    }
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState(null);
  const [form, setForm] = useState({
    name: '',
    rtsp_url: '',
    store_id: stores[0].id,
    description: ''
  });
  const totalCameras = cameras.length;
  const activeStreams = cameras.filter(camera => camera.status === 'active').length;
  const issues = cameras.filter(camera => camera.status === 'issue').length;
  const storeMap = useMemo(() => {
    return stores.reduce((acc, store) => {
      acc[store.id] = store.name;
      return acc;
    }, {});
  }, []);
  const openCreateModal = () => {
    setEditingId(null);
    setFormError(null);
    setForm({
      name: '',
      rtsp_url: '',
      store_id: stores[0].id,
      description: ''
    });
    setIsFormOpen(true);
  };
  const openEditModal = camera => {
    setEditingId(camera.id);
    setFormError(null);
    setForm({
      name: camera.name,
      rtsp_url: camera.rtsp_url,
      store_id: camera.store_id,
      description: camera.description
    });
    setIsFormOpen(true);
  };
  const saveAll = next => {
    setCameras(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };
  const onSubmitForm = () => {
    if (!form.name.trim()) {
      setFormError('Vui long nhap ten camera.');
      return;
    }
    if (!form.rtsp_url.startsWith('rtsp://')) {
      setFormError('RTSP URL phai bat dau bang rtsp://');
      return;
    }
    if (editingId) {
      const next = cameras.map(camera => camera.id === editingId ? {
        ...camera,
        name: form.name.trim(),
        rtsp_url: form.rtsp_url.trim(),
        store_id: form.store_id,
        description: form.description.trim()
      } : camera);
      saveAll(next);
    } else {
      const newCamera = {
        id: `cam-${Date.now()}`,
        name: form.name.trim(),
        rtsp_url: form.rtsp_url.trim(),
        store_id: form.store_id,
        description: form.description.trim(),
        status: 'inactive'
      };
      saveAll([newCamera, ...cameras]);
    }
    setIsFormOpen(false);
  };
  const onDelete = id => {
    const next = cameras.filter(camera => camera.id !== id);
    saveAll(next);
  };
  const toggleStatus = id => {
    const next = cameras.map(camera => {
      if (camera.id !== id) {
        return camera;
      }
      return {
        ...camera,
        status: camera.status === 'active' ? 'inactive' : 'active'
      };
    });
    saveAll(next);
  };
  const openPreview = camera => {
    setSelectedPreview(camera);
    setIsPreviewOpen(true);
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-end gap-4">
        <button onClick={openCreateModal} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all">
          <Plus size={16} /> Them camera
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Tong camera" value={totalCameras} accent="bg-indigo-100 text-indigo-700" icon={<Camera size={18} />} />
        <StatCard title="Luong dang hoat dong" value={activeStreams} accent="bg-emerald-100 text-emerald-700" icon={<Wifi size={18} />} />
        <StatCard title="Gap su co" value={issues} accent="bg-rose-100 text-rose-700" icon={<WifiOff size={18} />} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white/70 backdrop-blur-md shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Ten camera</th>
                <th className="px-4 py-3">RTSP URL</th>
                <th className="px-4 py-3">Cua hang</th>
                <th className="px-4 py-3">Trang thai</th>
                <th className="px-4 py-3">Tac vu</th>
              </tr>
            </thead>
            <tbody>
              {cameras.map(camera => {
              const badge = statusBadge(camera.status);
              return <tr key={camera.id} className="border-t border-slate-200 hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{camera.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{camera.description || 'Khong co mo ta'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs text-slate-700 bg-slate-100 border border-slate-200 rounded px-2 py-1">
                        {getMaskedRtsp(camera.rtsp_url)}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center gap-2 text-slate-700 text-sm">
                        <Store size={14} /> {storeMap[camera.store_id] || camera.store_id}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}>
                        {camera.status === 'active' && <span className="relative flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />}
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openPreview(camera)} className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100" aria-label="Xem truoc camera">
                          <CirclePlay size={15} />
                        </button>
                        <button onClick={() => openEditModal(camera)} className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100" aria-label="Edit camera">
                          <PenLine size={15} />
                        </button>
                        <button onClick={() => onDelete(camera.id)} className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-rose-200 text-rose-600 hover:bg-rose-50" aria-label="Delete camera">
                          <Trash2 size={15} />
                        </button>
                        <button onClick={() => toggleStatus(camera.id)} className="inline-flex items-center justify-center px-2.5 h-8 rounded-md border border-slate-300 text-xs text-slate-600 hover:bg-slate-100">
                          {camera.status === 'active' ? 'Tat' : 'Bat'}
                        </button>
                      </div>
                    </td>
                  </tr>;
            })}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && <div className="fixed inset-0 bg-black/35 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-xl bg-white border border-slate-200 shadow-sm p-5 text-slate-900">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{editingId ? 'Cap nhat camera' : 'Them camera moi'}</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-500 hover:text-slate-900">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-700">Ten camera</label>
                <input value={form.name} onChange={e => setForm(prev => ({
              ...prev,
              name: e.target.value
            }))} className="mt-1 w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900" placeholder="VD: Camera cua ra vao" />
              </div>

              <div>
                <label className="text-sm text-slate-700">RTSP URL</label>
                <input value={form.rtsp_url} onChange={e => setForm(prev => ({
              ...prev,
              rtsp_url: e.target.value
            }))} className="mt-1 w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900" placeholder="rtsp://admin:password@192.168.x.x:554/..." />
              </div>

              <div>
                <label className="text-sm text-slate-700">Cua hang</label>
                <select value={form.store_id} onChange={e => setForm(prev => ({
              ...prev,
              store_id: e.target.value
            }))} className="mt-1 w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900">
                  {stores.map(store => <option key={store.id} value={store.id}>
                      {store.name}
                    </option>)}
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-700">Mo ta</label>
                <textarea value={form.description} onChange={e => setForm(prev => ({
              ...prev,
              description: e.target.value
            }))} rows={3} className="mt-1 w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900 resize-none" placeholder="Mo ta ngan ve vai tro camera" />
              </div>

              {formError && <p className="text-rose-300 text-sm">{formError}</p>}
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button onClick={() => setIsFormOpen(false)} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm">
                Huy
              </button>
              <button onClick={onSubmitForm} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium" style={{
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)'
          }}>
                <Save size={14} /> Luu cau hinh
              </button>
            </div>
          </div>
        </div>}

      {isPreviewOpen && selectedPreview && <div className="fixed inset-0 bg-black/45 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Xem truoc camera</h3>
                <p className="text-sm text-slate-500">{selectedPreview.name}</p>
              </div>
              <button onClick={() => setIsPreviewOpen(false)} className="text-slate-500 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              <div className="rounded-xl border border-slate-200 bg-slate-100 h-[320px] flex flex-col items-center justify-center text-center">
                <Video size={34} className="text-slate-500" />
                <p className="mt-3 text-slate-700 font-medium">Khung hinh xem truoc</p>
                <p className="text-sm text-slate-500 mt-1">Ket noi endpoint Edge AI de hien thi frame moi nhat.</p>
              </div>

              <p className="mt-3 text-xs text-slate-500">RTSP: {getMaskedRtsp(selectedPreview.rtsp_url)}</p>
            </div>
          </div>
        </div>}
    </div>;
};
