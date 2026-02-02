import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
  onLogin?: () => void
}

const styles: Record<string, React.CSSProperties> = {
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
    padding: '40px 32px',
    background: 'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(14px)',
    borderRadius: 14,
    boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
    color: '#fff'
  },
  title: {
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 1
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 28,
    fontSize: 14,
    opacity: 0.8
  },
  formGroup: {
    marginBottom: 16
  },
  label: {
    display: 'block',
    marginBottom: 6,
    fontSize: 13,
    opacity: 0.9
  },
  input: {
    width: '100%',
    padding: '11px 12px',
    borderRadius: 6,
    border: 'none',
    outline: 'none',
    fontSize: 14
  },
  button: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(90deg,#2563eb,#1d4ed8)',
    border: 'none',
    borderRadius: 6,
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 10
  },
  switchText: {
    marginTop: 18,
    textAlign: 'center',
    fontSize: 13,
    opacity: 0.85
  },
  switchBtn: {
    color: '#93c5fd',
    cursor: 'pointer',
    fontWeight: 600
  }
}

const Auth: React.FC<Props> = ({ onLogin }) => {
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)

  const handleSubmit = () => {
    if (isRegister) {
      console.log('Register user')
    } else {
      onLogin?.()
      navigate('/map')
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div>

      <div style={styles.card}>
        <h2 style={styles.title}>
          {isRegister ? 'CREATE ACCOUNT' : 'SIGN IN'}
        </h2>
        <p style={styles.subtitle}>Railway Route Tracker</p>

        {/* Username */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Username</label>
          <input type="text" placeholder="Enter username" style={styles.input} />
        </div>

        {/* Register-only fields */}
        {isRegister && (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="Enter email"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Mobile Number</label>
              <input
                type="tel"
                placeholder="Enter mobile number"
                style={styles.input}
              />
            </div>
          </>
        )}

        {/* Password */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            style={styles.input}
          />
        </div>

        <button style={styles.button} onClick={handleSubmit}>
          {isRegister ? 'Register' : 'Login'}
        </button>

        <div style={styles.switchText}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            style={styles.switchBtn}
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Login' : 'Register'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Auth
