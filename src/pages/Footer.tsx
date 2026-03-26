import React from 'react'

const Footer = () => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '36px',
        background: '#0f172a', // dark slate
        color: '#e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        fontSize: '12px',
        zIndex: 1100,
        fontFamily: 'Segoe UI, Arial'
      }}
    >
      {/* Left */}
      <div>
        © {new Date().getFullYear()} <strong>Your Company Name</strong>
      </div>

      {/* Center */}
      <div style={{ opacity: 0.8 }}>
        Railway Infrastructure & Asset Management System
      </div>

      {/* Right */}
      <div style={{ opacity: 0.8 }}>
        Powered by Web GIS
      </div>
    </div>
  )
}

export default Footer
