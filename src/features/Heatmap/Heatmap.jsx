import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loadHeatmapByRange, loadHeatmapData } from '../../redux/slices/heatmapSlice';
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
        <stop offset='0%' stop-color='#0f172a'/>
        <stop offset='100%' stop-color='#1e293b'/>
      </linearGradient>
      <pattern id='grid' width='36' height='36' patternUnits='userSpaceOnUse'>
        <path d='M 36 0 L 0 0 0 36' fill='none' stroke='rgba(148,163,184,0.2)' stroke-width='1'/>
      </pattern>
    </defs>
    <rect width='1280' height='720' fill='url(#g1)'/>
    <rect width='1280' height='720' fill='url(#grid)'/>
    <rect x='40' y='40' width='1200' height='640' rx='20' fill='none' stroke='rgba(59,130,246,0.35)' stroke-width='3'/>
    <text x='640' y='340' font-family='DM Sans, sans-serif' font-size='42' font-weight='700' fill='#e2e8f0' text-anchor='middle'>Ảnh chụp camera cửa hàng</text>
    <text x='640' y='382' font-family='DM Sans, sans-serif' font-size='20' fill='#94a3b8' text-anchor='middle'>Lớp tham chiếu để vẽ bản đồ nhiệt</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
const fallbackSnapshot = createFallbackSnapshot();

/**
 * Heatmap page - displays 2D density visualization
 */
