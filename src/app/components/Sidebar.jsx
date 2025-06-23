'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  FaBars,
  FaUser,
  FaElementor,
  FaGraduationCap
} from 'react-icons/fa'
import { MdDashboard } from 'react-icons/md'

export default function Sidebar({ onCollapseChange }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768
      setCollapsed(isMobile)
      onCollapseChange?.(isMobile)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    onCollapseChange?.(collapsed)
  }, [collapsed])

  const toggle = () => {
    setCollapsed(prev => {
      const newValue = !prev
      setTimeout(() => {
        onCollapseChange?.(newValue)
      }, 0)
      return newValue
    })
  }

  return (
    <aside
      style={{
        width: collapsed ? '70px' : '240px',
        height: '100vh',
        background: '#1a2e66',
        borderRight: '1px solid #1f3263',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        boxShadow: '4px 0 10px rgba(0,0,0,0.15)',
        transition: 'width 0.25s ease-in-out',
        fontFamily: `'Segoe UI', sans-serif`,
        overflow: 'hidden',
        color: '#d0d6e2'
      }}
    >
      <div className="d-flex align-items-center justify-content-between px-3 py-3">
        {!collapsed && <h5 className="fw-bold text-white mb-0 d-flex align-items-center fs-6 gap-2">
        <img src="/Logo-MMC.png" alt="Logo" width="24" height="24" />
        Metropolitan Medical Centre
        </h5>}
        <button
          onClick={toggle}
          className="btn btn-sm text-white"
          style={{ background: 'transparent', border: 'none' }}
        >
          <FaBars />
        </button>
      </div>

      <nav className="d-flex flex-column px-2 gap-2">
        <SidebarButton
          href="/dashboard"
          icon={<MdDashboard size={18} />}
          label="Dashboard"
          active={pathname === '/dashboard'}
          collapsed={collapsed}
        />
        <SidebarButton
          href="/profile"
          icon={<FaUser size={18} />}
          label="Profil"
          active={pathname === '/profile'}
          collapsed={collapsed}
        />
        <SidebarButton
          href="/tabel-agama"
          icon={<FaElementor size={18} />}
          label="Tabel Agama"
          active={pathname === '/tabel-agama'}
          collapsed={collapsed}
        />
        <SidebarButton
          href="/tabel-pendidikan"
          icon={<FaGraduationCap size={18} />}
          label="Tabel Pendidikan"
          active={pathname === '/tabel-pendidikan'}
          collapsed={collapsed}
        />
      </nav>
    </aside>
  )
}

function SidebarButton({ href, icon, label, active, collapsed }) {
  return (
    <Link href={href} className="text-decoration-none">
      <div
        className={`d-flex align-items-center gap-2 px-3 py-2 rounded-3 position-relative ${
          active ? 'text-white fw-semibold' : 'text-light'
        }`}
        style={{
          fontSize: '0.95rem',
          transition: 'all 0.3s ease',
          background: active
            ? 'linear-gradient(to right, #0d6efd, #42a5f5)'
            : 'transparent',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          if (!active) e.currentTarget.style.background = '#2b3f74'
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.background = 'transparent'
        }}
      >
        {icon}
        {!collapsed && <span className="text-truncate">{label}</span>}
      </div>
    </Link>
  )
}
