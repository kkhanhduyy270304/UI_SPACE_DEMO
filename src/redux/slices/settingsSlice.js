import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchSettings,
  resetBusinessConfiguration,
  resetSystemSettings,
  saveNotificationSettings,
  saveStoreSettings,
  saveSystemSettings,
  saveUserSettings,
  updatePassword
} from '../../services/api/settingsApi';

const initialState = {
  profile: null,
  storeConfig: null,
  system: null,
  notifications: null,
  loading: false,
  saving: false,
  passwordSaving: false,
  error: null,
  successMessage: null
};

export const loadSettings = createAsyncThunk('settings/loadSettings', async user => {
  return fetchSettings(user);
});

export const updateUserSettings = createAsyncThunk('settings/updateUserSettings', async payload => {
  return saveUserSettings(payload);
});

export const updateStoreSettings = createAsyncThunk('settings/updateStoreSettings', async payload => {
  return saveStoreSettings(payload);
});

export const updateSystemSettings = createAsyncThunk('settings/updateSystemSettings', async payload => {
  return saveSystemSettings(payload);
});

export const updateNotificationSettings = createAsyncThunk('settings/updateNotificationSettings', async payload => {
  return saveNotificationSettings(payload);
});

export const changePassword = createAsyncThunk('settings/changePassword', async payload => {
  return updatePassword(payload);
});

export const resetSystemConfig = createAsyncThunk('settings/resetSystemConfig', async () => {
  return resetSystemSettings();
});

export const resetStoreConfig = createAsyncThunk('settings/resetStoreConfig', async () => {
  return resetBusinessConfiguration();
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearSettingsState: state => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loadSettings.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        state.storeConfig = action.payload.storeConfig;
        state.system = action.payload.system;
        state.notifications = action.payload.notifications;
      })
      .addCase(loadSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Cannot load settings';
      })
      .addCase(updateUserSettings.pending, state => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateUserSettings.fulfilled, (state, action) => {
        state.saving = false;
        state.profile = {
          ...state.profile,
          ...action.payload
        };
        state.successMessage = 'Profile updated successfully';
      })
      .addCase(updateUserSettings.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || 'Cannot update profile';
      })
      .addCase(updateStoreSettings.pending, state => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateStoreSettings.fulfilled, (state, action) => {
        state.saving = false;
        state.storeConfig = action.payload;
        state.successMessage = 'Store configuration updated';
      })
      .addCase(updateStoreSettings.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || 'Cannot update store configuration';
      })
      .addCase(updateSystemSettings.pending, state => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateSystemSettings.fulfilled, (state, action) => {
        state.saving = false;
        state.system = action.payload;
        state.successMessage = 'System settings updated';
      })
      .addCase(updateSystemSettings.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || 'Cannot update system settings';
      })
      .addCase(updateNotificationSettings.pending, state => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.saving = false;
        state.notifications = action.payload;
        state.successMessage = 'Notification settings updated';
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || 'Cannot update notification settings';
      })
      .addCase(changePassword.pending, state => {
        state.passwordSaving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(changePassword.fulfilled, state => {
        state.passwordSaving = false;
        state.successMessage = 'Password changed successfully';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.passwordSaving = false;
        state.error = action.error.message || 'Cannot change password';
      })
      .addCase(resetSystemConfig.fulfilled, (state, action) => {
        state.system = action.payload.system;
        state.notifications = action.payload.notifications;
        state.successMessage = 'System and notifications reset to default';
      })
      .addCase(resetStoreConfig.fulfilled, (state, action) => {
        state.storeConfig = action.payload.storeConfig;
        state.successMessage = 'Store configuration reset to default';
      });
  }
});

export const { clearSettingsState } = settingsSlice.actions;
export default settingsSlice.reducer;
