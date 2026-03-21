import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Trash2, SlidersHorizontal, Users, MapPin, BarChart3, Zap, ChevronDown, Power, Eye } from 'lucide-react';
const retentionConditionLabels = {
  no_checkin: 'Không check-in',
  low_visit: 'Tần suất ghé thăm thấp',
  no_pt_session: 'Không có buổi PT'
};
const retentionActionLabels = {
  send_zalo: 'Gửi Zalo',
  send_sms: 'Gửi SMS',
  alert_staff: 'Cảnh báo nhân viên',
  flag_churn: 'Gắn cờ rời bỏ'
};
const zoneMetricLabels = {
  avg_duration: 'Thời lượng trung bình',
  peak_count: 'Lượt đông cao điểm',
  idle_time: 'Thời gian chờ'
};
const zoneActionLabels = {
  alert_pt: 'Cảnh báo PT',
  notify_manager: 'Thông báo quản lý',
  redistribute: 'Phân bổ lại luồng di chuyển'
};
const zoneMetricUnits = {
  avg_duration: 'phút',
  idle_time: 'phút',
  peak_count: 'lượt'
};
const revenueMetricLabels = {
  daily_total: 'Tổng ngày',
  monthly_total: 'Tổng tháng',
  pt_sales: 'Doanh thu PT',
  new_member_fee: 'Phí hội viên mới'
};
const revenueActionLabels = {
  alert_finance: 'Cảnh báo tài chính',
  notify_manager: 'Thông báo quản lý'
};
const makeId = () => Date.now() + Math.floor(Math.random() * 1000);
const formatCurrencyShort = value => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)} tỷ`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)} triệu`;
  }
  return new Intl.NumberFormat('vi-VN').format(value);
};
/**
 * Rule configuration page for retention, zone, and revenue automation.
 */
