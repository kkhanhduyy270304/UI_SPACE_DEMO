import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Trash2, SlidersHorizontal, Users, MapPin, BarChart3, Zap, ChevronDown } from 'lucide-react';
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
const rowAnim = {
  initial: {
    opacity: 0,
    y: 14
  },
  animate: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: -10
  }
};

/**
 * Rule configuration page for retention, zone, and revenue automation.
 */
export const RuleConfiguration = () => {
  const [gRules, setGRules] = useState([{
    id: makeId(),
    condition: 'no_checkin',
    days: 7,
    action: 'send_sms'
  }]);
  const [zRules, setZRules] = useState([{
    id: makeId(),
    zone: 'Cardio',
    metric: 'avg_duration',
    operator: '>',
    value: 45,
    action: 'alert_pt'
  }]);
  const [rRules, setRRules] = useState([{
    id: makeId(),
    metric: 'daily_total',
    operator: '<',
    value: 100_000_000,
    action: 'notify_manager'
  }]);
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

  const selectClassName = 'h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-800 outline-none transition focus:ring-1 focus:ring-teal-500/40';
  const inputClassName = 'h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:ring-1 focus:ring-teal-500/40';
  const suffixInputClassName = 'h-11 w-full rounded-lg border border-slate-200 bg-white px-3 pr-14 text-sm text-slate-800 outline-none transition focus:ring-1 focus:ring-teal-500/40';

  const totalRules = useMemo(() => gRules.length + zRules.length + rRules.length, [gRules, zRules, rRules]);
  return <div className="min-h-screen bg-slate-50 p-6 space-y-6 pb-28">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Cấu hình quy tắc</h1>
          <p className="text-slate-600 mt-1">Thiết lập logic tự động từ dữ liệu Edge AI và POS.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white shadow-sm">
          <SlidersHorizontal size={16} className="text-slate-600" />
          <span className="text-sm text-slate-700">{totalRules} quy tắc đang hoạt động</span>
        </div>
      </div>

      <section className="bg-white border border-slate-200 border-l-4 border-l-indigo-500 rounded-2xl p-6 mb-6 relative overflow-hidden shadow-sm">
        <p className="uppercase tracking-widest text-xs font-semibold text-slate-500 mb-4">Quy tắc giữ chân</p>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 inline-flex items-center gap-2">
            <Users size={18} className="text-indigo-400" />
            Quy tắc giữ chân thành viên
          </h2>
          <button onClick={() => setGRules(prev => [...prev, {
          id: makeId(),
          condition: 'low_visit',
          days: 14,
          action: 'alert_staff'
        }])} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm">
            <Plus size={16} /> Thêm quy tắc
          </button>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {gRules.map(rule => <motion.div key={rule.id} {...rowAnim} transition={{
            duration: 0.22
          }} className="rounded-xl border border-slate-200 p-4 bg-white animate-fade-in-up">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative min-w-[240px] flex-1">
                    <select value={rule.condition} onChange={e => upG(rule.id, 'condition', e.target.value)} className={selectClassName}>
                    {Object.entries(retentionConditionLabels).map(([value, label]) => <option key={value} value={value}>
                        {label}
                      </option>)}
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  <div className="relative min-w-[170px] flex-1">
                    <input type="number" min={1} value={rule.days} onChange={e => upG(rule.id, 'days', Number(e.target.value))} className={suffixInputClassName} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">ngày</span>
                  </div>
                  <div className="relative min-w-[220px] flex-1">
                    <select value={rule.action} onChange={e => upG(rule.id, 'action', e.target.value)} className={selectClassName}>
                    {Object.entries(retentionActionLabels).map(([value, label]) => <option key={value} value={value}>
                        {label}
                      </option>)}
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  <button onClick={() => setGRules(prev => prev.filter(item => item.id !== rule.id))} className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-rose-500/20 text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10" aria-label="Xóa quy tắc giữ chân">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-sm text-slate-600 italic inline-flex items-center gap-2">
                  <Zap size={14} className="text-teal-400" />
                  Nếu thành viên {retentionConditionLabels[rule.condition].toLowerCase()} trong {rule.days} ngày -> {retentionActionLabels[rule.action]}
                </div>
              </motion.div>)}
          </AnimatePresence>
        </div>
      </section>

      <section className="bg-white border border-slate-200 border-l-4 border-l-teal-500 rounded-2xl p-6 mb-6 relative overflow-hidden shadow-sm">
        <p className="uppercase tracking-widest text-xs font-semibold text-slate-500 mb-4">Quy tắc zone</p>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 inline-flex items-center gap-2">
            <MapPin size={18} className="text-teal-400" />
            Quy tắc hiệu suất zone
          </h2>
          <button onClick={() => setZRules(prev => [...prev, {
          id: makeId(),
          zone: 'Weights',
          metric: 'peak_count',
          operator: '>',
          value: 80,
          action: 'notify_manager'
        }])} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm">
            <Plus size={16} /> Thêm quy tắc
          </button>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {zRules.map(rule => <motion.div key={rule.id} {...rowAnim} transition={{
            duration: 0.22
          }} className="rounded-xl border border-slate-200 p-4 bg-white animate-fade-in-up">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative min-w-[140px] flex-1">
                    <select value={rule.zone} onChange={e => upZ(rule.id, 'zone', e.target.value)} className={selectClassName}>
                    {['Cardio', 'Weights', 'Yoga', 'Pool', 'Functional', 'Locker'].map(zone => <option key={zone} value={zone}>
                        {zone}
                      </option>)}
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  <div className="relative min-w-[220px] flex-1">
                    <select value={rule.metric} onChange={e => upZ(rule.id, 'metric', e.target.value)} className={selectClassName}>
                    {Object.entries(zoneMetricLabels).map(([value, label]) => <option key={value} value={value}>
                        {label}
                      </option>)}
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  <div className="relative w-[110px]">
                    <select value={rule.operator} onChange={e => upZ(rule.id, 'operator', e.target.value)} className={selectClassName}>
                    {['>', '<', '>=', '<='].map(operator => <option key={operator} value={operator}>
                        {operator}
                      </option>)}
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  <div className="relative min-w-[140px] flex-1">
                    <input type="number" value={rule.value} onChange={e => upZ(rule.id, 'value', Number(e.target.value))} className={suffixInputClassName} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">đơn vị</span>
                  </div>
                  <div className="relative min-w-[220px] flex-1">
                    <select value={rule.action} onChange={e => upZ(rule.id, 'action', e.target.value)} className={selectClassName}>
                    {Object.entries(zoneActionLabels).map(([value, label]) => <option key={value} value={value}>
                        {label}
                      </option>)}
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  <button onClick={() => setZRules(prev => prev.filter(item => item.id !== rule.id))} className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-rose-500/20 text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10" aria-label="Xóa quy tắc zone">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-sm text-slate-600 italic inline-flex items-center gap-2">
                  <Zap size={14} className="text-teal-400" />
                  Nếu zone {rule.zone} có {zoneMetricLabels[rule.metric]} {rule.operator} {rule.value} -> {zoneActionLabels[rule.action]}
                </div>
              </motion.div>)}
          </AnimatePresence>
        </div>
      </section>

      <section className="bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-2xl p-6 mb-6 relative overflow-hidden shadow-sm">
        <p className="uppercase tracking-widest text-xs font-semibold text-slate-500 mb-4">Quy tắc doanh thu</p>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 inline-flex items-center gap-2">
            <BarChart3 size={18} className="text-amber-400" />
            Quy tắc mục tiêu doanh thu
          </h2>
          <button onClick={() => setRRules(prev => [...prev, {
          id: makeId(),
          metric: 'monthly_total',
          operator: '<',
          value: 1_000_000_000,
          action: 'alert_finance'
        }])} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm">
            <Plus size={16} /> Thêm quy tắc
          </button>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {rRules.map(rule => <motion.div key={rule.id} {...rowAnim} transition={{
            duration: 0.22
          }} className="rounded-xl border border-slate-200 p-4 bg-white animate-fade-in-up">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative min-w-[220px] flex-1">
                    <select value={rule.metric} onChange={e => upR(rule.id, 'metric', e.target.value)} className={selectClassName}>
                    {Object.entries(revenueMetricLabels).map(([value, label]) => <option key={value} value={value}>
                        {label}
                      </option>)}
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  <div className="relative w-[110px]">
                    <select value={rule.operator} onChange={e => upR(rule.id, 'operator', e.target.value)} className={selectClassName}>
                    {['>', '<', '>=', '<='].map(operator => <option key={operator} value={operator}>
                        {operator}
                      </option>)}
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  <div className="relative min-w-[220px] flex-1">
                    <input type="number" min={0} value={rule.value} onChange={e => upR(rule.id, 'value', Number(e.target.value))} className={suffixInputClassName} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">VND</span>
                  </div>
                  <div className="relative min-w-[220px] flex-1">
                    <select value={rule.action} onChange={e => upR(rule.id, 'action', e.target.value)} className={selectClassName}>
                    {Object.entries(revenueActionLabels).map(([value, label]) => <option key={value} value={value}>
                        {label}
                      </option>)}
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-sm text-slate-600 italic inline-flex items-center gap-2">
                  <Zap size={14} className="text-teal-400" />
                  Nếu {revenueMetricLabels[rule.metric]} {rule.operator} {formatCurrencyShort(rule.value)} -> {revenueActionLabels[rule.action]}
                </div>
              </motion.div>)}
          </AnimatePresence>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <p className="text-sm text-slate-600">Đã cấu hình {totalRules} quy tắc đang hoạt động</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm">
              Hủy
            </button>
            <button className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm">
              Lưu quy tắc
            </button>
          </div>
        </div>
      </div>
    </div>;
};
