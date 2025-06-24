import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const loginUser = createAsyncThunk('auth/loginUser', async (formData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_QUILVIAN}/Auth/login`, formData)
    const token = res.data.token

    // ✅ Simpan token ke cookie dan localStorage
    document.cookie = `token=${token}; path=/; max-age=172800; SameSite=Lax`
    localStorage.setItem('token', token)

    console.log('Login sukses, token:', token)
    console.log('localStorage token (set):', localStorage.getItem('token')) // 🔍 Debug tambahan

    return {
      message: res.data.message,
      email: res.data.email,
      token: token
    }
  } catch (err) {
    console.error('Login error:', err)
    return rejectWithValue(err.response?.data?.message || 'Login gagal')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null },
  reducers: {
    setUserFromCookie: (state, action) => {
      state.user = {
        name: 'User dari Cookie',
        token: action.payload,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setUserFromCookie } = authSlice.actions
export default authSlice.reducer
