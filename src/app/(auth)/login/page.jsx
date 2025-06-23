'use client'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../../../store/slices/authSlice'
import { useRouter, useSearchParams } from 'next/navigation'
import { Form, Button, Alert, Spinner } from 'react-bootstrap'
import Link from 'next/link'
import AuthLayout from '../../components/AuthLayout'
import Toast from 'react-bootstrap/Toast'

export default function LoginPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const params = useSearchParams()
  const { loading, error } = useSelector((state) => state.auth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [showRegisterToast, setShowRegisterToast] = useState(false)
  const [showLoginToast, setShowLoginToast] = useState(false)
  const [localError, setLocalError] = useState(null)

  useEffect(() => {
    const registerSuccess = sessionStorage.getItem('registerSuccess')
    if (registerSuccess === 'true') {
      setShowRegisterToast(true)
      sessionStorage.removeItem('registerSuccess')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(loginUser(form))
    if (loginUser.fulfilled.match(result)) {
      setShowLoginToast(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } else {
      setForm({ email: '', password: '' })
      setLocalError(result.payload?.message || 'Login gagal')
    }
  }

  return (
    <AuthLayout title="Login" subtitle="Silakan login untuk melanjutkan">
      {localError && (
        <Alert variant="danger">{localError}</Alert>
      )}

      <Form onSubmit={handleSubmit} autoComplete="off">
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Masukkan email"
            autoComplete="off"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Kata Sandi</Form.Label>
          <Form.Control
            type="password"
            placeholder="Masukkan kata sandi"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </Form.Group>

        <Button type="submit" className="w-100" variant="primary" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Masuk'}
        </Button>
      </Form>

      <div className="text-center mt-4">
        <span className="text-muted">Belum punya akun?</span><br />
        <Link href="/register" className="btn btn-outline-primary mt-2">
          Daftar Sekarang
        </Link>
      </div>

      <Toast show={showRegisterToast} onClose={() => setShowRegisterToast(false)} delay={3000} autohide bg="success" className="position-fixed bottom-0 start-50 translate-middle-x mb-4">
        <Toast.Header closeButton={false}>
          <strong className="me-auto">Berhasil</strong>
        </Toast.Header>
        <Toast.Body className="text-white">Registrasi berhasil, silakan login.</Toast.Body>
      </Toast>

      <Toast show={showLoginToast} onClose={() => setShowLoginToast(false)} delay={3000} autohide bg="success" className="position-fixed bottom-0 start-50 translate-middle-x mb-4">
        <Toast.Header closeButton={false}>
          <strong className="me-auto">Login</strong>
        </Toast.Header>
        <Toast.Body className="text-white">Login berhasil! Mengalihkan...</Toast.Body>
      </Toast>
    </AuthLayout>
  )
}
