import { useMemo, useRef, useState } from 'react';
import { AlertTriangle, Camera, CheckCircle2, Eye, EyeOff, HelpCircle, ImageUp, Layers, Lock, LockOpen, MousePointer2, PencilLine, Plus, Save, Trash2, Upload, X } from 'lucide-react';
const STORAGE_KEY = 'storelens.zone.manager.configs.by.camera';
const IMAGE_STORAGE_KEY = 'storelens.zone.manager.images.by.camera';
const cameras = [{
  id: 'cam-01',
  name: 'Camera 01'
}, {
  id: 'cam-02',
  name: 'Camera 02'
}, {
  id: 'cam-03',
  name: 'Camera 03'
}, {
  id: 'cam-04',
  name: 'Camera 04'
}];
const cameraImage = "data:image/svg+xml;utf8," + encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='1280' height='720' viewBox='0 0 1280 720'>
    <defs>
      <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#f8fafc' />
        <stop offset='100%' stop-color='#e2e8f0' />
      </linearGradient>
      <pattern id='grid' width='30' height='30' patternUnits='userSpaceOnUse'>
        <path d='M 30 0 L 0 0 0 30' fill='none' stroke='rgba(148,163,184,0.35)' stroke-width='1' />
      </pattern>
    </defs>
    <rect width='1280' height='720' fill='url(#bg)' />
    <rect width='1280' height='720' fill='url(#grid)' />
    <rect x='52' y='42' width='1170' height='640' rx='18' fill='none' stroke='rgba(148,163,184,0.45)' stroke-width='3' />
    <text x='640' y='338' font-family='DM Sans, sans-serif' font-size='44' font-weight='700' fill='#0f172a' text-anchor='middle'>Anh chup camera</text>
    <text x='640' y='380' font-family='DM Sans, sans-serif' font-size='20' fill='#475569' text-anchor='middle'>Ve va quan ly vung ROI cho AI theo doi</text>
  </svg>
