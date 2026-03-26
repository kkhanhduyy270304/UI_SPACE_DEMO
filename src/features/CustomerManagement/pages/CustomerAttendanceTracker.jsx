import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { loadCustomerData } from '../../../redux/slices/customerSlice';

const WEEK_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatDate = (date) => {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const mkAttendance = (members = [], weekDates = [], monthDates = []) => {
  const map = {};

  members.forEach((member, idx) => {
    const memberKey = member.id || member.fullName || `member-${idx}`;
    const set = new Set();

    // Weekly: random 3-5 days as attended
    weekDates.forEach((d) => {
      if (Math.random() < 0.45) set.add(d.toISOString().slice(0, 10));
    });

    // Monthly: random 8-16 days
    monthDates.forEach((d) => {
      if (Math.random() < 0.32) set.add(d.toISOString().slice(0, 10));
    });

    map[memberKey] = set;
  });

  return map;
};

const getTimeLabel = (date) => {
  return `18:30 - 20:00 (${formatDate(date)})`;
};

export const CustomerAttendanceTracker = () => {
  const dispatch = useAppDispatch();
  const { data, analytics } = useAppSelector((state) => state.customer);

  const [viewMode, setViewMode] = useState('weekly');
  const [searchQuery, setSearchQuery] = useState('');
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [monthBase, setMonthBase] = useState(() => new Date());

  useEffect(() => {
    dispatch(loadCustomerData('gym'));
    dispatch(loadCustomerData('analysis'));
  }, [dispatch]);

  const customers = useMemo(() => {
    const fromData = Array.isArray(data) && data.length ? data.map((c) => ({ id: c.id, fullName: c.name })) : [];
    const fromAnalytics = Array.isArray(analytics.memberList) ? analytics.memberList.map((m) => ({ id: m.id, fullName: m.fullName })) : [];
    const merged = [...fromAnalytics, ...fromData];
    const unique = [];
    const seen = new Set();
    merged.forEach((item) => {
      const key = item.id || item.fullName;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    });
    return unique;
  }, [data, analytics.memberList]);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase();
    return customers.filter((member) => (member.fullName || '').toLowerCase().includes(q));
  }, [customers, searchQuery]);

  const weekDates = useMemo(() => {
    const start = getMonday(weekStart);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const monthDays = useMemo(() => {
    const days = getDaysInMonth(monthBase);
    return Array.from({ length: days }).map((_, idx) => {
      const d = new Date(monthBase.getFullYear(), monthBase.getMonth(), idx + 1);
      return d;
    });
  }, [monthBase]);

  const attendanceMap = useMemo(() => mkAttendance(filteredCustomers, weekDates, monthDays), [filteredCustomers, weekDates, monthDays]);

  const hasVisited = (member, date) => {
    const key = member.id || member.fullName;
    const visitedSet = attendanceMap[key] || new Set();
    return visitedSet.has(date.toISOString().slice(0, 10));
  };

  const goPreviousWeek = () => {
    setWeekStart((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() - 7);
      return next;
    });
  };

  const goNextWeek = () => {
    setWeekStart((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 7);
      return next;
    });
  };

  const goPreviousMonth = () => {
    setMonthBase((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goNextMonth = () => {
    setMonthBase((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const labelWeek = `${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}`;
  const monthName = `${monthBase.toLocaleString('vi-VN', { month: '2-digit' })}`;
  const monthDisplay = `Tháng ${monthName}, ${monthBase.getFullYear()}`;

  return (
    <div className="space-y-4 p-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex rounded-lg bg-slate-50 p-1">
            <button className={`px-4 py-2 text-sm font-medium ${viewMode === 'weekly' ? 'bg-teal-500 text-white rounded-lg' : 'text-slate-700 hover:bg-slate-100 rounded-lg'}`} onClick={() => setViewMode('weekly')}>
              Xem theo Tuần
            </button>
            <button className={`px-4 py-2 text-sm font-medium ${viewMode === 'monthly' ? 'bg-teal-500 text-white rounded-lg' : 'text-slate-700 hover:bg-slate-100 rounded-lg'}`} onClick={() => setViewMode('monthly')}>
              Xem theo Tháng
            </button>
          </div>

          <div className="flex items-center gap-4">
            {viewMode === 'weekly' ? (
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <button onClick={goPreviousWeek} className="rounded-md p-2 hover:bg-slate-100"><ChevronLeft size={16} /></button>
                <span className="font-medium">Tuần này ({labelWeek})</span>
                <button onClick={goNextWeek} className="rounded-md p-2 hover:bg-slate-100"><ChevronRight size={16} /></button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <button onClick={goPreviousMonth} className="rounded-md p-2 hover:bg-slate-100"><ChevronLeft size={16} /></button>
                <span className="font-medium">{monthDisplay}</span>
                <button onClick={goNextMonth} className="rounded-md p-2 hover:bg-slate-100"><ChevronRight size={16} /></button>
              </div>
            )}
          </div>

          <div className="relative max-w-sm min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm khách hàng..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-[900px] w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 text-left">
              <th className="sticky left-0 z-10 bg-slate-50 border-b border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900">Khách hàng</th>
              {(viewMode === 'weekly' ? weekDates : monthDays).map((day, idx) => (
                <th key={idx} className="whitespace-nowrap border-b border-slate-200 px-2 py-2 text-center text-xs font-semibold text-slate-700">
                  {viewMode === 'weekly' ? WEEK_LABELS[idx] : day.getDate()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan={(viewMode === 'weekly' ? 1 : 1) + (viewMode === 'weekly' ? 7 : monthDays.length)} className="px-3 py-4 text-center text-sm text-slate-500">Không có khách hàng phù hợp.</td>
              </tr>
            )}

            {filteredCustomers.map((customer) => (
              <tr key={customer.id || customer.fullName} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="sticky left-0 z-10 bg-white px-3 py-3 text-sm font-bold text-slate-900">{customer.fullName}</td>
                {(viewMode === 'weekly' ? weekDates : monthDays).map((day, idx) => {
                  const visited = hasVisited(customer, day);
                  return (
                    <td key={idx} className="border-b border-slate-200 px-2 py-3 text-center">
                      <span
                        title={visited ? getTimeLabel(day) : 'Nghỉ'}
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${visited ? 'bg-teal-100 border-teal-500' : 'bg-white border-slate-200'} transition-all duration-150 hover:scale-110`}
                      >
                        {visited ? '✓' : ''}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500">* Chú thích: vòng tròn xanh = có buổi tập (tooltip chứa giờ), vòng tròn trắng = nghỉ.</p>
    </div>
  );
};