export const RuleConfiguration = () => {
  const [gRules, setGRules] = useState([{
    id: makeId(),
    condition: 'no_checkin',
    days: 7,
    action: 'send_sms',
    enabled: true
  }]);
  const [zRules, setZRules] = useState([{
    id: makeId(),
    zone: 'Cardio',
    metric: 'avg_duration',
    operator: '>',
    value: 45,
    action: 'alert_pt',
    enabled: true
  }]);
  const [rRules, setRRules] = useState([{
    id: makeId(),
    metric: 'daily_total',
    operator: '<',
    value: 100_000_000,
    action: 'notify_manager',
    enabled: true
  }]);
  const [gForm, setGForm] = useState({
    condition: 'low_visit',
    days: 14,
    action: 'alert_staff'
  });
  const [zForm, setZForm] = useState({
    zone: 'Weights',
    metric: 'peak_count',
    operator: '>',
    value: 80,
    action: 'notify_manager'
  });
  const [rForm, setRForm] = useState({
    metric: 'monthly_total',
    operator: '<',
    value: 1_000_000_000,
    action: 'alert_finance'
  });
  const upG = (id, key, value) => {
    setGRules(prev => prev.map(rule => rule.id === id ? {
      ...rule,
      [key]: value
    } : rule));
  };
  const upZ = (id, key, value) => {
    setZRules(prev => prev.map(rule => rule.id === id ? {
      ...rule,
      [key]: value
    } : rule));
  };
  const upR = (id, key, value) => {
    setRRules(prev => prev.map(rule => rule.id === id ? {
      ...rule,
      [key]: value
    } : rule));
  };
  const addRule = type => {
    if (type === 'g') {
      setGRules(prev => [...prev, {
        id: makeId(),
        ...gForm,
        enabled: true
      }]);
      return;
    }
    if (type === 'z') {
      setZRules(prev => [...prev, {
        id: makeId(),
        ...zForm,
        enabled: true
      }]);
      return;
    }
    setRRules(prev => [...prev, {
      id: makeId(),
      ...rForm,
      enabled: true
    }]);
  };
  const deleteRule = (type, id) => {
    if (type === 'g') {
      setGRules(prev => prev.filter(rule => rule.id !== id));
      return;
    }
    if (type === 'z') {
      setZRules(prev => prev.filter(rule => rule.id !== id));
      return;
    }
    setRRules(prev => prev.filter(rule => rule.id !== id));
  };

  const selectClassName = 'h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-teal-400 focus:ring-0';
  const inputClassName = 'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-teal-400 focus:ring-0 font-[\'DM_Mono\']';
  const cellMutedClassName = 'text-[11px] uppercase tracking-wider font-bold text-slate-500';
  const headingClassName = 'font-[\'DM_Sans\'] text-base font-bold text-slate-900';

  const totalRules = useMemo(() => gRules.length + zRules.length + rRules.length, [gRules, zRules, rRules]);
  return <div className="min-h-screen bg-slate-50 p-6 space-y-6 pb-32">
      <div className="flex items-center justify-end gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white shadow-sm">
          <SlidersHorizontal size={16} className="text-slate-600" />
          <span className="text-sm text-slate-700">{totalRules} quy tắc đang hoạt động</span>
        </div>
      </div>

      <section className="border border-slate-200 rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-4 inline-flex items-center gap-2">
          <Users size={18} className="text-indigo-500" />
          <h2 className={headingClassName}>Retention</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-1">
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Điều kiện</label>
              <div className="relative">
                <select value={gForm.condition} onChange={e => setGForm(prev => ({
                ...prev,
                condition: e.target.value
              }))} className={selectClassName}>
                  {Object.entries(retentionConditionLabels).map(([value, label]) => <option key={value} value={value}>
                      {label}
                    </option>)}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Giá trị</label>
              <div className="relative">
                <input type="number" min={1} value={gForm.days} onChange={e => setGForm(prev => ({
                ...prev,
                days: Number(e.target.value)
              }))} className={inputClassName} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">ngày</span>
              </div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Hành động</label>
              <div className="relative">
                <select value={gForm.action} onChange={e => setGForm(prev => ({
                ...prev,
                action: e.target.value
              }))} className={selectClassName}>
                  {Object.entries(retentionActionLabels).map(([value, label]) => <option key={value} value={value}>
                      {label}
                    </option>)}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <button onClick={() => addRule('g')} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-500">
                <Plus size={15} /> Thêm vào bảng
              </button>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                <p className="mb-1 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Eye size={12} /> Xem trước
                </p>
                <p className="inline-flex items-center gap-2 text-xs text-slate-600">
                  <Zap size={13} className="text-indigo-500" />
                  Nếu khách {retentionConditionLabels[gForm.condition].toLowerCase()} trong {gForm.days} ngày thì {retentionActionLabels[gForm.action]}.
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 lg:col-span-2">
            <table className="min-w-full bg-white">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr>
                  <th className={`${cellMutedClassName} px-3 py-3 text-center w-24`}>Bật/Tắt</th>
                  <th className={`${cellMutedClassName} px-3 py-3 text-left`}>Tóm tắt quy luật</th>
                  <th className={`${cellMutedClassName} px-3 py-3 text-right w-16`}>Xóa</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {gRules.map((rule, index) => <motion.tr key={rule.id} initial={{
                opacity: 0,
                y: 8
              }} animate={{
                opacity: 1,
                y: 0
              }} exit={{
                opacity: 0,
                y: -8
              }} transition={{
                duration: 0.2
              }} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50/50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                    <td className="px-3 py-3 text-center">
                      <button onClick={() => upG(rule.id, 'enabled', !rule.enabled)} className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${rule.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        <Power size={12} />
                        {rule.enabled ? 'Bật' : 'Tắt'}
                      </button>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-700">
                      <span className={rule.enabled ? '' : 'opacity-50'}>Nếu khách {retentionConditionLabels[rule.condition].toLowerCase()} trong <span className="font-[\'DM_Mono\']">{rule.days}</span> ngày thì {retentionActionLabels[rule.action]}.</span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button onClick={() => deleteRule('g', rule.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-rose-400 hover:bg-rose-50 hover:text-rose-500" aria-label="Xóa quy tắc giữ chân">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </motion.tr>)}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border border-slate-200 rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-4 inline-flex items-center gap-2">
          <MapPin size={18} className="text-teal-500" />
          <h2 className={headingClassName}>Zone</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-1">
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Điều kiện</label>
              <div className="relative">
                <select value={zForm.zone} onChange={e => setZForm(prev => ({
                ...prev,
                zone: e.target.value
              }))} className={selectClassName}>
                  {['Cardio', 'Weights', 'Yoga', 'Pool', 'Functional', 'Locker'].map(zone => <option key={zone} value={zone}>
                      {zone}
                    </option>)}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <div className="relative">
                <select value={zForm.metric} onChange={e => setZForm(prev => ({
                ...prev,
                metric: e.target.value
              }))} className={selectClassName}>
                  {Object.entries(zoneMetricLabels).map(([value, label]) => <option key={value} value={value}>
                      {label}
                    </option>)}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Giá trị</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <select value={zForm.operator} onChange={e => setZForm(prev => ({
                  ...prev,
                  operator: e.target.value
                }))} className={selectClassName}>
                    {['>', '<', '>=', '<='].map(operator => <option key={operator} value={operator}>
                        {operator}
                      </option>)}
                  </select>
                  <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <div className="relative">
                  <input type="number" value={zForm.value} onChange={e => setZForm(prev => ({
                  ...prev,
                  value: Number(e.target.value)
                }))} className={inputClassName} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">{zoneMetricUnits[zForm.metric]}</span>
                </div>
              </div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Hành động</label>
              <div className="relative">
                <select value={zForm.action} onChange={e => setZForm(prev => ({
                ...prev,
                action: e.target.value
              }))} className={selectClassName}>
                  {Object.entries(zoneActionLabels).map(([value, label]) => <option key={value} value={value}>
                      {label}
                    </option>)}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <button onClick={() => addRule('z')} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-3 py-2 text-sm text-white hover:bg-teal-500">
                <Plus size={15} /> Thêm vào bảng
              </button>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                <p className="mb-1 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Eye size={12} /> Xem trước
                </p>
                <p className="inline-flex items-center gap-2 text-xs text-slate-600">
                  <Zap size={13} className="text-teal-500" />
                  Nếu khu {zForm.zone} có {zoneMetricLabels[zForm.metric].toLowerCase()} {zForm.operator} {zForm.value} {zoneMetricUnits[zForm.metric]} thì {zoneActionLabels[zForm.action]}.
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 lg:col-span-2">
            <table className="min-w-full bg-white">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr>
                  <th className={`${cellMutedClassName} px-3 py-3 text-center w-24`}>Bật/Tắt</th>
                  <th className={`${cellMutedClassName} px-3 py-3 text-left`}>Tóm tắt quy luật</th>
                  <th className={`${cellMutedClassName} px-3 py-3 text-right w-16`}>Xóa</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {zRules.map((rule, index) => <motion.tr key={rule.id} initial={{
                opacity: 0,
                y: 8
              }} animate={{
                opacity: 1,
                y: 0
              }} exit={{
                opacity: 0,
                y: -8
              }} transition={{
                duration: 0.2
              }} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50/50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                    <td className="px-3 py-3 text-center">
                      <button onClick={() => upZ(rule.id, 'enabled', !rule.enabled)} className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${rule.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        <Power size={12} />
                        {rule.enabled ? 'Bật' : 'Tắt'}
                      </button>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-700">
                      <span className={rule.enabled ? '' : 'opacity-50'}>Nếu khu {rule.zone} có {zoneMetricLabels[rule.metric].toLowerCase()} {rule.operator} <span className="font-[\'DM_Mono\']">{rule.value}</span> {zoneMetricUnits[rule.metric]} thì {zoneActionLabels[rule.action]}.</span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button onClick={() => deleteRule('z', rule.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-rose-400 hover:bg-rose-50 hover:text-rose-500" aria-label="Xóa quy tắc zone">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </motion.tr>)}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border border-slate-200 rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-4 inline-flex items-center gap-2">
          <BarChart3 size={18} className="text-amber-500" />
          <h2 className={headingClassName}>Revenue</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-1">
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Điều kiện</label>
              <div className="relative">
                <select value={rForm.metric} onChange={e => setRForm(prev => ({
                ...prev,
                metric: e.target.value
              }))} className={selectClassName}>
                  {Object.entries(revenueMetricLabels).map(([value, label]) => <option key={value} value={value}>
                      {label}
                    </option>)}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Giá trị</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <select value={rForm.operator} onChange={e => setRForm(prev => ({
                  ...prev,
                  operator: e.target.value
                }))} className={selectClassName}>
                    {['>', '<', '>=', '<='].map(operator => <option key={operator} value={operator}>
                        {operator}
                      </option>)}
                  </select>
                  <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <div className="relative">
                  <input type="number" min={0} value={rForm.value} onChange={e => setRForm(prev => ({
                  ...prev,
                  value: Number(e.target.value)
                }))} className={inputClassName} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">₫</span>
                </div>
              </div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Hành động</label>
              <div className="relative">
                <select value={rForm.action} onChange={e => setRForm(prev => ({
                ...prev,
                action: e.target.value
              }))} className={selectClassName}>
                  {Object.entries(revenueActionLabels).map(([value, label]) => <option key={value} value={value}>
                      {label}
                    </option>)}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <button onClick={() => addRule('r')} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-3 py-2 text-sm text-white hover:bg-amber-500">
                <Plus size={15} /> Thêm vào bảng
              </button>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                <p className="mb-1 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Eye size={12} /> Xem trước
                </p>
                <p className="inline-flex items-center gap-2 text-xs text-slate-600">
                  <Zap size={13} className="text-amber-500" />
                  Nếu {revenueMetricLabels[rForm.metric].toLowerCase()} {rForm.operator} {formatCurrencyShort(rForm.value)} thì {revenueActionLabels[rForm.action]}.
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 lg:col-span-2">
            <table className="min-w-full bg-white">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr>
                  <th className={`${cellMutedClassName} px-3 py-3 text-center w-24`}>Bật/Tắt</th>
                  <th className={`${cellMutedClassName} px-3 py-3 text-left`}>Tóm tắt quy luật</th>
                  <th className={`${cellMutedClassName} px-3 py-3 text-right w-16`}>Xóa</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {rRules.map((rule, index) => <motion.tr key={rule.id} initial={{
                opacity: 0,
                y: 8
              }} animate={{
                opacity: 1,
                y: 0
              }} exit={{
                opacity: 0,
                y: -8
              }} transition={{
                duration: 0.2
              }} className={`border-b border-slate-100 last:border-0 hover:bg-slate-50/50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                    <td className="px-3 py-3 text-center">
                      <button onClick={() => upR(rule.id, 'enabled', !rule.enabled)} className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${rule.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        <Power size={12} />
                        {rule.enabled ? 'Bật' : 'Tắt'}
                      </button>
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-700">
                      <span className={rule.enabled ? '' : 'opacity-50'}>Nếu {revenueMetricLabels[rule.metric].toLowerCase()} {rule.operator} <span className="font-[\'DM_Mono\']">{formatCurrencyShort(rule.value)}</span> thì {revenueActionLabels[rule.action]}.</span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button onClick={() => deleteRule('r', rule.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-rose-400 hover:bg-rose-50 hover:text-rose-500" aria-label="Xóa quy tắc doanh thu">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </motion.tr>)}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <p className="text-sm text-slate-600">Đã cấu hình {totalRules} quy tắc đang hoạt động</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm">
              Hủy bỏ
            </button>
            <button className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm">
              Lưu cấu hình
            </button>
          </div>
        </div>
      </div>
    </div>;
};
