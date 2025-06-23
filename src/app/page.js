'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'



export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect ke halaman login saat halaman root "/" diakses
    router.push('/login')
  }, [router])

  // Tidak menampilkan apapun karena langsung redirect
  return null
}
