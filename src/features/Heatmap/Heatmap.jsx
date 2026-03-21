import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loadHeatmapData } from '../../redux/slices/heatmapSlice';
import gymImage from '../../assets/thiet-ke-phong-gym-21.jpg';
const rois = [{
  id: 'roi-cardio',
  label: 'Cardio',
  points: [{
    x: 0.08,
    y: 0.12
  }, {
    x: 0.38,
    y: 0.1
  }, {
    x: 0.36,
    y: 0.35
  }, {
    x: 0.1,
    y: 0.32
  }],
  peopleCount: 27,
  avgDwell: 11.5
}, {
  id: 'roi-weights',
  label: 'Tạ',
  points: [{
    x: 0.44,
    y: 0.2
  }, {
    x: 0.76,
    y: 0.2
  }, {
    x: 0.78,
    y: 0.5
  }, {
    x: 0.46,
    y: 0.52
  }],
  peopleCount: 41,
  avgDwell: 15.2
}, {
  id: 'roi-locker',
  label: 'Tủ đồ',
  points: [{
    x: 0.12,
    y: 0.58
  }, {
    x: 0.34,
    y: 0.6
  }, {
    x: 0.32,
    y: 0.9
  }, {
    x: 0.1,
    y: 0.88
  }],
  peopleCount: 18,
  avgDwell: 6.4
}];
const createFallbackSnapshot = () => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1280' height='720' viewBox='0 0 1280 720'>
    <defs>
      <linearGradient id='g1' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#f8fafc'/>
        <stop offset='100%' stop-color='#e2e8f0'/>
      </linearGradient>
      <pattern id='grid' width='36' height='36' patternUnits='userSpaceOnUse'>
        <path d='M 36 0 L 0 0 0 36' fill='none' stroke='rgba(148,163,184,0.35)' stroke-width='1'/>
      </pattern>
    </defs>
    <rect width='1280' height='720' fill='url(#g1)'/>
    <rect width='1280' height='720' fill='url(#grid)'/>
    <rect x='40' y='40' width='1200' height='640' rx='20' fill='none' stroke='rgba(59,130,246,0.25)' stroke-width='3'/>
    <text x='640' y='340' font-family='DM Sans, sans-serif' font-size='42' font-weight='700' fill='#0f172a' text-anchor='middle'>Ảnh chụp camera cửa hàng</text>
    <text x='640' y='382' font-family='DM Sans, sans-serif' font-size='20' fill='#475569' text-anchor='middle'>Lớp tham chiếu để vẽ bản đồ nhiệt</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
const fallbackSnapshot = createFallbackSnapshot();
const radiusOptions = [{
  value: 50,
  label: 'Nhỏ'
}, {
  value: 70,
  label: 'Vừa'
}, {
  value: 90,
  label: 'Rộng'
}, {
  value: 110,
  label: 'Rất rộng'
}];
const opacityOptions = [{
  value: 0.5,
  label: 'Nhẹ'
}, {
  value: 0.65,
  label: 'Vừa'
}, {
  value: 0.8,
  label: 'Rõ'
}, {
  value: 0.95,
  label: 'Nổi bật'
}];
const intensityOptions = [{
  value: 0.6,
  label: 'Êm'
}, {
  value: 0.8,
  label: 'Vừa'
}, {
  value: 1,
  label: 'Chuẩn'
}, {
  value: 1.2,
  label: 'Mạnh'
}, {
  value: 1.5,
  label: 'Rất mạnh'
}];

/**
 * Heatmap page - displays 2D density visualization
 */