`);
const defaultZoneName = count => `Zone_${count + 1}`;
const colorSwatches = ['#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#10B981', '#F59E0B', '#06B6D4', '#84CC16'];
const zoneTypeLabels = {
  shelf: 'Khu vực kệ',
  aisle: 'Khu vực đi lại',
  entrance: 'Lối vào',
  checkout: 'Khu vực thanh toán'
};
const toolButtonClass = active => `inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition-all duration-150 ${active ? 'bg-blue-600 text-white border-blue-500 scale-[1.01]' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:scale-[1.01]'}`;
const toCanvasPoint = (evt, rect) => {
  const x = (evt.clientX - rect.left) / rect.width;
  const y = (evt.clientY - rect.top) / rect.height;
  return {
    x: Math.max(0, Math.min(1, x)),
    y: Math.max(0, Math.min(1, y))
  };
};
const nearPoint = (a, b, threshold = 0.018) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy) <= threshold;
};
export const ZoneManager = () => {
  const overlayRef = useRef(null);
  const imageInputRef = useRef(null);
  const [selectedCameraId, setSelectedCameraId] = useState(cameras[0].id);
  const [mode, setMode] = useState('draw');
  const [zonesByCamera, setZonesByCamera] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  });
  const [cameraImages, setCameraImages] = useState(() => {
    const raw = localStorage.getItem(IMAGE_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  });
  const [zoneName, setZoneName] = useState('');
  const [zoneType, setZoneType] = useState('checkout');
  const [draftColor, setDraftColor] = useState('#EF4444');
  const [activeZoneId, setActiveZoneId] = useState(null);
  const [draftPoints, setDraftPoints] = useState([]);
  const [cursorPoint, setCursorPoint] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [showGuideModal, setShowGuideModal] = useState(true);
  const zones = useMemo(() => zonesByCamera[selectedCameraId] || [], [selectedCameraId, zonesByCamera]);
  const selectedCamera = useMemo(() => cameras.find(camera => camera.id === selectedCameraId) || cameras[0], [selectedCameraId]);
  const hasImage = Boolean(cameraImages[selectedCameraId]);
  const visibleZones = useMemo(() => zones.filter(zone => zone.visible), [zones]);
  const setZonesForCamera = updater => {
    setZonesByCamera(prev => ({
      ...prev,
      [selectedCameraId]: updater(prev[selectedCameraId] || [])
    }));
  };
  const completeDraftPolygon = () => {
    if (draftPoints.length < 3) {
      return;
    }
    const finalName = zoneName.trim() || defaultZoneName(zones.length);
    const newZone = {
      _id: `${Date.now()}`,
      name: finalName,
      type: zoneType,
      color: draftColor,
      points: draftPoints,
      visible: true,
      locked: false
    };
    setZonesForCamera(prev => [...prev, newZone]);
    setActiveZoneId(newZone._id);
    setDraftPoints([]);
    setCursorPoint(null);
    setZoneName('');
  };
  const handleCanvasClick = evt => {
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    if (mode !== 'draw') {
      return;
    }
    const point = toCanvasPoint(evt, rect);
    if (draftPoints.length > 2 && nearPoint(point, draftPoints[0])) {
      completeDraftPolygon();
      return;
    }
    setDraftPoints(prev => [...prev, point]);
  };
  const handleCanvasDoubleClick = () => {
    if (mode === 'draw') {
      completeDraftPolygon();
    }
  };
  const handleMouseMove = evt => {
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    const point = toCanvasPoint(evt, rect);
    setCursorPoint(point);
    if (mode === 'select' && dragging) {
      setZonesForCamera(prev => prev.map(zone => {
        if (zone._id !== dragging.zoneId) {
          return zone;
        }
        if (zone.locked) {
          return zone;
        }
        const nextPoints = zone.points.map((p, i) => i === dragging.pointIndex ? point : p);
        return {
          ...zone,
          points: nextPoints
        };
      }));
    }
  };
  const handleVertexDown = (zoneId, pointIndex) => {
    if (mode !== 'select') {
      return;
    }
    const zone = zones.find(item => item._id === zoneId);
    if (zone?.locked) {
      return;
    }
    setDragging({
      zoneId,
      pointIndex
    });
  };
  const handlePointerUp = () => {
    setDragging(null);
  };
  const removeZone = zoneId => {
    setZonesForCamera(prev => prev.filter(zone => zone._id !== zoneId));
    if (activeZoneId === zoneId) {
      setActiveZoneId(null);
    }
  };
  const handlePolygonClick = (evt, zoneId) => {
    evt.stopPropagation();
    const zone = zones.find(item => item._id === zoneId);
    if (!zone) {
      return;
    }
    if (mode === 'delete') {
      removeZone(zoneId);
      return;
    }
    if (zone.locked && mode === 'select') {
      setActiveZoneId(zoneId);
      return;
    }
    setActiveZoneId(zoneId);
  };
  const handleDeleteVertex = (zoneId, pointIndex) => {
    if (mode !== 'delete') {
      return;
    }
    setZonesForCamera(prev => prev.map(zone => {
      if (zone._id !== zoneId) {
        return zone;
      }
      if (zone.locked) {
        return zone;
      }
      const nextPoints = zone.points.filter((_, idx) => idx !== pointIndex);
      return {
        ...zone,
        points: nextPoints
      };
    }).filter(zone => zone.points.length >= 3));
  };
  const saveAll = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(zonesByCamera));
    localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(cameraImages));
  };
  const onUploadImage = event => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setCameraImages(prev => ({
          ...prev,
          [selectedCameraId]: result
        }));
      }
    };
    reader.readAsDataURL(file);
  };
  const toggleVisible = zoneId => {
    setZonesForCamera(prev => prev.map(zone => zone._id === zoneId ? {
      ...zone,
      visible: !zone.visible
    } : zone));
  };
  const toggleLock = zoneId => {
    setZonesForCamera(prev => prev.map(zone => zone._id === zoneId ? {
      ...zone,
      locked: !zone.locked
    } : zone));
  };
  const createZoneFromDraft = () => {
    completeDraftPolygon();
  };
  return <div className="w-full min-h-[80vh] rounded-xl border border-slate-200 bg-slate-100 p-4">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 min-h-[72vh]">
        <aside className="xl:col-span-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-slate-800">Danh sách camera</h2>
            <button className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-violet-600 text-white text-sm hover:bg-violet-700 transition-all duration-150">
              <Plus size={15} /> Thêm
            </button>
          </div>

          <div className="space-y-3">
            {cameras.map(camera => {
            const zoneCount = zonesByCamera[camera.id]?.length || 0;
            const imageReady = Boolean(cameraImages[camera.id]);
            return <button key={camera.id} onClick={() => {
              setSelectedCameraId(camera.id);
              setDraftPoints([]);
              setActiveZoneId(null);
            }} className={`w-full rounded-xl border p-4 text-left transition-all duration-150 ${selectedCameraId === camera.id ? 'border-violet-300 bg-violet-50/50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
                      <Camera size={18} />
                    </div>
                    <p className="text-xl font-semibold text-slate-800">{camera.name}</p>
                  </div>
                  <div className="mt-3 border-t border-slate-200 pt-3 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700">
                      {imageReady ? 'Đã setup hình nền' : 'Chưa setup hình nền'}
                    </span>
                    <span className="text-sm text-slate-500 font-semibold">{zoneCount} zones</span>
                  </div>
                </button>;
          })}
          </div>
        </aside>

        <section className="xl:col-span-9 rounded-xl border border-slate-200 bg-white p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-1 h-9 rounded-full bg-violet-600" />
              <h1 className="text-2xl font-semibold text-slate-800">{selectedCamera.name}</h1>
              <button onClick={() => setShowGuideModal(true)} className="text-slate-400 hover:text-violet-600 transition-colors" aria-label="Mở hướng dẫn vẽ">
                <HelpCircle size={21} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => imageInputRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all duration-150">
                <Upload size={16} /> {hasImage ? 'Đổi ảnh' : 'Tải ảnh lên'}
              </button>
              <button onClick={saveAll} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-all duration-150">
                <Save size={16} /> Cập nhật
              </button>
            </div>
          </div>

          <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={onUploadImage} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-9 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-200 text-slate-800 text-sm px-3 py-1">
                <PencilLine size={14} /> Click 4 điểm để tạo vùng mới
              </div>

              <div className={`relative rounded-lg overflow-hidden border-2 border-slate-300 ${mode === 'draw' ? 'cursor-crosshair' : 'cursor-default'}`}>
                {hasImage ? <img src={cameraImages[selectedCameraId] || cameraImage} alt="Ảnh camera" className="w-full h-auto max-h-[560px] object-contain bg-slate-100" draggable={false} /> : <div className="h-[520px] flex flex-col items-center justify-center text-center bg-slate-100">
                    <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 mb-4">
                      <ImageUp size={40} />
                    </div>
                    <p className="text-xl font-semibold text-slate-600">Chưa có hình camera</p>
                    <p className="text-base text-slate-400 mt-2">Vui lòng tải ảnh Snapshot (16:9)</p>
                    <button onClick={() => setShowGuideModal(true)} className="mt-4 text-blue-600 hover:text-blue-700 text-base font-medium transition-colors">
                      Xem hướng dẫn
                    </button>
                  </div>}

                {hasImage && <svg ref={overlayRef} className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" onClick={handleCanvasClick} onDoubleClick={handleCanvasDoubleClick} onMouseMove={handleMouseMove} onMouseUp={handlePointerUp} onMouseLeave={handlePointerUp}>
                    {visibleZones.map(zone => {
                  const polygonPoints = zone.points.map(p => `${p.x * 100},${p.y * 100}`).join(' ');
                  const isActive = activeZoneId === zone._id;
                  return <g key={zone._id}>
                          <polygon points={polygonPoints} fill={`${zone.color}4D`} stroke={zone.color} strokeWidth={isActive ? 0.8 : 0.56} strokeDasharray={isActive ? '5,5' : undefined} onClick={evt => handlePolygonClick(evt, zone._id)} />

                          {(isActive || mode === 'select' || mode === 'delete') && zone.points.map((point, idx) => <circle key={`${zone._id}-${idx}`} cx={point.x * 100} cy={point.y * 100} r={0.65} fill="white" stroke="#4f46e5" strokeWidth={0.24} onMouseDown={evt => {
                      evt.stopPropagation();
                      handleVertexDown(zone._id, idx);
                    }} onClick={evt => {
                      evt.stopPropagation();
                      handleDeleteVertex(zone._id, idx);
                    }} />)}

                          {isActive && zone.points[0] && <text x={zone.points[0].x * 100 + 1.2} y={zone.points[0].y * 100 - 1} fill="white" fontSize="2.2" fontWeight={700} style={{
                      pointerEvents: 'none'
                    }}>
                              {zone.name}
                            </text>}
                        </g>;
                })}

                    {draftPoints.length > 0 && <>
                        <polyline points={draftPoints.map(p => `${p.x * 100},${p.y * 100}`).join(' ')} fill="none" stroke={draftColor} strokeWidth={0.7} />

                        {cursorPoint && <line x1={draftPoints[draftPoints.length - 1].x * 100} y1={draftPoints[draftPoints.length - 1].y * 100} x2={cursorPoint.x * 100} y2={cursorPoint.y * 100} stroke="#2563EB" strokeWidth={0.6} strokeDasharray="1.7 1" />}

                        {draftPoints.map((point, idx) => <circle key={`draft-${idx}`} cx={point.x * 100} cy={point.y * 100} r={0.65} fill="white" stroke="#4f46e5" strokeWidth={0.24} />)}
                      </>}
                  </svg>}

                <div className="absolute top-3 right-3 z-30 flex items-center gap-2 rounded-md bg-white/90 backdrop-blur px-2 py-2 border border-slate-200">
                  <button className={toolButtonClass(mode === 'select')} onClick={() => setMode('select')}>
                    <MousePointer2 size={14} /> Chọn
                  </button>
                  <button className={toolButtonClass(mode === 'draw')} onClick={() => setMode('draw')}>
                    <PencilLine size={14} /> Vẽ
                  </button>
                  <button className={toolButtonClass(mode === 'delete')} onClick={() => setMode('delete')}>
                    <Trash2 size={14} /> Xóa
                  </button>
                </div>
              </div>

              <div className="mt-2 text-sm text-slate-500 flex items-center justify-between">
                <span>Res: 800 x 457 px</span>
                <span>Scale: 0.89x</span>
              </div>
            </div>

            <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-slate-800">Zones ({zones.length})</h3>
              </div>

              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {zones.length === 0 && <div className="h-[420px] flex flex-col items-center justify-center text-slate-400 text-center">
                    <Layers size={30} />
                    <p className="mt-3 text-lg">Chưa có zone</p>
                  </div>}

                {zones.map(zone => <div key={zone._id} className={`rounded-xl border p-3 bg-white ${zone._id === activeZoneId ? 'border-violet-300' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <button onClick={() => setActiveZoneId(zone._id)} className="inline-flex items-center gap-2 text-left text-lg font-semibold text-slate-800">
                        <span className="w-4 h-4 rounded" style={{
                      backgroundColor: zone.color
                    }} />
                        {zone.name}
                      </button>
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleVisible(zone._id)} className="p-1 rounded hover:bg-slate-100 text-slate-500" aria-label="Bật tắt hiển thị zone">
                          {zone.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                        <button onClick={() => toggleLock(zone._id)} className="p-1 rounded hover:bg-slate-100 text-slate-500" aria-label="Bật tắt khóa zone">
                          {zone.locked ? <Lock size={15} /> : <LockOpen size={15} />}
                        </button>
                        <button onClick={() => removeZone(zone._id)} className="p-1 rounded hover:bg-rose-50 text-rose-500" aria-label="Xóa zone">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-slate-500">Phân loại:</div>
                    <span className="inline-flex mt-1 rounded-md px-2 py-1 text-sm font-semibold bg-violet-50 text-violet-700">
                      {zoneTypeLabels[zone.type]}
                    </span>

                    <div className="mt-2 text-sm text-slate-500">Số điểm: {zone.points.length}</div>
                  </div>)}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-violet-300 bg-indigo-50/40 p-5">
            <h3 className="text-xl font-semibold text-violet-800 inline-flex items-center gap-2">
              <Plus size={20} /> Thông tin zone mới
            </h3>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-base font-medium text-slate-700">Tên zone</label>
                <input value={zoneName} onChange={e => setZoneName(e.target.value)} placeholder="Nhập tên zone..." className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-800 placeholder:text-slate-400" />
              </div>

              <div>
                <label className="text-base font-medium text-slate-700">Phân loại</label>
                <select value={zoneType} onChange={e => setZoneType(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-800">
                  <option value="checkout">-- Chọn phân loại --</option>
                  <option value="checkout">Khu vực thanh toán</option>
                  <option value="shelf">Khu vực kệ</option>
                  <option value="aisle">Khu vực đi lại</option>
                  <option value="entrance">Lối vào</option>
                </select>
              </div>

              <div>
                <p className="text-base font-medium text-slate-700">Màu sắc</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {colorSwatches.map(swatch => <button key={swatch} onClick={() => setDraftColor(swatch)} className={`w-12 h-12 rounded-lg border-2 transition-all duration-150 ${draftColor === swatch ? 'border-slate-700 scale-105' : 'border-slate-200 hover:scale-105'}`} style={{
                  backgroundColor: swatch
                }} aria-label="Đặt màu cho zone" />)}
                </div>
              </div>

              <button onClick={createZoneFromDraft} disabled={draftPoints.length < 3} className="w-full rounded-xl bg-indigo-600 disabled:bg-slate-300 disabled:text-slate-100 text-white px-4 py-3 text-lg font-semibold inline-flex items-center justify-center gap-2">
                <Save size={20} /> Lưu zone
              </button>
            </div>
          </div>

          <div className="text-sm text-slate-500">
            Chế độ vẽ: click các điểm để vẽ polygon, click vào điểm đầu tiên hoặc double-click để đóng vùng. Chế độ chọn: kéo điểm để chỉnh. Chế độ xóa: xóa node hoặc cả vùng.
          </div>
        </section>
      </div>

      {showGuideModal && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl rounded-2xl overflow-hidden bg-white shadow-2xl">
            <div className="bg-blue-50 px-6 py-5 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-blue-700 inline-flex items-center gap-2">
                <AlertTriangle size={28} /> Quy tắc vẽ zone chuẩn cho AI
              </h3>
              <button onClick={() => setShowGuideModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-base text-slate-500 italic mb-5">
                Để hệ thống AI (Tracking và Heatmap) hoạt động chính xác, vui lòng tuân thủ các nguyên tắc sau:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                  <p className="text-lg font-semibold text-slate-800">1. Tỷ lệ ảnh chuẩn</p>
                  <p className="mt-2 text-slate-600">
                    Bắt buộc dùng ảnh Snapshot từ camera (thường là 16:9). Không dùng ảnh bị cắt hay sơ đồ 2D.
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                  <p className="text-lg font-semibold text-slate-800">2. Vẽ dưới mặt sàn</p>
                  <p className="mt-2 text-slate-600">
                    Vẽ vùng bao quanh khu vực đi lại của khách hàng. Không vẽ trùng lên nóc kệ hoặc trần nhà.
                  </p>
                </div>

                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                  <p className="text-lg font-semibold text-slate-800">3. Kích thước đủ lớn</p>
                  <p className="mt-2 text-slate-600">
                    Vùng vẽ phải đủ rộng để chứa trọn vẹn ít nhất 1 người. Tránh vẽ quá mảnh hoặc quá nhỏ.
                  </p>
                </div>

                <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4">
                  <p className="text-lg font-semibold text-slate-800">4. Tránh chồng lấn</p>
                  <p className="mt-2 text-slate-600">
                    Hạn chế vẽ các vùng đè lên nhau để tránh việc một người bị tính trùng lặp ở nhiều khu vực.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 px-6 py-5 flex justify-end">
              <button onClick={() => setShowGuideModal(false)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base font-semibold transition-all duration-150">
                <CheckCircle2 size={22} /> Đã hiểu, bắt đầu vẽ
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
