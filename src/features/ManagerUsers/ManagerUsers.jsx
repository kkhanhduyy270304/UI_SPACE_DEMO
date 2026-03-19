import { useEffect, useMemo, useState } from 'react';
import { Plus, Save, ShieldCheck, Users, X } from 'lucide-react';
import { clearAuthError, fetchUsers, registerUser } from '../../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
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
export const ManagerUsers = () => {
  const dispatch = useAppDispatch();
  const {
    user,
    users,
    userLoading,
    error
  } = useAppSelector(state => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('manager');
  const [storeId, setStoreId] = useState(stores[0].id);
  useEffect(() => {
    dispatch(fetchUsers());
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);
  const canCreateUser = user?.role === 'admin';
  const roleLabel = useMemo(() => ({
    admin: 'Admin',
    manager: 'Quan ly',
    staff: 'Nhan vien'
  }), []);
  const onCreateUser = async event => {
    event.preventDefault();
    const result = await dispatch(registerUser({
      payload: {
        fullName,
        email,
        password,
        role,
        storeId
      },
      actor: user
    }));
    if (!registerUser.rejected.match(result)) {
      setIsModalOpen(false);
      setFullName('');
      setEmail('');
      setPassword('');
      setRole('manager');
      setStoreId(stores[0].id);
    }
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quan ly nguoi dung</h1>
          <p className="text-slate-500 mt-1">Admin co the tao tai khoan cho manager va staff theo tung cua hang.</p>
        </div>
        {canCreateUser && <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all">
            <Plus size={16} /> Them nguoi dung
          </button>}
      </div>

      {!canCreateUser && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 text-sm">
          Chi tai khoan admin moi duoc phep tao nguoi dung moi.
        </div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Users size={18} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Tong nguoi dung</p>
              <p className="text-2xl font-semibold text-slate-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Manager</p>
              <p className="text-2xl font-semibold text-slate-900">{users.filter(item => item.role === 'manager').length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <Users size={18} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Staff</p>
              <p className="text-2xl font-semibold text-slate-900">{users.filter(item => item.role === 'staff').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Ho ten</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Vai tro</th>
                <th className="px-4 py-3">Cua hang</th>
              </tr>
            </thead>
            <tbody>
              {users.map(item => <tr key={item.id} className="border-t border-slate-200 hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-800">{item.fullName}</td>
                  <td className="px-4 py-3 text-slate-600">{item.email}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700">
                      {roleLabel[item.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.storeId || '-'}</td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && <div className="fixed inset-0 bg-black/35 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-xl bg-white border border-slate-200 shadow-sm p-5 text-slate-900">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Them nguoi dung</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-900">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={onCreateUser} className="space-y-3">
              <div>
                <label className="text-sm text-slate-700">Ho ten</label>
                <input value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1 w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900" />
              </div>
              <div>
                <label className="text-sm text-slate-700">Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900" />
              </div>
              <div>
                <label className="text-sm text-slate-700">Mat khau</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900" />
              </div>
              <div>
                <label className="text-sm text-slate-700">Vai tro</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="mt-1 w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900">
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-700">Cua hang phu trach</label>
                <select value={storeId} onChange={e => setStoreId(e.target.value)} className="mt-1 w-full rounded-lg bg-white border border-slate-300 px-3 py-2 text-sm text-slate-900">
                  {stores.map(store => <option key={store.id} value={store.id}>{store.name}</option>)}
                </select>
              </div>

              {error && <p className="text-sm text-rose-300">{error}</p>}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm">Huy</button>
                <button type="submit" disabled={userLoading} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium" style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)'
            }}>
                  <Save size={14} /> {userLoading ? 'Dang luu...' : 'Luu cau hinh'}
                </button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
};
