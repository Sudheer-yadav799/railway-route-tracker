import { useState } from 'react'
import '../../styles/legend.css'

const Legend = () => {
  const [open, setOpen] = useState(true)

  const infraItems = [
    { name: 'Bridge', color: '#FF6B6B', icon: '🌉' },
    { name: 'Culvert', color: '#4ECDC4', icon: '🔩' },
    { name: 'RUB', color: '#45B7D1', icon: '🛤️' },
    { name: 'ROB', color: '#FFA07A', icon: '🏗️' },
  ]

  return (
    <div className="legend-wrapper">

      <div className="legend-header" onClick={() => setOpen(v => !v)}>
        <div className="legend-header-left">
          📋
          <span className="legend-title">Legend</span>
        </div>

        <span
          className="legend-chevron"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </span>
      </div>

      {open && (
        <div className="legend-body">

          {/* Infrastructure */}
          <div className="legend-section">
            <div className="legend-section-label">
              Infrastructure Areas
            </div>

            {infraItems.map(item => (
              <div key={item.name} className="legend-row">
                <div
                  className="legend-area-box"
                  style={{
                    background: item.color + '40',
                    borderColor: item.color
                  }}
                />
                {item.icon} {item.name}
              </div>
            ))}
          </div>

          <div className="legend-divider" />

          {/* Railway Lines */}
          <div className="legend-section">
            <div className="legend-section-label">
              Railway Lines
            </div>

            <div className="legend-row">
              <div
                className="legend-line"
                style={{ background: '#F74400', height: 3 }}
              />
              Mainlines
            </div>

            <div className="legend-row">
              <div
                className="legend-line"
                style={{ background: '#999', height: 2 }}
              />
              Branch Lines
            </div>
          </div>

          <div className="legend-divider" />

          {/* Points */}
          <div className="legend-section">
            <div className="legend-section-label">
              Points of Interest
            </div>

            <div className="legend-row">🚉 Station</div>
            <div className="legend-row">
              <div className="legend-pole" />
              OHE Pole
            </div>
            <div className="legend-row">🔴 Signal</div>
          </div>

        </div>
      )}
    </div>
  )
}

export default Legend