import { useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clearAuthError, login } from '../../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
export const SignIn = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    user,
    loading,
    error
  } = useAppSelector(state => state.auth);
  const [email, setEmail] = useState('admin@storelens.vn');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    if (user) {
      navigate('/dashboard', {
        replace: true
      });
    }
  }, [navigate, user]);
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);
  const onSubmit = async event => {
    event.preventDefault();
    await dispatch(login({
      email,
      password
    }));
  };
  return <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.35),_rgba(15,23,42,1)_45%)] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl p-6 text-white">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold">Dang nhap StoreLens</h1>
          <p className="mt-2 text-sm text-slate-200">Dang nhap de truy cap he thong giam sat va phan tich.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-200">Email</label>
            <div className="mt-1 relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
              <input type="email" value={email} onChange={event => setEmail(event.target.value)} className="w-full rounded-xl bg-slate-900/60 border border-white/15 px-10 py-3 text-sm outline-none focus:border-indigo-400" placeholder="admin@storelens.vn" />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-200">Mat khau</label>
            <div className="mt-1 relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)} className="w-full rounded-xl bg-slate-900/60 border border-white/15 px-10 py-3 pr-11 text-sm outline-none focus:border-indigo-400" placeholder="Nhap mat khau" />
              <button type="button" onClick={() => setShowPassword(prev => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-rose-300">{error}</p>}

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 text-sm font-medium transition-all">
            {loading ? 'Dang dang nhap...' : 'Dang nhap'}
          </button>
        </form>

        <div className="mt-5 rounded-xl border border-white/10 bg-slate-900/40 p-3 text-xs text-slate-200">
          <p className="font-semibold mb-1">Tai khoan mau</p>
          <p>Admin: admin@storelens.vn / admin123</p>
          <p>Manager: manager@storelens.vn / manager123</p>
        </div>
      </div>
    </div>;
};
