import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Building2,
  Camera,
  KeyRound,
  Lock,
  Mail,
  Save,
  Shield,
  SlidersHorizontal,
  User,
  Wrench,
  X
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { hydrateSession } from '../../redux/slices/authSlice';
import {
  changePassword,
  clearSettingsState,
  loadSettings,
  resetStoreConfig,
  resetSystemConfig,
  updateNotificationSettings,
  updateStoreSettings,
  updateSystemSettings,
  updateUserSettings
} from '../../redux/slices/settingsSlice';
import { getStoredSession } from '../../services/api/authApi';

const DAY_OPTIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ToggleSwitch = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm text-slate-200">{label}</span>
      <button
        type="button"
        aria-pressed={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-indigo-500' : 'bg-slate-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  );
};

const SectionCard = ({ icon, title, children }) => {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6">
      <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
};

const inputClassName =
  'mt-1 w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500';

const labelClassName = 'text-xs font-semibold text-slate-400 uppercase tracking-wider';

const ConfirmationModal = ({ open, title, description, onCancel, onConfirm, confirmLabel = 'Confirm' }) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-rose-400/30 bg-slate-900/95 p-6 text-slate-100 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-rose-300">{title}</h2>
            <p className="mt-2 text-sm text-slate-300">{description}</p>
          </div>
          <button type="button" onClick={onCancel} className="text-slate-300 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const ChangePasswordModal = ({ open, onCancel, onSubmit, saving }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleSubmit = async event => {
    event.preventDefault();

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Confirm password does not match');
      return;
    }

    setError('');
    const ok = await onSubmit({ currentPassword, newPassword });
    if (ok) {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/20 bg-slate-900/95 p-6 text-slate-100 shadow-2xl">
        <div className="flex items-center justify-between gap-4 mb-5">
          <h2 className="text-xl font-semibold">Change Password</h2>
          <button type="button" onClick={onCancel} className="text-slate-300 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClassName}>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={event => setCurrentPassword(event.target.value)}
              className={inputClassName}
              required
            />
          </div>

          <div>
            <label className={labelClassName}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={event => setNewPassword(event.target.value)}
              className={inputClassName}
              required
            />
          </div>

          <div>
            <label className={labelClassName}>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={event => setConfirmPassword(event.target.value)}
              className={inputClassName}
              required
            />
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const Settings = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { profile, storeConfig, system, notifications, loading, saving, passwordSaving, error, successMessage } = useAppSelector(
    state => state.settings
  );

  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState('profile');

  const availableTabs = useMemo(() => {
    const baseTabs = [
      { id: 'profile', label: 'Profile', icon: <User size={16} /> },
      { id: 'security', label: 'Security', icon: <Lock size={16} /> },
      { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> }
    ];

    if (isAdmin) {
      baseTabs.splice(2, 0, { id: 'store', label: 'Store Config', icon: <Building2 size={16} /> });
      baseTabs.splice(3, 0, { id: 'system', label: 'System', icon: <Wrench size={16} /> });
    }

    return baseTabs;
  }, [isAdmin]);

  const [profileForm, setProfileForm] = useState({
    avatarUrl: '',
    fullName: '',
    email: '',
    role: 'staff'
  });

  const [storeForm, setStoreForm] = useState({
    businessName: '',
    address: '',
    contactPhone: '',
    openingTime: '08:00',
    closingTime: '22:00',
    dwellThreshold: 20
  });

  const [systemForm, setSystemForm] = useState({
    primaryApiKey: '',
    backupApiKey: '',
    aiSensitivity: 72,
    darkMode: false,
    emailNotifications: true
  });

  const [notificationForm, setNotificationForm] = useState({
    zaloWebhook: '',
    smsWebhook: '',
    reportEmail: '',
    reportDays: ['Mon', 'Thu'],
    reportTime: '08:30'
  });

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    dispatch(loadSettings(user));

    return () => {
      dispatch(clearSettingsState());
    };
  }, [dispatch, user]);

  useEffect(() => {
    if (profile) {
      setProfileForm(profile);
    }
  }, [profile]);

  useEffect(() => {
    if (storeConfig) {
      setStoreForm(storeConfig);
    }
  }, [storeConfig]);

  useEffect(() => {
    if (system) {
      setSystemForm(system);
    }
  }, [system]);

  useEffect(() => {
    if (notifications) {
      setNotificationForm(notifications);
    }
  }, [notifications]);

  useEffect(() => {
    if (!availableTabs.some(item => item.id === activeTab)) {
      setActiveTab('profile');
    }
  }, [activeTab, availableTabs]);

  const onSaveProfile = async event => {
    event.preventDefault();
    const result = await dispatch(updateUserSettings({ ...profileForm, id: user?.id }));
    if (!updateUserSettings.rejected.match(result)) {
      dispatch(hydrateSession(getStoredSession()));
    }
  };

  const onSaveStore = async event => {
    event.preventDefault();
    await dispatch(updateStoreSettings({ ...storeForm }));
  };

  const onSaveSystem = async event => {
    event.preventDefault();
    await dispatch(updateSystemSettings({ ...systemForm }));
  };

  const onSaveNotifications = async event => {
    event.preventDefault();
    await dispatch(updateNotificationSettings({ ...notificationForm }));
  };

  const onChangePassword = async payload => {
    const result = await dispatch(changePassword(payload));
    return !changePassword.rejected.match(result);
  };

  const toggleReportDay = day => {
    setNotificationForm(prev => {
      const exists = prev.reportDays.includes(day);
      return {
        ...prev,
        reportDays: exists ? prev.reportDays.filter(item => item !== day) : [...prev.reportDays, day]
      };
    });
  };

  if (loading && !profile) {
    return <p className="text-slate-200">Loading settings...</p>;
  }

  return (
    <div className="min-h-[70vh] rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.25),_rgba(15,23,42,0.95)_55%)] p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100">Settings Center</h1>
        <p className="mt-2 text-sm text-slate-300">
          Manage profile, security, system behavior, and integration settings for your StoreLens workspace.
        </p>
      </div>

      {(error || successMessage) && (
        <div className="mb-4">
          {error && <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</div>}
          {successMessage && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-300">{successMessage}</div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-5">
        <aside className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-3 h-max">
          <div className="space-y-1">
            {availableTabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full rounded-xl px-3 py-2.5 text-left text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-500/30 text-indigo-100 border border-indigo-400/30'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        <section>
          {activeTab === 'profile' && (
            <SectionCard icon={<User size={18} className="text-indigo-300" />} title="Profile Information">
              <form onSubmit={onSaveProfile} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-full border border-white/20 bg-slate-800/80 flex items-center justify-center overflow-hidden">
                    {profileForm.avatarUrl ? (
                      <img src={profileForm.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <User className="text-slate-400" size={30} />
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-black/50 text-center text-[11px] text-slate-100 py-1">Edit</span>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClassName}>Avatar URL</label>
                      <input
                        value={profileForm.avatarUrl || ''}
                        onChange={event => setProfileForm(prev => ({ ...prev, avatarUrl: event.target.value }))}
                        className={inputClassName}
                      />
                    </div>
                    <div>
                      <label className={labelClassName}>Role</label>
                      <div className="mt-1 inline-flex rounded-full border border-indigo-400/35 bg-indigo-500/20 px-3 py-2 text-xs font-semibold uppercase text-indigo-200">
                        {profileForm.role}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClassName}>Full Name</label>
                    <input
                      value={profileForm.fullName || ''}
                      onChange={event => setProfileForm(prev => ({ ...prev, fullName: event.target.value }))}
                      className={inputClassName}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClassName}>Email</label>
                    <input
                      value={profileForm.email || ''}
                      onChange={event => setProfileForm(prev => ({ ...prev, email: event.target.value }))}
                      className={inputClassName}
                      readOnly={profileForm.role === 'staff'}
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPasswordOpen(true)}
                    className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                  >
                    Change Password
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                  >
                    <Save size={15} />
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </SectionCard>
          )}

          {activeTab === 'security' && (
            <SectionCard icon={<Shield size={18} className="text-indigo-300" />} title="Security Controls">
              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
                  <p className="text-sm text-slate-200">Password and account protection settings are managed here.</p>
                  <button
                    type="button"
                    onClick={() => setPasswordOpen(true)}
                    className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Open Change Password Modal
                  </button>
                </div>
              </div>
            </SectionCard>
          )}

          {activeTab === 'store' && isAdmin && (
            <SectionCard icon={<Building2 size={18} className="text-indigo-300" />} title="Store / Business Configuration">
              <form onSubmit={onSaveStore} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClassName}>Business Name</label>
                    <input
                      value={storeForm.businessName || ''}
                      onChange={event => setStoreForm(prev => ({ ...prev, businessName: event.target.value }))}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className={labelClassName}>Contact</label>
                    <input
                      value={storeForm.contactPhone || ''}
                      onChange={event => setStoreForm(prev => ({ ...prev, contactPhone: event.target.value }))}
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClassName}>Address</label>
                  <input
                    value={storeForm.address || ''}
                    onChange={event => setStoreForm(prev => ({ ...prev, address: event.target.value }))}
                    className={inputClassName}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClassName}>Opening Time</label>
                    <input
                      type="time"
                      value={storeForm.openingTime || '08:00'}
                      onChange={event => setStoreForm(prev => ({ ...prev, openingTime: event.target.value }))}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className={labelClassName}>Closing Time</label>
                    <input
                      type="time"
                      value={storeForm.closingTime || '22:00'}
                      onChange={event => setStoreForm(prev => ({ ...prev, closingTime: event.target.value }))}
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClassName}>Dwell Time Threshold: {storeForm.dwellThreshold}s</label>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={storeForm.dwellThreshold || 20}
                    onChange={event =>
                      setStoreForm(prev => ({
                        ...prev,
                        dwellThreshold: Number(event.target.value)
                      }))
                    }
                    className="mt-3 w-full accent-indigo-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                  >
                    <Save size={15} />
                    {saving ? 'Saving...' : 'Save Store Config'}
                  </button>
                </div>
              </form>
            </SectionCard>
          )}

          {activeTab === 'system' && isAdmin && (
            <>
              <SectionCard icon={<Wrench size={18} className="text-indigo-300" />} title="System Settings">
                <form onSubmit={onSaveSystem} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClassName}>Primary API Key</label>
                      <div className="relative">
                        <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          value={systemForm.primaryApiKey || ''}
                          onChange={event => setSystemForm(prev => ({ ...prev, primaryApiKey: event.target.value }))}
                          className={`${inputClassName} pl-10`}
                          placeholder="sk-live-..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClassName}>Backup API Key</label>
                      <div className="relative">
                        <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          value={systemForm.backupApiKey || ''}
                          onChange={event => setSystemForm(prev => ({ ...prev, backupApiKey: event.target.value }))}
                          className={`${inputClassName} pl-10`}
                          placeholder="sk-backup-..."
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClassName}>Global AI Sensitivity: {systemForm.aiSensitivity}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={systemForm.aiSensitivity || 72}
                      onChange={event =>
                        setSystemForm(prev => ({
                          ...prev,
                          aiSensitivity: Number(event.target.value)
                        }))
                      }
                      className="mt-3 w-full accent-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ToggleSwitch
                      checked={Boolean(systemForm.darkMode)}
                      onChange={value => setSystemForm(prev => ({ ...prev, darkMode: value }))}
                      label="Dark Mode"
                    />
                    <ToggleSwitch
                      checked={Boolean(systemForm.emailNotifications)}
                      onChange={value => setSystemForm(prev => ({ ...prev, emailNotifications: value }))}
                      label="Email Notifications"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                    >
                      <Save size={15} />
                      {saving ? 'Saving...' : 'Save System Settings'}
                    </button>
                  </div>
                </form>
              </SectionCard>

              <SectionCard icon={<AlertTriangle size={18} className="text-rose-400" />} title="Danger Zone">
                <p className="text-sm text-slate-300 mb-4">Dangerous actions below can reset key configurations. Handle with care.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmAction('reset-system')}
                    className="rounded-lg border border-rose-500/40 px-4 py-2 text-sm font-medium text-rose-300 hover:bg-rose-500/10"
                  >
                    Reset System + Notifications
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmAction('reset-store')}
                    className="rounded-lg border border-rose-500/40 px-4 py-2 text-sm font-medium text-rose-300 hover:bg-rose-500/10"
                  >
                    Reset Store Config
                  </button>
                </div>
              </SectionCard>
            </>
          )}

          {activeTab === 'notifications' && (
            <SectionCard icon={<Bell size={18} className="text-indigo-300" />} title="Integration & Alerts">
              <form onSubmit={onSaveNotifications} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClassName}>Zalo Webhook URL</label>
                    <div className="relative">
                      <Camera size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={notificationForm.zaloWebhook || ''}
                        onChange={event => setNotificationForm(prev => ({ ...prev, zaloWebhook: event.target.value }))}
                        className={`${inputClassName} pl-10`}
                        placeholder="https://openapi.zalo.me/..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClassName}>SMS Webhook URL</label>
                    <div className="relative">
                      <SlidersHorizontal size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={notificationForm.smsWebhook || ''}
                        onChange={event => setNotificationForm(prev => ({ ...prev, smsWebhook: event.target.value }))}
                        className={`${inputClassName} pl-10`}
                        placeholder="https://sms-provider/webhook"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClassName}>Report Email</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={notificationForm.reportEmail || ''}
                        onChange={event => setNotificationForm(prev => ({ ...prev, reportEmail: event.target.value }))}
                        className={`${inputClassName} pl-10`}
                        placeholder="ops@storelens.vn"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClassName}>Report Time</label>
                    <input
                      type="time"
                      value={notificationForm.reportTime || '08:30'}
                      onChange={event => setNotificationForm(prev => ({ ...prev, reportTime: event.target.value }))}
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClassName}>Report Days</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {DAY_OPTIONS.map(day => {
                      const active = notificationForm.reportDays?.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleReportDay(day)}
                          className={`rounded-full px-3 py-1.5 text-xs border transition-colors ${
                            active
                              ? 'border-indigo-400/40 bg-indigo-500/25 text-indigo-100'
                              : 'border-slate-600 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                  >
                    <Save size={15} />
                    {saving ? 'Saving...' : 'Save Notifications'}
                  </button>
                </div>
              </form>
            </SectionCard>
          )}
        </section>
      </div>

      <ChangePasswordModal
        open={passwordOpen}
        onCancel={() => setPasswordOpen(false)}
        onSubmit={onChangePassword}
        saving={passwordSaving}
      />

      <ConfirmationModal
        open={Boolean(confirmAction)}
        title={confirmAction === 'reset-store' ? 'Reset Store Configuration?' : 'Reset System & Notifications?'}
        description={
          confirmAction === 'reset-store'
            ? 'This action will reset business information, working hours, and dwell threshold to defaults.'
            : 'This action will reset API keys, AI sensitivity, theme toggles, and alert configuration to defaults.'
        }
        onCancel={() => setConfirmAction(null)}
        onConfirm={async () => {
          if (confirmAction === 'reset-store') {
            await dispatch(resetStoreConfig());
          } else if (confirmAction === 'reset-system') {
            await dispatch(resetSystemConfig());
          }
          setConfirmAction(null);
        }}
        confirmLabel="Yes, Confirm"
      />
    </div>
  );
};
