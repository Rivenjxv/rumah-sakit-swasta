// pages/logout.js
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    axios.post('/api/auth/logout', {}, { withCredentials: true })
      .finally(() => {
        router.replace('/login')
      })
  }, [router])

  return null
}