export const Heatmap = () => {
  const dispatch = useAppDispatch();
  const {
    data,
    loading,
    error
  } = useAppSelector(state => state.heatmap);

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedCameraId, setSelectedCameraId] = useState('cam-001');
  const [radius, setRadius] = useState(70);
  const [opacity, setOpacity] = useState(0.72);
  const [intensityMultiplier, setIntensityMultiplier] = useState(1);
  const [timelinePercent, setTimelinePercent] = useState(100);
  const [activeRoiId, setActiveRoiId] = useState(null);

  const cameraOptions = [{
    id: 'cam-001',
    label: 'Camera Cua chinh'
  }, {
    id: 'cam-002',
    label: 'Camera Khu ta'
  }, {
    id: 'cam-003',
    label: 'Camera Cardio'
  }];

  useEffect(() => {
    dispatch(loadHeatmapData(selectedCameraId));
  }, [dispatch, selectedCameraId]);

  const drawHeatLayer = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) {
      return;
    }
    const width = container.clientWidth;
    const height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, width, height);
    if (!data || !data.data_points.length) {
      return;
    }
    const safeOpacity = Math.max(0.1, Math.min(opacity, 1));
    const visiblePointCount = Math.max(1, Math.floor(data.data_points.length * (timelinePercent / 100)));
    const renderedPoints = data.data_points.slice(0, visiblePointCount);
    renderedPoints.forEach(point => {
      const normalizedX = point.x <= 1 ? point.x : point.x / 1920;
      const normalizedY = point.y <= 1 ? point.y : point.y / 1080;
      const px = normalizedX * width;
      const py = normalizedY * height;
      const value = Math.max(0.05, Math.min((point.intensity || 0.5) * intensityMultiplier, 1));
      const pointRadius = Math.max(24, radius * value);
      const gradient = ctx.createRadialGradient(px, py, 0, px, py, pointRadius);
      gradient.addColorStop(0, `rgba(239, 68, 68, ${0.42 * safeOpacity * value})`);
      gradient.addColorStop(0.4, `rgba(234, 179, 8, ${0.34 * safeOpacity * value})`);
      gradient.addColorStop(0.7, `rgba(34, 197, 94, ${0.24 * safeOpacity * value})`);
      gradient.addColorStop(1, 'rgba(30, 64, 175, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(px, py, pointRadius, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, [data, intensityMultiplier, opacity, radius, timelinePercent]);

  useEffect(() => {
    drawHeatLayer();
    const onResize = () => drawHeatLayer();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [drawHeatLayer]);

  const activeRoi = useMemo(() => rois.find(zone => zone.id === activeRoiId) || null, [activeRoiId]);
  const scrubbedTimestamp = useMemo(() => {
    const now = Date.now();
    const from = now - 60 * 60 * 1000;
    const pointInTime = from + (now - from) * (timelinePercent / 100);
    return new Date(pointInTime).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  }, [timelinePercent]);

  if (loading) {
    return <div className="min-h-[72vh] flex items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 rounded-full px-5 py-3 bg-slate-50 text-slate-800 border border-slate-200">
          <span className="w-3 h-3 rounded-full bg-teal-400 animate-pulse" />
          <p className="text-sm">Đang tải dữ liệu bản đồ nhiệt...</p>
        </div>
      </div>;
  }

  if (error) {
    return <div className="min-h-[72vh] flex items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-rose-400 text-lg">Lỗi: {error}</p>
      </div>;
  }

  return <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white min-h-[78vh] shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-3">
        <div className="flex items-center gap-3">
          <p className="text-xs uppercase tracking-wide text-slate-600">Camera</p>
          <select value={selectedCameraId} onChange={e => setSelectedCameraId(e.target.value)} className="w-full max-w-xs rounded-lg bg-white border border-slate-200 px-3 py-2 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500/40">
            {cameraOptions.map(option => <option key={option.id} value={option.id}>
                {option.label}
              </option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[72vh]">
        <aside className="lg:w-[320px] bg-slate-50/90 backdrop-blur-md border-r border-slate-200 p-5 space-y-5">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-sm font-semibold text-slate-900">Tùy chỉnh hiển thị</p>
          <p className="mt-1 text-xs text-slate-500">Chọn mức để xem bản đồ rõ hơn. Không cần kiến thức kỹ thuật.</p>
        </div>

        <div className="space-y-3">
          <label className="block text-xs uppercase tracking-wide text-slate-600">Phạm vi hiển thị</label>
          <div className="grid grid-cols-2 gap-2">
            {radiusOptions.map(option => <button key={option.value} type="button" onClick={() => setRadius(option.value)} className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${radius === option.value ? 'border-teal-500 bg-teal-500 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'}`}>
                {option.label}
              </button>)}
          </div>
          <p className="text-xs text-slate-600">Mức đang chọn: <span className="font-semibold">{radiusOptions.find(item => item.value === radius)?.label}</span></p>
        </div>

        <div className="space-y-3">
          <label className="block text-xs uppercase tracking-wide text-slate-600">Độ đậm màu nhiệt</label>
          <div className="grid grid-cols-2 gap-2">
            {opacityOptions.map(option => <button key={option.value} type="button" onClick={() => setOpacity(option.value)} className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${Math.abs(opacity - option.value) < 0.001 ? 'border-teal-500 bg-teal-500 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'}`}>
                {option.label}
              </button>)}
          </div>
          <p className="text-xs text-slate-600">Mức đang chọn: <span className="font-semibold">{opacityOptions.find(item => Math.abs(item.value - opacity) < 0.001)?.label}</span></p>
        </div>

        <div className="space-y-3">
          <label className="block text-xs uppercase tracking-wide text-slate-600">Mức nhạy hiển thị</label>
          <div className="grid grid-cols-3 gap-2">
            {intensityOptions.map(option => <button key={option.value} type="button" onClick={() => setIntensityMultiplier(option.value)} className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${Math.abs(intensityMultiplier - option.value) < 0.001 ? 'border-teal-500 bg-teal-500 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'}`}>
                {option.label}
              </button>)}
          </div>
          <p className="text-xs text-slate-600">Mức đang chọn: <span className="font-semibold">{intensityOptions.find(item => Math.abs(item.value - intensityMultiplier) < 0.001)?.label}</span></p>
        </div>
        </aside>

        <section className="lg:w-3/4 p-5 flex flex-col">
        <div className="relative rounded-xl overflow-hidden shadow-sm border border-slate-200 flex-1 min-h-[420px] bg-slate-100" ref={containerRef}>
          <img src={gymImage} alt="Sơ đồ phòng gym" className="absolute inset-0 w-full h-full object-cover" />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {rois.map(zone => {
            const points = zone.points.map(point => `${point.x * 100},${point.y * 100}`).join(' ');
            const isActive = activeRoiId === zone.id;
            return <polygon key={zone.id} points={points} fill={isActive ? 'rgba(45,212,191,0.24)' : 'rgba(14,165,233,0.1)'} stroke={isActive ? '#14b8a6' : '#0ea5e9'} strokeWidth={isActive ? 0.8 : 0.45} onMouseEnter={() => setActiveRoiId(zone.id)} onMouseLeave={() => setActiveRoiId(null)} className="cursor-default transition-all duration-150" />;
          })}
          </svg>

            {activeRoi && <div className="absolute left-4 top-4 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs text-slate-700 shadow-sm backdrop-blur-md">
              <p className="font-semibold text-teal-700">{activeRoi.label}</p>
              <p>Số người: {activeRoi.peopleCount}</p>
              <p>Thời gian dừng TB: {activeRoi.avgDwell} phút</p>
            </div>}
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-slate-600 text-sm">
              Camera đang xem: <span className="text-slate-900 font-semibold">{selectedCameraId}</span>
            </p>
            <p className="text-slate-600 text-sm">Số ROI: <span className="text-slate-900 font-semibold">{rois.length}</span></p>
            <p className="text-slate-600 text-sm">
              Mốc thời gian: <span className="text-slate-900 font-semibold">{scrubbedTimestamp}</span>
            </p>
          </div>

          <div className="mt-3">
            <input type="range" min={0} max={100} step={1} value={timelinePercent} onChange={e => setTimelinePercent(Number(e.target.value))} className="w-full accent-teal-500" />
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Quá khứ</span>
              <span>-45m</span>
              <span>-30m</span>
              <span>-15m</span>
              <span>Hiện tại</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-slate-600 text-sm">
              Điểm được vẽ: <span className="text-slate-900 font-semibold">{Math.max(1, Math.floor((data?.data_points.length || 1) * (timelinePercent / 100)))}</span>
            </p>
            <p className="text-slate-600 text-sm">
              Tổng số điểm: <span className="text-slate-900 font-semibold">{data?.data_points.length || 0}</span>
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">Lạnh</span>
              <div className="w-56 h-2 rounded-full" style={{
              background: 'linear-gradient(90deg, #2563EB 0%, #22C55E 35%, #FACC15 65%, #DC2626 100%)'
            }} />
              <span className="text-xs text-slate-500">Nóng</span>
            </div>
          </div>
        </div>
        </section>
      </div>
    </div>;
};