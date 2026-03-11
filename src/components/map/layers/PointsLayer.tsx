import {
  Marker,
  Popup,
  Tooltip,
  useMap
} from 'react-leaflet'
import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const CHUNK_SIZE = 100
const LABEL_ZOOM = 15
const EXTENT_BUFFER = 0.25
const LOAD_DELAY = 150

const createStationIcon = (selected = false) => {
  const width = selected ? 35 : 26
  const height = selected ? 50 : 52

  return L.divIcon({
    className: `custom-pole-marker ${selected ? 'selected' : ''}`,
    html: `
      <svg width="${width}" height="${height}"
           viewBox="0 0 26 52"
           style="transform: scale(${selected ? 1.4 : 1}); transform-origin: bottom center;">
        <rect x="11" y="6" width="4" height="38" rx="1.5"
          fill="${selected ? '#e65319' : '#061258'}"/>
        <rect x="3" y="10" width="20" height="4" rx="1.5"
          fill="${selected ? '#e65319' : '#061258'}"/>
        <circle cx="4" cy="12" r="2" fill="#f5f5f5"/>
        <circle cx="22" cy="12" r="2" fill="#f5f5f5"/>
        <rect x="8" y="44" width="10" height="6" rx="1.5"
          fill="${selected ? '#e65319' : '#061258'}"/>
      </svg>
    `,
    iconSize: [width, height],
    iconAnchor: [width / 2, height],
   popupAnchor: [0, -46]
  })
}


const getBufferedBounds = (map: L.Map) => {
  const b = map.getBounds()
  const sw = b.getSouthWest()
  const ne = b.getNorthEast()

  const latBuffer = (ne.lat - sw.lat) * EXTENT_BUFFER
  const lngBuffer = (ne.lng - sw.lng) * EXTENT_BUFFER

  return L.latLngBounds(
    [sw.lat - latBuffer, sw.lng - lngBuffer],
    [ne.lat + latBuffer, ne.lng + lngBuffer]
  )
}

const PointsLayer = ({ data, selectedPole }: any) => {
  const map = useMap()

  const markerRefs = useRef<Record<string, L.Marker>>({})
  const renderQueue = useRef<any[]>([])
  const debounceTimer = useRef<any>(null)

  const [visibleFeatures, setVisibleFeatures] = useState<any[]>([])
  const [showLabels, setShowLabels] = useState(map.getZoom() >= LABEL_ZOOM)

  const prevSelectedRef = useRef<string | null>(null)

  const scheduleLoad = () => {
    clearTimeout(debounceTimer.current)

    debounceTimer.current = setTimeout(() => {
      const bounds = getBufferedBounds(map)

      const featuresInView = data.features.filter((f: any) => {
        const [lng, lat] = f.geometry.coordinates
        return bounds.contains([lat, lng])
      })

      renderQueue.current = featuresInView
      setVisibleFeatures([])

      loadChunkIdle()
    }, LOAD_DELAY)
  }

  const loadChunkIdle = () => {
    if (!renderQueue.current.length) return

    const chunk = renderQueue.current.splice(0, CHUNK_SIZE)
    setVisibleFeatures((prev) => [...prev, ...chunk])

    if ('requestIdleCallback' in window) {
      ;(window as any).requestIdleCallback(loadChunkIdle)
    } else {
      setTimeout(loadChunkIdle, 16)
    }
  }

  useEffect(() => {
    scheduleLoad()

    const onMove = () => scheduleLoad()

    const onZoom = () => {
      setShowLabels(map.getZoom() >= LABEL_ZOOM)
      scheduleLoad()
    }

    map.on('move', onMove)
    map.on('zoom', onZoom)

    return () => {
      map.off('move', onMove)
      map.off('zoom', onZoom)
    }
  }, [map, data])

  // ✅ Updated selection effect
  useEffect(() => {
    if (!selectedPole) return

    const prev = prevSelectedRef.current
    if (prev && markerRefs.current[prev]) {
      markerRefs.current[prev].setIcon(createStationIcon(false))
    }

    const marker = markerRefs.current[selectedPole]
    if (marker) {
      marker.setIcon(createStationIcon(true))
      marker.openPopup()
    }

    prevSelectedRef.current = selectedPole
  }, [selectedPole])

  return (
    <>
      {visibleFeatures.map((f: any) => {
        const [lng, lat] = f.geometry.coordinates

        const key = f.properties.NAME


        const name = f.properties.NAME

        return (
          <Marker
            key={key}
            position={[lat, lng]}
             icon={createStationIcon(selectedPole === key)}
            ref={(ref) => {
              if (ref) markerRefs.current[key] = ref
            }}
          >
            {showLabels && (
              <Tooltip
                permanent
                direction="top"
                offset={[0, -45]}
                className="station-label"
              >
                {name}
              </Tooltip>
            )}

            <Popup>
              <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", minWidth: '250px' }}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  color: '#fff',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  padding: '10px',
                  borderRadius: '6px',
                  fontSize: '17px',
                  textAlign: 'center'
                }}>
                  🚉 {name}
                </h3>

                <table style={{ width: '100%', fontSize: '13px' }}>
                  <tbody>
                    <tr>
                      <td><strong>Layer:</strong></td>
                      <td>{f.properties.LAYER}</td>
                    </tr>
                    <tr>
                      <td><strong>Height:</strong></td>
                      <td>{f.properties.FONT_HT_M.toFixed(2)} m</td>
                    </tr>
                    <tr style={{ background: '#f3f4f6' }}>
                      <td><strong>Latitude:</strong></td>
                      <td><code>{f.properties.LAT.toFixed(6)}</code></td>
                    </tr>
                    <tr style={{ background: '#f3f4f6' }}>
                      <td><strong>Longitude:</strong></td>
                      <td><code>{f.properties.LONG.toFixed(6)}</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Popup>
          </Marker>
        )
      })}

      <style>
        {`
          .station-label {
            background: #061258;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
          }

          .leaflet-tooltip::before {
            display: none;
          }
        `}
      </style>
    </>
  )
}

export default PointsLayer
