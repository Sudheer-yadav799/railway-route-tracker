import React from 'react'
import { useNavigate } from 'react-router-dom'

const profileStyles: Record<string, React.CSSProperties> = {
  page: {
    height: '100vh',
    backgroundImage:
      'url(https://images.unsplash.com/photo-1504384308090-c894fdcc538d)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    fontFamily: 'Segoe UI, sans-serif'
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(10, 20, 40, 0.75)'
  },
  card: {
    position: 'relative',
    width: 420,
    padding: '36px 32px',
    background: 'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(14px)',
    borderRadius: 14,
    boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
    color: '#fff'
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: '50%',
    background: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    fontWeight: 600,
    margin: '0 auto 16px'
  },
  title: { textAlign: 'center', marginBottom: 6, letterSpacing: 1 },
  subtitle: { textAlign: 'center', marginBottom: 24, fontSize: 14, opacity: 0.8 },
  infoRow: { marginBottom: 14, fontSize: 14, display: 'flex', justifyContent: 'space-between', opacity: 0.95 },
  label: { opacity: 0.7 },
  value: { fontWeight: 500 },
  button: { width: '100%', marginTop: 26, padding: '12px', background: 'linear-gradient(90deg,#ef4444,#dc2626)', border: 'none', borderRadius: 6, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }
}

const UserAccount: React.FC = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/') 
  }

  return (
    <div style={profileStyles.page}>
      <div style={profileStyles.overlay}></div>

      <div style={profileStyles.card}>
        <div style={profileStyles.avatar}>JD</div>

        <h2 style={profileStyles.title}>John Doe</h2>
        <p style={profileStyles.subtitle}>Railway Route Tracker User</p>

        <div style={profileStyles.infoRow}>
          <span style={profileStyles.label}>Username</span>
          <span style={profileStyles.value}>johndoe</span>
        </div>

        <div style={profileStyles.infoRow}>
          <span style={profileStyles.label}>Email</span>
          <span style={profileStyles.value}>john@example.com</span>
        </div>

        <div style={profileStyles.infoRow}>
          <span style={profileStyles.label}>Mobile</span>
          <span style={profileStyles.value}>9876543210</span>
        </div>

        <button style={profileStyles.button} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default UserAccount
