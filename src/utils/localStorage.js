const KEYS = {
  TRANSACTIONS: 'expense_tracker_transactions',
  USERS: 'expense_tracker_users',
  CURRENT_USER: 'expense_tracker_current_user',
  SETTINGS: 'expense_tracker_settings',
  PROFILE: 'expense_tracker_profile',
};

export const getTransactions = () => {
  try {
    const data = localStorage.getItem(KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveTransactions = (transactions) => {
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const getUsers = () => {
  try {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveUsers = (users) => {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
};

export const getCurrentUser = () => {
  try {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const saveCurrentUser = (user) => {
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
};

export const logoutUser = () => {
  localStorage.removeItem(KEYS.CURRENT_USER);
};

export const getSettings = () => {
  try {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : { currency: 'INR', theme: 'dark' };
  } catch {
    return { currency: 'INR', theme: 'dark' };
  }
};

export const saveSettings = (settings) => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

export const getTheme = () => {
  try {
    const data = localStorage.getItem(KEYS.SETTINGS);
    const settings = data ? JSON.parse(data) : { currency: 'INR', theme: 'dark' };
    return settings.theme || 'dark';
  } catch {
    return 'dark';
  }
};

export const saveTheme = (theme) => {
  const settings = getSettings();
  settings.theme = theme;
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

export const getProfile = () => {
  try {
    const data = localStorage.getItem(KEYS.PROFILE);
    return data
      ? JSON.parse(data)
      : {
          name: '',
          email: '',
          phone: '',
          avatar: '',
        };
  } catch {
    return { name: '', email: '', phone: '', avatar: '' };
  }
};

export const saveProfile = (profile) => {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
};

export const clearAllData = () => {
  localStorage.removeItem(KEYS.TRANSACTIONS);
};