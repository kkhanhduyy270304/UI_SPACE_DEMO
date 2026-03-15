import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addUser, getAllUsers, getStoredSession, loginUser, logoutUser } from '../../services/api/authApi';
const storedSession = getStoredSession();
const initialState = {
  user: storedSession?.user || null,
  token: storedSession?.token || null,
  users: [],
  loading: false,
  userLoading: false,
  error: null
};
export const login = createAsyncThunk('auth/login', async payload => {
  const response = await loginUser(payload);
  return response;
});
export const signOut = createAsyncThunk('auth/logout', async () => {
  await logoutUser();
});
export const fetchUsers = createAsyncThunk('auth/fetchUsers', async () => {
  const users = await getAllUsers();
  return users;
});
export const registerUser = createAsyncThunk('auth/registerUser', async ({
  payload,
  actor
}) => {
  const user = await addUser(payload, actor);
  return user;
});
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: state => {
      state.error = null;
    },
    hydrateSession: (state, action) => {
      state.user = action.payload?.user || null;
      state.token = action.payload?.token || null;
    }
  },
  extraReducers: builder => {
    builder.addCase(login.pending, state => {
      state.loading = true;
      state.error = null;
    }).addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    }).addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Dang nhap that bai';
    }).addCase(signOut.fulfilled, state => {
      state.user = null;
      state.token = null;
      state.users = [];
      state.error = null;
    }).addCase(fetchUsers.pending, state => {
      state.userLoading = true;
      state.error = null;
    }).addCase(fetchUsers.fulfilled, (state, action) => {
      state.userLoading = false;
      state.users = action.payload;
    }).addCase(fetchUsers.rejected, (state, action) => {
      state.userLoading = false;
      state.error = action.error.message || 'Khong the tai danh sach nguoi dung';
    }).addCase(registerUser.pending, state => {
      state.userLoading = true;
      state.error = null;
    }).addCase(registerUser.fulfilled, (state, action) => {
      state.userLoading = false;
      state.users = [action.payload, ...state.users];
    }).addCase(registerUser.rejected, (state, action) => {
      state.userLoading = false;
      state.error = action.error.message || 'Khong the tao nguoi dung';
    });
  }
});
export const {
  clearAuthError,
  hydrateSession
} = authSlice.actions;
export default authSlice.reducer;
