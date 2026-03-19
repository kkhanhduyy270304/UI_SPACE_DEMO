import { useDispatch, useSelector } from 'react-redux';
import { CalendarDays, Database, Download, Store, Upload } from 'lucide-react';
import { setCamera, setDate, setLocation } from '../../redux/slices/filterSlice';

const locations = [
  { id: 'loc_all', label: 'Tất cả cơ sở' },
  { id: 'loc_q1', label: 'Gym Quận 1' },
  { id: 'loc_q7', label: 'Gym Quận 7' }
];

const camerasByLocation = {
  loc_all: [
    { id: 'cam_all', label: 'Tất cả camera' },
    { id: 'cam_front', label: 'Camera Cửa chính' },
    { id: 'cam_weight', label: 'Camera Khu Tạ' }
  ],
  loc_q1: [
    { id: 'cam_all', label: 'Tất cả camera' },
    { id: 'cam_front_q1', label: 'Camera Cửa chính' },
    { id: 'cam_weight_q1', label: 'Camera Khu Tạ' }
  ],
  loc_q7: [
    { id: 'cam_all', label: 'Tất cả camera' },
    { id: 'cam_front_q7', label: 'Camera Cửa chính' },
    { id: 'cam_weight_q7', label: 'Camera Khu Tạ' }
  ]
};

const datePresetOptions = [
  { id: 'today', label: 'Hôm nay', offsetDays: 0 },
  { id: 'yesterday', label: 'Hôm qua', offsetDays: 1 },
  { id: 'last7', label: '7 ngày qua', offsetDays: 6 },
  { id: 'last30', label: '30 ngày qua', offsetDays: 29 }
];

const getDateByOffset = (offsetDays) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  now.setDate(now.getDate() - offsetDays);
  return now.toISOString().split('T')[0];
};

const getPresetFromDate = (dateValue) => {
  for (const option of datePresetOptions) {
    if (getDateByOffset(option.offsetDays) === dateValue) {
      return option.id;
    }
  }
  return 'today';
};

export const GlobalFilter = () => {
  const dispatch = useDispatch();
  const { locationId, date } = useSelector(state => state.filter);
  const selectedPreset = getPresetFromDate(date);

  const handleLocationChange = (event) => {
    const nextLocation = event.target.value;
    dispatch(setLocation(nextLocation));

    const firstCamera = (camerasByLocation[nextLocation] || camerasByLocation.loc_all)[0]?.id || 'cam_all';
    dispatch(setCamera(firstCamera));
  };

  const handleDatePresetChange = (event) => {
    const preset = datePresetOptions.find(option => option.id === event.target.value) || datePresetOptions[0];
    dispatch(setDate(getDateByOffset(preset.offsetDays)));
  };

  return (
    <section className="sticky top-20 z-40">
      <div className="rounded-2xl border border-slate-200 bg-slate-100/95 p-4 shadow-sm backdrop-blur-sm">
        <div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <label className="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-800">
              <Store size={18} className="text-violet-500" />
              Cửa hàng
            </label>
            <select
              value={locationId}
              onChange={handleLocationChange}
              className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-base font-medium text-slate-700 outline-none transition focus:border-slate-400"
            >
              {locations.map(location => (
                <option key={location.id} value={location.id}>{location.label}</option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-4">
            <label className="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-800">
              <CalendarDays size={18} className="text-blue-500" />
              Khoảng thời gian
            </label>
            <select
              value={selectedPreset}
              onChange={handleDatePresetChange}
              className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-base font-medium text-slate-700 outline-none transition focus:border-slate-400"
            >
              {datePresetOptions.map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-100 px-4 text-sm font-semibold text-violet-700 transition hover:bg-violet-200"
              >
                <Database size={17} />
                Đồng bộ
              </button>
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-orange-100 px-4 text-sm font-semibold text-orange-700 transition hover:bg-orange-200"
              >
                <Upload size={17} />
                Import POS
              </button>
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-100 px-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200"
              >
                <Download size={17} />
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
