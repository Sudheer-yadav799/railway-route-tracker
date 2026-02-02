import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

 const Header: React.FC = () => {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const menuItems = [
    { label: 'Profile', onClick: () => navigate('/userProfile') },
    { label: 'Settings', onClick: () => alert('Settings clicked') },
    { label: 'Help', onClick: () => alert('Help clicked') }
  ]

  return (
    <header
      style={{
        height: '60px',
        background: 'linear-gradient(90deg, #d60043, #ff4b2b)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        fontSize: '22px',
        fontWeight: '800',
        textAlign: 'center',
        fontFamily: 'monospace',
        position: 'relative'
      }}
    >
      Railway Route Infrastructure

      {/* Right-side Menu */}
      <div style={{ position: 'relative' }} ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: 18,
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          ☰
        </button>

        {menuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '50px',
              right: 0,
              background: '#1f2937',
              borderRadius: 8,
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              zIndex: 10000
            }}
          >
            {menuItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  item.onClick()
                  setMenuOpen(false)
                }}
                style={{
                  padding: '10px 20px',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: 14,
                  borderBottom: idx !== menuItems.length - 1 ? '1px solid #374151' : 'none',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#374151')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {item.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

 export default Header