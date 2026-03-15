import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Trash2, SlidersHorizontal } from 'lucide-react';
import { Card } from '../../components/common';
const retentionConditionLabels = {
  no_checkin: 'Khong check-in',
  low_visit: 'Tan suat ghe tham thap',
  no_pt_session: 'Khong co buoi PT'
};
const retentionActionLabels = {
  send_zalo: 'Gui Zalo',
  send_sms: 'Gui SMS',
  alert_staff: 'Canh bao nhan vien',
  flag_churn: 'Gan co roi bo'
};
const zoneMetricLabels = {
  avg_duration: 'Thoi luong trung binh',
  peak_count: 'Luot dong cao diem',
  idle_time: 'Thoi gian cho'
};
const zoneActionLabels = {
  alert_pt: 'Canh bao PT',
  notify_manager: 'Thong bao quan ly',
  redistribute: 'Phan bo lai luong di chuyen'
};
const revenueMetricLabels = {
  daily_total: 'Tong ngay',
  monthly_total: 'Tong thang',
  pt_sales: 'Doanh thu PT',
  new_member_fee: 'Phi hoi vien moi'
};
const revenueActionLabels = {
  alert_finance: 'Canh bao tai chinh',
  notify_manager: 'Thong bao quan ly'
};
const makeId = () => Date.now() + Math.floor(Math.random() * 1000);
const formatCurrencyShort = value => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)} ty`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)} trieu`;
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
  const totalRules = useMemo(() => gRules.length + zRules.length + rRules.length, [gRules, zRules, rRules]);
  return <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Cau hinh quy tac</h1>
          <p className="text-slate-500 mt-1">Thiet lap logic tu dong tu du lieu Edge AI va POS.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white">
          <SlidersHorizontal size={16} className="text-slate-600" />
          <span className="text-sm text-slate-700">{totalRules} quy tac dang hoat dong</span>
        </div>
      </div>

      <Card className="p-5 border-l-4 border-l-indigo-500">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Quy tac giu chan thanh vien</h2>
          <button onClick={() => setGRules(prev => [...prev, {
          id: makeId(),
          condition: 'low_visit',
          days: 14,
          action: 'alert_staff'
        }])} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm">
            <Plus size={16} /> Them quy tac
          </button>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {gRules.map(rule => <motion.div key={rule.id} {...rowAnim} transition={{
            duration: 0.22
          }} className="rounded-lg border border-slate-200 p-3 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <select value={rule.condition} onChange={e => upG(rule.id, 'condition', e.target.value)} className="md:col-span-4 rounded-lg border border-slate-300 px-3 py-2 text-sm">
                    {Object.entries(retentionConditionLabels).map(([value, label]) => <option key={value} value={value}>
                        {label}
                      </option>)}
                  </select>
                  <div className="md:col-span-3 relative">
                    <input type="number" min={1} value={rule.days} onChange={e => upG(rule.id, 'days', Number(e.target.value))} className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-12 text-sm" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">ngay</span>
                  </div>
                  <select value={rule.action} onChange={e => upG(rule.id, 'action', e.target.value)} className="md:col-span-4 rounded-lg border border-slate-300 px-3 py-2 text-sm">
                    {Object.entries(retentionActionLabels).map(([value, label]) => <option key={value} value={value}>
                        {label}
                      </option>)}
                  </select>
                  <button onClick={() => setGRules(prev => prev.filter(item => item.id !== rule.id))} className="md:col-span-1 inline-flex items-center justify-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50" aria-label="Xoa quy tac giu chan">
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="mt-3 text-sm text-slate-600 rounded-lg bg-slate-50 px-3 py-2">
                  Neu thanh vien {retentionConditionLabels[rule.condition].toLowerCase()} trong {rule.days} ngay -> {retentionActionLabels[rule.action]}
                </p>
              </motion.div>)}
          </AnimatePresence>
        </div>
      </Card>

      <Card className="p-5 border-l-4 border-l-teal-500">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Quy tac hieu suat zone</h2>
          <button onClick={() => setZRules(prev => [...prev, {
          id: makeId(),
          zone: 'Weights',
          metric: 'peak_count',
          operator: '>',
          value: 80,
          action: 'notify_manager'
        }])} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm">
            <Plus size={16} /> Them quy tac
          </button>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {zRules.map(rule => <motion.div key={rule.id} {...rowAnim} transition={{
            duration: 0.22
          }} className="rounded-lg border border-slate-200 p-3 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <select value={rule.zone} onChange={e => upZ(rule.id, 'zone', e.target.value)} className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm">
                    {['Cardio', 'Weights', 'Yoga', 'Pool', 'Functional', 'Locker'].map(zone => <option key={zone} value={zone}>
                        {zone}
                      </option>)}
                  </select>
                  <select value={rule.metric} onChange={e => upZ(rule.id, 'metric', e.target.value)} className="md:col-span-3 rounded-lg border border-slate-300 px-3 py-2 text-sm">
                    {Object.entries(zoneMetricLabels).map(([value, label]) => <option key={value} value={value}>
                        {label}
                      </option>)}
                  </select>
                  <select value={rule.operator} onChange={e => upZ(rule.id, 'operator', e.target.value)} className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm">
                    {['>', '<', '>=', '<='].map(operator => <option key={operator} value={operator}>
                        {operator}
                      </option>)}
                  </select>
                  <div className="md:col-span-2 relative">
                    <input type="number" value={rule.value} onChange={e => upZ(rule.id, 'value', Number(e.target.value))} className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-12 text-sm" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">don vi</span>
                  </div>
                  <select value={rule.action} onChange={e => upZ(rule.id, 'action', e.target.value)} className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm">
                    {Object.entries(zoneActionLabels).map(([value, label]) => <option key={value} value={value}>
                        {label}
                      </option>)}
                  </select>
                  <button onClick={() => setZRules(prev => prev.filter(item => item.id !== rule.id))} className="md:col-span-1 inline-flex items-center justify-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50" aria-label="Xoa quy tac zone">
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="mt-3 text-sm text-slate-600 rounded-lg bg-slate-50 px-3 py-2">
                  Neu zone {rule.zone} co {zoneMetricLabels[rule.metric]} {rule.operator} {rule.value} -> {zoneActionLabels[rule.action]}
                </p>
              </motion.div>)}
          </AnimatePresence>
        </div>
      </Card>

      <Card className="p-5 border-l-4 border-l-amber-500">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Quy tac muc tieu doanh thu</h2>
          <button onClick={() => setRRules(prev => [...prev, {
          id: makeId(),
          metric: 'monthly_total',
          operator: '<',
          value: 1_000_000_000,
          action: 'alert_finance'
        }])} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm">
            <Plus size={16} /> Them quy tac
          </button>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {rRules.map(rule => <motion.div key={rule.id} {...rowAnim} transition={{
            duration: 0.22
          }} className="rounded-lg border border-slate-200 p-3 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <select value={rule.metric} onChange={e => upR(rule.id, 'metric', e.target.value)} className="md:col-span-4 rounded-lg border border-slate-300 px-3 py-2 text-sm">
                    {Object.entries(revenueMetricLabels).map(([value, label]) => <option key={value} value={value}>
                        {label}
                      </option>)}
                  </select>
                  <select value={rule.operator} onChange={e => upR(rule.id, 'operator', e.target.value)} className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm">
                    {['>', '<', '>=', '<='].map(operator => <option key={operator} value={operator}>
                        {operator}
                      </option>)}
                  </select>
                  <div className="md:col-span-4 relative">
                    <input type="number" min={0} value={rule.value} onChange={e => upR(rule.id, 'value', Number(e.target.value))} className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-12 text-sm" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">VND</span>
                  </div>
                  <select value={rule.action} onChange={e => upR(rule.id, 'action', e.target.value)} className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm">
                    {Object.entries(revenueActionLabels).map(([value, label]) => <option key={value} value={value}>
                        {label}
                      </option>)}
                  </select>
                </div>
                <p className="mt-3 text-sm text-slate-600 rounded-lg bg-slate-50 px-3 py-2">
                  Neu {revenueMetricLabels[rule.metric]} {rule.operator} {formatCurrencyShort(rule.value)} -> {revenueActionLabels[rule.action]}
                </p>
              </motion.div>)}
          </AnimatePresence>
        </div>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-slate-600">Da cau hinh {totalRules} quy tac dang hoat dong</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm">
              Huy
            </button>
            <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm">
              Luu quy tac
            </button>
          </div>
        </div>
      </div>
    </div>;
};
