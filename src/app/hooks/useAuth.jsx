'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUserFromCookie } from '../../store/slices/authSlice'

export default function useAuth() {
  const dispatch = useDispatch()

  useEffect(() => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('token='))
    const token = cookie?.split('=')[1]
    if (token) {
      dispatch(setUserFromCookie(token))
    }
  }, [dispatch])
}