export const Heatmap = () => {
  const dispatch = useAppDispatch();
  const { cameraId, date } = useAppSelector(state => state.filter);
  const {
    data,
    loading,
    error
  } = useAppSelector(state => state.heatmap);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [radius, setRadius] = useState(70);
  const [opacity, setOpacity] = useState(0.72);
  const [timelinePercent, setTimelinePercent] = useState(100);
  const [fromTime, setFromTime] = useState(() => {
    const date = new Date(Date.now() - 60 * 60 * 1000);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });
  const [toTime, setToTime] = useState(() => {
    const date = new Date();
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });
  const [activeRoiId, setActiveRoiId] = useState(null);
  const [enabledRois, setEnabledRois] = useState(() => rois.reduce((acc, zone) => {
    acc[zone.id] = true;
    return acc;
  }, {}));
  const effectiveCameraId = cameraId === 'cam_all' ? 'cam-001' : cameraId;

  useEffect(() => {
    dispatch(loadHeatmapData(effectiveCameraId));
  }, [dispatch, effectiveCameraId, date]);
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
      const value = Math.max(0.05, Math.min(point.intensity || 0.5, 1));
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
  }, [data, opacity, radius, timelinePercent]);
  useEffect(() => {
    drawHeatLayer();
    const onResize = () => drawHeatLayer();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [drawHeatLayer]);
  const activeRoi = useMemo(() => rois.find(zone => zone.id === activeRoiId) || null, [activeRoiId]);
  const scrubbedTimestamp = useMemo(() => {
    const from = new Date(fromTime).getTime();
    const to = new Date(toTime).getTime();
    if (Number.isNaN(from) || Number.isNaN(to) || to <= from) {
      return 'Khoảng thời gian không hợp lệ';
    }
    const pointInTime = from + (to - from) * timelinePercent / 100;
    return new Date(pointInTime).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  }, [fromTime, toTime, timelinePercent]);
  const handleApplyRange = () => {
    dispatch(loadHeatmapByRange({
      cameraId: effectiveCameraId,
      startDate: new Date(fromTime).toISOString(),
      endDate: new Date(toTime).toISOString()
    }));
  };
  if (loading) {
    return <div className="min-h-[72vh] flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-full px-5 py-3 bg-slate-900 text-white">
          <span className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
          <p className="text-sm">Đang tải dữ liệu bản đồ nhiệt...</p>
        </div>
      </div>;
  }
  if (error) {
    return <div className="min-h-[72vh] flex items-center justify-center">
        <p className="text-rose-600 text-lg">Lỗi: {error}</p>
      </div>;
  }
  return <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white min-h-[78vh] flex flex-col lg:flex-row shadow-sm">
      <aside className="lg:w-1/4 bg-white border-r border-slate-200 p-5 space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Chẩn đoán bản đồ nhiệt</h1>
          <p className="text-slate-500 text-sm mt-1">Phân tích khu vực nóng lạnh từ ảnh camera.</p>
        </div>

        <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
          <p className="text-xs uppercase tracking-wide text-blue-600">Camera từ bộ lọc toàn cục</p>
          <p className="text-sm font-medium text-blue-900 mt-1">{effectiveCameraId}</p>
        </div>

        <div className="space-y-3">
          <label className="block text-xs uppercase tracking-wide text-slate-500">Từ</label>
          <input type="datetime-local" value={fromTime} onChange={e => setFromTime(e.target.value)} className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-slate-900 text-sm" />
          <label className="block text-xs uppercase tracking-wide text-slate-500">Đến</label>
          <input type="datetime-local" value={toTime} onChange={e => setToTime(e.target.value)} className="w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-slate-900 text-sm" />
          <button onClick={handleApplyRange} className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2">
            Áp dụng khoảng thời gian
          </button>
        </div>

        <div className="space-y-3">
          <label className="block text-xs uppercase tracking-wide text-slate-500">Bán kính điểm nhiệt</label>
          <input type="range" min={24} max={120} value={radius} onChange={e => setRadius(Number(e.target.value))} className="w-full" />
          <p className="text-xs text-slate-500">Độ lan tỏa {radius}px</p>
        </div>

        <div className="space-y-3">
          <label className="block text-xs uppercase tracking-wide text-slate-500">Độ trong suốt bản đồ nhiệt</label>
          <input type="range" min={20} max={100} value={Math.round(opacity * 100)} onChange={e => setOpacity(Number(e.target.value) / 100)} className="w-full" />
          <p className="text-xs text-slate-500">{Math.round(opacity * 100)}%</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">Lớp phủ ROI</p>
          {rois.map(zone => <label key={zone.id} className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={enabledRois[zone.id]} onChange={e => setEnabledRois(prev => ({
            ...prev,
            [zone.id]: e.target.checked
          }))} />
              {zone.label}
            </label>)}
        </div>
      </aside>

      <section className="lg:w-3/4 p-5 flex flex-col">
        <div className="relative rounded-xl overflow-hidden shadow-md border border-slate-200 flex-1 min-h-[420px] bg-slate-100" ref={containerRef}>
          <img src={fallbackSnapshot} alt="Ảnh chụp cửa hàng" className="absolute inset-0 w-full h-full object-cover" onLoad={drawHeatLayer} />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {rois.filter(zone => enabledRois[zone.id]).map(zone => {
            const points = zone.points.map(point => `${point.x * 100},${point.y * 100}`).join(' ');
            const isActive = activeRoiId === zone.id;
            return <polygon key={zone.id} points={points} fill={isActive ? 'rgba(59,130,246,0.24)' : 'rgba(59,130,246,0.12)'} stroke={isActive ? '#2563eb' : '#0ea5e9'} strokeWidth={isActive ? 0.8 : 0.45} onMouseEnter={() => setActiveRoiId(zone.id)} onMouseLeave={() => setActiveRoiId(null)} className="cursor-pointer transition-all duration-150" />;
          })}
          </svg>

          {activeRoi && <div className="absolute left-4 top-4 rounded-lg border border-sky-300 bg-white/95 px-3 py-2 text-xs text-slate-800 shadow-lg">
              <p className="font-semibold text-sky-700">{activeRoi.label}</p>
              <p>Số người: {activeRoi.peopleCount}</p>
              <p>Thời gian dừng TB: {activeRoi.avgDwell} phút</p>
            </div>}
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-slate-600 text-sm">
              Điểm được vẽ: <span className="text-slate-900 font-semibold">{Math.max(1, Math.floor((data?.data_points.length || 1) * (timelinePercent / 100)))}</span>
            </p>
            <p className="text-slate-600 text-sm">
              Mốc thời gian: <span className="text-slate-900 font-semibold">{scrubbedTimestamp}</span>
            </p>
          </div>

          <div className="mt-3">
            <input type="range" min={0} max={100} step={1} value={timelinePercent} onChange={e => setTimelinePercent(Number(e.target.value))} className="w-full accent-blue-600" />
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
    </div>;
};
