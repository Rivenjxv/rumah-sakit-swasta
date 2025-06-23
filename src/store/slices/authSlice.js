import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const loginUser = createAsyncThunk('auth/loginUser', async (formData, { rejectWithValue }) => {
  try {
    const res = await axios.post('/api/auth/login', formData, {
      withCredentials: true // ✅ PENTING: agar cookie token disimpan browser
    })

    return res.data.user // ✅ Tidak perlu handle token manual, server yang atur lewat cookie
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login gagal')
  }
})



export const registerUser = createAsyncThunk('auth/registerUser', async (payload, { rejectWithValue }) => {
  try {
    const res = await axios.post('/api/auth/register', payload)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: 'Registrasi gagal' })
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
      .addCase(loginUser.pending, (state) => { state.loading = true })
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