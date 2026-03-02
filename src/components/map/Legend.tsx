import { useState, useRef, useEffect } from 'react'
import { railwayStyleConfig } from '../../utils/railwayStyleConfig'
import { railwayMarkerIcons } from '../../utils/config/railwayMarkerIcons'
import '../../styles/legend.css'
import L from 'leaflet'

const PDF_GROUPS: Record<string, string[]> = {
  Track:                    ['MAIN LINES', 'OTHER LINES', 'LOOP LINES', 'SHUNTS', 'GLUE JOINTS'],
  Signalling:               ['SIGNALS', 'POINTS', 'BSLB', 'FM', 'FIELD GEARS', 'LC GATE', 'SAND HUMP', 'DEAD END', 'DEADEND', 'STOPBOARD'],
  'Station Infrastructure': ['STATION CENTER', 'PLATFORM', 'BUILDING', 'PARKING', 'IB HUT', 'KM STONE', 'KM'],
  Bridges:                  ['BRIDGE', 'CULVERT', 'ROB', 'RUB', 'FOOT OVER BRIDGE'],
  'Railway Boundary':       ['RAILWAY BOUNDARY', 'OFC BOUNDARY', 'TOWER'],
  Electrical:               ['OHE'],
}

const Symbol = ({ name, style, isMarker }: { name: string; style: any; isMarker: boolean }) => {
  if (isMarker) {
    return (
      <img
        src={`src/assets/railway-icons/${name.replace(/ /g, '').replace(/[()]/g, '')}.svg`}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        style={{ width: 16, height: 16, flexShrink: 0 }}
        alt={name}
      />
    )
  }
  if (style?.type === 'line') {
    return (
      <svg width="26" height="10" style={{ flexShrink: 0 }}>
        <line x1="2" y1="5" x2="24" y2="5"
          stroke={style.color}
          strokeWidth={Math.min(style.weight || 2, 3.5)}
          strokeDasharray={style.dashArray || 'none'}
        />
      </svg>
    )
  }
  if (style?.type === 'polygon' || style?.type === 'mixed') {
    return (
      <svg width="16" height="12" style={{ flexShrink: 0 }}>
        <rect x="1" y="1" width="14" height="10" rx="2"
          fill={(style.fillColor || style.color) + '99'}
          stroke={style.color}
          strokeWidth={1.5}
        />
      </svg>
    )
  }
  return (
    <svg width="12" height="12" style={{ flexShrink: 0 }}>
      <circle cx="6" cy="6" r="5" fill={style?.color || '#888'} />
    </svg>
  )
}

interface LegendProps {
  activeFeatureKeys: Set<string>
}

const Legend = ({ activeFeatureKeys }: LegendProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  // ✅ Stop Leaflet from receiving mouse/scroll/touch events on this element
  useEffect(() => {
    if (!wrapperRef.current) return
    L.DomEvent.disableScrollPropagation(wrapperRef.current)
    L.DomEvent.disableClickPropagation(wrapperRef.current)
  }, [])

  const [open, setOpen] = useState(true)

  const visibleGroups = Object.entries(PDF_GROUPS)
    .map(([group, keys]) => ({
      group,
      items: keys
        .filter(k => activeFeatureKeys.has(k))
        .map(k => ({ key: k, style: railwayStyleConfig[k], isMarker: !!railwayMarkerIcons[k] })),
    }))
    .filter(g => g.items.length > 0)

  const allGroupedKeys = new Set(Object.values(PDF_GROUPS).flat())
  const ungrouped = [...activeFeatureKeys]
    .filter(k => !allGroupedKeys.has(k))
    .map(k => ({ key: k, style: railwayStyleConfig[k], isMarker: !!railwayMarkerIcons[k] }))

  if (ungrouped.length > 0) visibleGroups.push({ group: 'Other', items: ungrouped })

  return (
    <div className="legend-wrapper" ref={wrapperRef}>

      {/* ── Header — pointer-events: auto via CSS ── */}
      <div className="legend-header" onClick={() => setOpen(v => !v)}>
        <div className="legend-header-left">
          <span className="legend-title">LEGEND</span>
        </div>
        <span className="legend-chevron" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </div>

      {open && (
        <div className="legend-body">
          {visibleGroups.length === 0 && (
            <div style={{ padding: '10px 14px', fontSize: 12, color: '#9ca3af' }}>
              No active layers
            </div>
          )}

          {visibleGroups.map((g, gi) => (
            <div key={g.group} className="legend-section">
              <div className="legend-section-label">{g.group}</div>

              {g.items.map(item => (
                <div key={item.key} className="legend-row">
                  <Symbol name={item.key} style={item.style} isMarker={item.isMarker} />
                  <span>{item.key.charAt(0) + item.key.slice(1).toLowerCase()}</span>
                </div>
              ))}

              {gi < visibleGroups.length - 1 && <div className="legend-divider" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Legend