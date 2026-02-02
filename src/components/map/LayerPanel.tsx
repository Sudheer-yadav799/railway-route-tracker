import { useState } from 'react'

const LayerPanel = ({
  showAreas, setShowAreas,
  showLines, setShowLines,
  showPoints, setShowPoints,
  showDroneLayer, setShowDroneLayer   // ✅ new props
}: any) => {
  const [open, setOpen] = useState(true)

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '30px',
        left: '20px',
        width: 230,
        background: '#ffffff',
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: 1200,
        overflow: 'hidden',
        fontFamily: 'Segoe UI, Arial'
      }}
    >
      {/* Header / Toggle Button */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          cursor: 'pointer',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg,#667eea,#764ba2)',
          color: '#fff'
        }}
      >
        <span style={{ fontWeight: 600 }}>Layers</span>

        {/* Chevron */}
        <span style={{
          fontSize: 18,
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.25s ease'
        }}>
          ▼
        </span>
      </div>

      {/* Layer List */}
      {open && (
        <div style={{ padding: '12px 14px' }}>
          <label style={labelStyle}>
            <input
              type="checkbox"
              checked={showAreas}
              onChange={() => setShowAreas(!showAreas)}
            />
            <span>Infrastructure Areas</span>
          </label>

          <label style={labelStyle}>
            <input
              type="checkbox"
              checked={showLines}
              onChange={() => setShowLines(!showLines)}
            />
            <span>Railway Lines</span>
          </label>

          <label style={labelStyle}>
            <input
              type="checkbox"
              checked={showPoints}
              onChange={() => setShowPoints(!showPoints)}
            />
            <span>Stations / Poles</span>
          </label>

          <label style={labelStyle}>
            <input
              type="checkbox"
              checked={showDroneLayer}
              onChange={() => setShowDroneLayer(!showDroneLayer)}
            />
            <span>Drone Image Layer</span>
          </label>
        </div>
      )}
    </div>
  )
}

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 10,
  cursor: 'pointer',
  fontSize: 14
}

export default LayerPanel
