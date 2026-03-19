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
    <section className="mt-4 mb-4">
      <div className="rounded-full border border-slate-200 bg-white/90 px-6 py-2 shadow-lg shadow-slate-100/50 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3 lg:gap-6">
          <div className="flex items-center gap-2 shrink-0">
            <Store size={16} className="text-teal-400" />
            <span className="text-sm font-medium text-slate-700">Cửa hàng</span>
            <select
              value={locationId}
              onChange={handleLocationChange}
              className="h-10 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-teal-500"
            >
              {locations.map(location => (
                <option key={location.id} value={location.id}>{location.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <CalendarDays size={16} className="text-blue-400" />
            <span className="text-sm font-medium text-slate-700">Khoảng thời gian</span>
            <select
              value={selectedPreset}
              onChange={handleDatePresetChange}
              className="h-10 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-teal-500"
            >
              {datePresetOptions.map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <Database size={15} />
              Đồng bộ
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <Upload size={15} />
              Import POS
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 text-xs font-semibold text-teal-700 transition hover:bg-teal-100"
            >
              <Download size={15} />
              Xuất báo cáo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
