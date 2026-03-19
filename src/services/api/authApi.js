const USERS_KEY = 'storelens.auth.users';
const SESSION_KEY = 'storelens.auth.session';
const seedUsers = [{
  id: 'user-admin-001',
  fullName: 'System Admin',
  email: 'admin@spacelens.vn',
  password: 'admin123',
  role: 'admin',
  storeId: 'STORE001'
}, {
  id: 'user-manager-001',
  fullName: 'Store Manager',
  email: 'manager@spacelens.vn',
  password: 'manager123',
  role: 'manager',
  storeId: 'STORE001'
}];

const emailAliases = {
  'admin@storelens.vn': 'admin@spacelens.vn',
  'manager@storelens.vn': 'manager@spacelens.vn'
};

const normalizeEmail = (email = '') => {
  const normalized = email.trim().toLowerCase();
  return emailAliases[normalized] || normalized;
};

const migrateLegacyUsers = users => {
  let changed = false;
  const migrated = users.map(user => {
    const nextEmail = normalizeEmail(user.email);
    if (nextEmail !== user.email) {
      changed = true;
      return {
        ...user,
        email: nextEmail
      };
    }
    return user;
  });
  if (changed) {
    localStorage.setItem(USERS_KEY, JSON.stringify(migrated));
  }
  return migrated;
};

const delay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));
const ensureUsers = () => {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
      return seedUsers;
    }
    return migrateLegacyUsers(parsed);
  } catch {
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }
};
const saveUsers = users => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};
const toPublicUser = user => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  storeId: user.storeId
});
export const getStoredSession = () => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
};
export const loginUser = async payload => {
  await delay();
  const users = ensureUsers();
  const normalizedInputEmail = normalizeEmail(payload.email);
  const found = users.find(user => normalizeEmail(user.email) === normalizedInputEmail && user.password === payload.password);
  if (!found) {
    throw new Error('Email hoac mat khau khong dung');
  }
  const session = {
    token: `mock-jwt-${Date.now()}`,
    user: toPublicUser(found)
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem('authToken', session.token);
  return session;
};
export const logoutUser = async () => {
  await delay(100);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('authToken');
};
export const getAllUsers = async () => {
  await delay(150);
  return ensureUsers().map(toPublicUser);
};
export const addUser = async (payload, actor) => {
  await delay();
  if (!actor || actor.role !== 'admin') {
    throw new Error('Chi admin moi co quyen tao tai khoan');
  }
  const users = ensureUsers();
  const normalizedInputEmail = normalizeEmail(payload.email);
  const duplicated = users.some(user => normalizeEmail(user.email) === normalizedInputEmail);
  if (duplicated) {
    throw new Error('Email da ton tai');
  }
  const created = {
    id: `user-${Date.now()}`,
    fullName: payload.fullName.trim(),
    email: normalizedInputEmail,
    password: payload.password,
    role: payload.role,
    storeId: payload.storeId
  };
  const next = [created, ...users];
  saveUsers(next);
  return toPublicUser(created);
};
