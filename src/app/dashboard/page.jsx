'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Container, Row, Col, Card, Image, Dropdown, Spinner
} from 'react-bootstrap'
import Sidebar from '../components/Sidebar'
import PasienChart from '../components/dashboard/PasienChart'
import LineChartPasien from '../components/dashboard/LineChartPasien'
import ObatPieChart from '../components/dashboard/ObatPieChart'
import {
  FaUserInjured, FaUserMd, FaBed, FaCapsules, FaChartBar,
  FaCalendarAlt, FaPowerOff
} from 'react-icons/fa'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const router = useRouter()

  const [time, setTime] = useState(new Date())
    useEffect(() => {
      const interval = setInterval(() => setTime(new Date()), 1000)
      return () => clearInterval(interval)
    }, [])

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

  useEffect(() => {
    const bc = new BroadcastChannel('user-avatar')
    bc.onmessage = () => {
      fetch('/api/profile/me', { credentials: 'include' })
        .then(res => res.json())
        .then(data => setUser(data))
    }
    return () => bc.close()
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  const contentMarginLeft = sidebarCollapsed ? '70px' : '240px'

  const stats = [
    { title: 'Pasien Hari Ini', value: 87, icon: <FaUserInjured size={26} />, variant: 'primary' },
    { title: 'Dokter Aktif', value: 12, icon: <FaUserMd size={26} />, variant: 'success' },
    { title: 'Rawat Inap', value: 33, icon: <FaBed size={26} />, variant: 'info' },
    { title: 'Permintaan Obat', value: 21, icon: <FaCapsules size={26} />, variant: 'warning' },
  ]

  return (
    <div className="d-flex">
      <Sidebar onCollapseChange={setSidebarCollapsed} />

      <div style={{ marginLeft: contentMarginLeft, width: '100%', transition: 'margin 0.3s ease' }}>
        <Container fluid className="p-4 bg-light min-vh-100">

          {/* Header */}
        <Row className="bg-white rounded-4 shadow-sm px-4 py-3 mb-4 justify-content-between align-items-center">

        {/* Bagian Kiri: Breadcrumb + Judul */}
        <Col>
          {/* Breadcrumb */}
          <div className="mb-2">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-white px-0 py-0 mb-0 small">
                <li className="breadcrumb-item">
                  <a href="/" className="text-decoration-none text-primary fw-semibold">Home</a>
                </li>
                <li className="breadcrumb-item active text-secondary" aria-current="page">
                  Dashboard
                </li>
              </ol>
            </nav>
          </div>

          {/* Judul */}
          <h4 className="fw-bold d-flex align-items-center mb-1">
            <FaUserMd className="me-2 text-primary" />
            Dashboard RS MMC
          </h4>
          <p className="text-muted mb-0">
            Selamat datang, <span className="fw-semibold">{user?.name}</span>{' '}
            <span className="text-uppercase">{user?.position}</span>
          </p>
        </Col>

        {/* Bagian Kanan: Waktu + Profil */}
        <Col xs="auto" className="d-flex align-items-center gap-3">

          {/* Waktu */}
          <div className="d-flex align-items-center bg-light rounded-pill px-3 py-2 shadow-sm small text-muted font-monospace">
            <FaCalendarAlt className="me-2 text-secondary" />
            <span>
              {time.toLocaleDateString('id-ID', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}{' '}
              | {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          {/* Profile */}
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" className="d-flex align-items-center px-3 py-2 rounded-pill shadow-sm border">
              <Image
                src={user?.avatar || '/avatar-default.png'}
                width={32}
                height={32}
                roundedCircle
                className="me-2"
              />
              <span className="fw-semibold text-dark">{user?.name}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="shadow border-0 rounded-3 py-2">
              <Dropdown.Item
                href="/profile"
                className="d-flex align-items-center gap-2 px-3 py-2 text-dark"
              >
                <FaUserMd className="text-primary" />
                <span className="fw-medium">Profil</span>
              </Dropdown.Item>
              <Dropdown.Divider className="my-1" />
              <Dropdown.Item
                href="/logout"
                className="d-flex align-items-center gap-2 px-3 py-2 text-danger"
              >
                <FaPowerOff className="text-danger" />
                <span className="fw-medium">Keluar</span>
              </Dropdown.Item>
            </Dropdown.Menu>

          </Dropdown>
        </Col>
      </Row>

          {/* Statistik Kartu */}
          <Row className="g-4 mb-4">
            {stats.map((stat, idx) => (
              <Col key={idx} xs={12} md={6} lg={3}>
                <Card className={`bg-${stat.variant} text-white border-0 shadow-sm rounded-4 h-100 stat-card`}>
                  <Card.Body className="d-flex align-items-center gap-3 py-3 px-4">
                    <div className="icon-circle">{stat.icon}</div>
                    <div>
                      <div className="small text-white-50">{stat.title}</div>
                      <div className="h5 fw-bold mb-0">{stat.value}</div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Chart Section */}
          <Row className="gy-4">
            <Col lg={6}>
              <Card className="shadow-sm border-0 rounded-4">
                <Card.Header className="bg-white fw-bold d-flex align-items-center rounded-top-4 border-0 px-4 py-3">
                  <FaChartBar className="me-2 text-primary" />
                  Statistik Pasien Mingguan
                </Card.Header>
                <Card.Body className="px-4 py-3">
                  <PasienChart />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="shadow-sm border-0 rounded-4">
                <Card.Header className="bg-white fw-bold d-flex align-items-center rounded-top-4 border-0 px-4 py-3">
                  <FaChartBar className="me-2 text-primary" />
                  Tren Pasien Bulanan
                </Card.Header>
                <Card.Body className="px-4 py-3">
                  <LineChartPasien />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={12}>
              <Card className="shadow-sm border-0 rounded-4">
                <Card.Header className="bg-white fw-bold d-flex align-items-center rounded-top-4 border-0 px-4 py-3">
                  <FaChartBar className="me-2 text-primary" />
                  Distribusi Obat
                </Card.Header>
                <Card.Body className="px-4 py-3">
                  <ObatPieChart />
                </Card.Body>
              </Card>
            </Col>
          </Row>

        </Container>

        <style jsx>{`
          .icon-circle {
            width: 45px;
            height: 45px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.2);
          }
          .stat-card:hover {
            transform: translateY(-2px);
            transition: 0.2s ease;
          }
        `}</style>
      </div>
    </div>
  )
}