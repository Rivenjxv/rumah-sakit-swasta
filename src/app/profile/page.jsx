'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
  Spinner
} from 'react-bootstrap'
import Sidebar from '../components/Sidebar'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [avatarBase64, setAvatarBase64] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/profile/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data?.email) setUser(data)
        else router.push('/login')
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false))
  }, [])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarBase64(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newPassword && newPassword !== confirmPassword) {
      toast.error('Kata sandi tidak cocok')
      return
    }

    const res = await fetch('/api/profile/update', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        newPassword: newPassword || undefined,
        avatarBase64: avatarBase64 || undefined
      })
    })

    const data = await res.json()

    if (res.ok) {
      toast.success(data.message || 'Berhasil diperbarui')
      setNewPassword('')
      setConfirmPassword('')
      setUser((prev) => ({
        ...prev,
        avatar: avatarBase64 || prev.avatar
      }))
  }}

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  const contentMarginLeft = sidebarCollapsed ? '70px' : '240px'

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onCollapseChange={setSidebarCollapsed} />
      <div
        style={{
          marginLeft: contentMarginLeft,
          width: '100%',
          transition: 'margin 0.3s ease'
        }}
      >
        <Container fluid className="py-5 px-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
          <h4 className="fw-bold text-dark mb-4">👤 Profil Pengguna</h4>
          <Row className="g-4">
            <Col md={4}>
              <Card className="p-4 shadow-sm border-0 rounded-4 bg-white">
              <div className="text-center">
                <Image
                  src={avatarBase64 || user?.avatar || '/avatar-default.png'}
                  width={120}
                  height={120}
                  roundedCircle
                  className="mb-3 border border-3 border-white shadow"
                />
                <Form.Group controlId="formAvatar" className="mb-2">
                  <Form.Control type="file" accept="image/*" className="form-control-sm" onChange={handleAvatarChange} />
                </Form.Group>
              </div>
            </Card>
            </Col>

            <Col md={8}>
              <Card className="p-4 shadow-sm border-0 rounded-4 bg-white">
                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Form.Group as={Col} md={6} controlId="formName">
                      <Form.Label className="fw-semibold small text-muted">Nama</Form.Label>
                      <Form.Control type="text" defaultValue={user?.name} disabled />
                    </Form.Group>
                    <Form.Group as={Col} md={6} controlId="formEmail">
                      <Form.Label className="fw-semibold small text-muted">Email</Form.Label>
                      <Form.Control type="email" defaultValue={user?.email} disabled />
                    </Form.Group>
                  </Row>

                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label className="fw-semibold small text-muted">Kata Sandi Baru</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="********"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formPassword2">
                    <Form.Label className="fw-semibold small text-muted">Ulangi Kata Sandi</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="********"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="px-4 py-2 rounded-pill fw-semibold shadow-sm"
                  >
                    💾 Simpan Perubahan
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </div>
  )
}
