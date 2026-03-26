import { useState, useRef, useEffect } from 'react'
import '../../styles/legend.css'
import L from 'leaflet'

import { railwayStyleConfig } from '../../utils/railwayStyleConfig'
import { railwayMarkerIcons } from '../../utils/config/railwayMarkerIcons'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

/* ─────────────────────────────────────────────
   📌 GROUP CONFIG (ONLY KEYS, NO STYLES HERE)
───────────────────────────────────────────── */
const LEGEND_GROUPS: Record<string, string[]> = {
  Track: ['MAIN LINES', 'OTHER LINES', 'LOOP LINES', 'SHUNTS', 'GLUE JOINTS'],
  Signalling: ['SIGNALS', 'POINTS', 'BSLB', 'FM', 'FIELD GEARS', 'LC GATE', 'SAND HUMP', 'DEAD END', 'STOPBOARD','POLE WITH ID','POLE ID'],
  'Station Infrastructure': ['STATION CENTER', 'PLATFORM', 'BUILDING', 'PARKING', 'IB HUT', 'KM STONE'],
  Bridges: ['BRIDGE', 'CULVERT', 'ROB', 'RUB', 'FOOT OVER BRIDGE'],
  'Railway Boundary': ['RAILWAY BOUNDARY', 'TOWER'],
  Electrical: ['OHE'],
}

/* ─────────────────────────────────────────────
   🎨 SYMBOL COMPONENT (USES CONFIG ONLY)
───────────────────────────────────────────── */
const Symbol = ({ name }: { name: string }) => {
  const style = railwayStyleConfig[name]
  const icon = railwayMarkerIcons[name]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

      {/* ✅ Marker Icon (if exists) */}
      {icon && (
        <img
          src={icon.options.iconUrl}
          style={{ width: 14, height: 14 }}
          alt={name}
        />
      )}

      {/* ✅ Line Symbol */}
      {style?.type === 'line' && (
        <svg width="26" height="10">
          <line
            x1="2"
            y1="5"
            x2="24"
            y2="5"
            stroke={style.color}
            strokeWidth={Math.min(style.weight || 2, 4)}
            strokeDasharray={style.dashArray || 'none'}
          />
        </svg>
      )}

      {/* ✅ Polygon / Mixed */}
      {(style?.type === 'polygon' || style?.type === 'mixed') && (
        <svg width="16" height="12">
          <rect
            x="1"
            y="1"
            width="14"
            height="10"
            rx="2"
            fill={(style.fillColor || style.color) + '99'}
            stroke={style.color}
            strokeWidth={1.5}
          />
        </svg>
      )}

      {/* ✅ Point fallback (if no icon but has point style) */}
      {!icon && style?.type === 'point' && (
        <svg width="12" height="12">
          <circle cx="6" cy="6" r="5" fill={style.color} />
        </svg>
      )}

    </div>
  )
}

/* ─────────────────────────────────────────────
   🚀 LEGEND COMPONENT
───────────────────────────────────────────── */
const LegendView = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!wrapperRef.current) return
    L.DomEvent.disableScrollPropagation(wrapperRef.current)
    L.DomEvent.disableClickPropagation(wrapperRef.current)
  }, [])

  return (
    <div className="legend-wrapper" ref={wrapperRef}>

      {/* HEADER */}
      <div className="legend-header" onClick={() => setOpen(v => !v)}>
        <span className="legend-title">LEGEND</span>
        <span
          className="legend-chevron"
        >
         {open?  <FiChevronDown /> : <FiChevronUp />} 
        </span>
      </div>

      {/* BODY */}
      {open && (
        <div className="legend-body">

          {Object.entries(LEGEND_GROUPS).map(([group, keys], gi) => (
            <div key={group} className="legend-section">

              <div className="legend-section-label">{group}</div>

              {keys.map(key => (
                <div key={key} className="legend-row">
                  <Symbol name={key} />
                  <span>{key}</span>
                </div>
              ))}

              {gi < Object.keys(LEGEND_GROUPS).length - 1 && (
                <div className="legend-divider" />
              )}

            </div>
          ))}

        </div>
      )}
    </div>
  )
}

export default LegendView