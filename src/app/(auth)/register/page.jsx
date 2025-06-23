'use client'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { registerUser } from '../../../store/slices/authSlice'
import { useRouter } from 'next/navigation'
import { Form, Button, Spinner, Alert } from 'react-bootstrap'
import Link from 'next/link'
import AuthLayout from '../../components/AuthLayout'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await dispatch(registerUser(form))
    setLoading(false)
    if (registerUser.fulfilled.match(result)) {
    sessionStorage.setItem('registerSuccess', 'true')
    router.push('/login')
    } else {
    setError(result.payload?.message || 'Gagal mendaftar')
    }
  }

  return (
    <AuthLayout title="Daftar Akun" subtitle="Buat akun baru untuk melanjutkan">
      {error && <Alert variant="danger">{String(error)}</Alert>}
      <Form onSubmit={handleSubmit} autoComplete="off">
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Nama Lengkap</Form.Label>
          <Form.Control
            type="text"
            autoComplete="off"
            placeholder="Masukkan nama"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            autoComplete="off"
            placeholder="Masukkan email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Kata Sandi</Form.Label>
          <Form.Control
            type="password"
            autoComplete="new-password"
            placeholder="Masukkan kata sandi"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </Form.Group>

        <Button type="submit" className="w-100" variant="success" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Daftar'}
        </Button>
      </Form>

      <div className="text-center mt-4">
        <span className="text-muted">Sudah punya akun?</span><br />
        <Link href="/login" className="btn btn-outline-secondary mt-2">
          Kembali ke Login
        </Link>
      </div>
    </AuthLayout>
  )
}