import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Hapus token dari cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

    // Redirect ke halaman login
    router.replace('/login')
  }, [router])

  return null
}
