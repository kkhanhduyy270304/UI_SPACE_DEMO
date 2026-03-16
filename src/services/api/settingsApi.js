const SETTINGS_KEY = 'storelens.settings';
const USERS_KEY = 'storelens.auth.users';
const SESSION_KEY = 'storelens.auth.session';

const delay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

const defaults = {
  profile: {
    avatarUrl: '',
    fullName: '',
    email: '',
    role: 'staff'
  },
  storeConfig: {
    businessName: 'StoreLens Flagship',
    address: '123 Nguyen Hue, Ho Chi Minh City',
    contactPhone: '028-7300-8899',
    openingTime: '08:00',
    closingTime: '22:00',
    dwellThreshold: 20
  },
  system: {
    primaryApiKey: '',
    backupApiKey: '',
    aiSensitivity: 72,
    darkMode: false,
    emailNotifications: true
  },
  notifications: {
    zaloWebhook: '',
    smsWebhook: '',
    reportEmail: '',
    reportDays: ['Mon', 'Thu'],
    reportTime: '08:30'
  }
};

const readSettings = () => {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) {
    return {
      ...defaults,
      profile: { ...defaults.profile }
    };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      ...defaults,
      ...parsed,
      profile: {
        ...defaults.profile,
        ...(parsed.profile || {})
      },
      storeConfig: {
        ...defaults.storeConfig,
        ...(parsed.storeConfig || {})
      },
      system: {
        ...defaults.system,
        ...(parsed.system || {})
      },
      notifications: {
        ...defaults.notifications,
        ...(parsed.notifications || {})
      }
    };
  } catch {
    return {
      ...defaults,
      profile: { ...defaults.profile }
    };
  }
};

const persistSettings = next => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
};

const updateAuthStorageProfile = profile => {
  const sessionRaw = localStorage.getItem(SESSION_KEY);
  if (sessionRaw) {
    try {
      const session = JSON.parse(sessionRaw);
      if (session?.user) {
        const nextSession = {
          ...session,
          user: {
            ...session.user,
            fullName: profile.fullName,
            email: profile.email
          }
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
      }
    } catch {
      // Keep current session data if parsing fails.
    }
  }

  const usersRaw = localStorage.getItem(USERS_KEY);
  if (usersRaw) {
    try {
      const users = JSON.parse(usersRaw);
      if (Array.isArray(users)) {
        const nextUsers = users.map(item => {
          if (item.email === profile.email || item.id === profile.id) {
            return {
              ...item,
              fullName: profile.fullName,
              email: profile.email
            };
          }
          return item;
        });
        localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
      }
    } catch {
      // Keep current users data if parsing fails.
    }
  }
};

export const fetchSettings = async user => {
  await delay(150);
  const current = readSettings();
  const profile = {
    ...current.profile,
    id: user?.id,
    fullName: user?.fullName || current.profile.fullName || 'Unknown User',
    email: user?.email || current.profile.email || '',
    role: user?.role || current.profile.role || 'staff'
  };
  const next = {
    ...current,
    profile
  };
  persistSettings(next);
  return next;
};

export const saveUserSettings = async payload => {
  await delay();
  const current = readSettings();
  const next = {
    ...current,
    profile: {
      ...current.profile,
      ...payload
    }
  };
  persistSettings(next);
  updateAuthStorageProfile(next.profile);
  return next.profile;
};

export const saveStoreSettings = async payload => {
  await delay();
  const current = readSettings();
  const next = {
    ...current,
    storeConfig: {
      ...current.storeConfig,
      ...payload
    }
  };
  persistSettings(next);
  return next.storeConfig;
};

export const saveSystemSettings = async payload => {
  await delay();
  const current = readSettings();
  const next = {
    ...current,
    system: {
      ...current.system,
      ...payload
    }
  };
  persistSettings(next);
  return next.system;
};

export const saveNotificationSettings = async payload => {
  await delay();
  const current = readSettings();
  const next = {
    ...current,
    notifications: {
      ...current.notifications,
      ...payload
    }
  };
  persistSettings(next);
  return next.notifications;
};

export const updatePassword = async ({ currentPassword, newPassword }) => {
  await delay(200);

  if (!currentPassword || !newPassword) {
    throw new Error('Missing password information');
  }

  return {
    success: true
  };
};

export const resetSystemSettings = async () => {
  await delay(200);
  const current = readSettings();
  const next = {
    ...current,
    system: { ...defaults.system },
    notifications: { ...defaults.notifications }
  };
  persistSettings(next);
  return next;
};

export const resetBusinessConfiguration = async () => {
  await delay(200);
  const current = readSettings();
  const next = {
    ...current,
    storeConfig: { ...defaults.storeConfig }
  };
  persistSettings(next);
  return next;
};
