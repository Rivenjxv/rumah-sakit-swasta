'use client'
import Image from 'next/image'
import { Card } from 'react-bootstrap'
import { useEffect } from 'react'

export default function AuthLayout({ title, subtitle, children }) {
  useEffect(() => {
    const font = document.createElement('link')
    font.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    font.rel = 'stylesheet'
    document.head.appendChild(font)
    document.body.style.fontFamily = `'Inter', sans-serif`
    return () => {
      document.body.style.fontFamily = ''
    }
  }, [])

  return (
    <div
      style={{
        background: 'linear-gradient(to right, #f8fbff, #e0f7fa)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem'
      }}
    >
      {/* Gambar kiri */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          minWidth: '300px'
        }}
      >
        <Image
          src="/mmc-pict.png"
          alt="Ilustrasi Rumah Sakit"
          width={500}
          height={400}
          style={{ objectFit: 'contain', maxWidth: '90%', height: 'auto' }}
        />
      </div>

      {/* Form kanan */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          padding: '1rem',
          minWidth: '320px'
        }}
      >
        <Card
          className="shadow-lg border-0"
          style={{
            width: '100%',
            maxWidth: '460px',
            borderRadius: '1.25rem',
            overflow: 'hidden',
            background: '#fff',
            transition: 'transform 0.2s ease-in-out'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.01)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        >
          <div
            style={{
              background: 'linear-gradient(to right, #00c6ff, #0072ff)',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              color: '#fff'
            }}
          >
            <Image src="/Logo-MMC.png" alt="Logo RS" width={64} height={64} />
            <h3 className="mt-2 mb-0 fw-bold" style={{ fontFamily: 'Inter, sans-serif' }}>
              Metropolitan Medical Centre
            </h3>
            <p className="text-light mb-0">Sistem Informasi Rumah Sakit</p>
          </div>
          <Card.Body className="p-4" style={{ padding: '1rem 2rem' }}>
            <h4 className="text-center fw-semibold mb-2 text-primary">{title}</h4>
            <p className="text-muted text-center mb-4" style={{ fontSize: '0.95rem' }}>{subtitle}</p>
            {children}
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}
