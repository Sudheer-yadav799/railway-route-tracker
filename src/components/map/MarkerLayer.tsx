import { Marker, Popup, useMap  ,Tooltip} from "react-leaflet"
import { useEffect, useRef, useState, useCallback } from "react"
import { useDispatch } from "react-redux"
import L from "leaflet"
import { railwayMarkerIcons } from "../../utils/config/railwayMarkerIcons"
import { setGeoJson, setLoading } from "../../store/slices/railwayGeoSlice"

import "../../styles/map.css"

const CHUNK_SIZE = 100
const EXTENT_BUFFER = 0.25
const LOAD_DELAY    = 150   // chunk render delay
const PAN_DEBOUNCE  = 300   // wait ms after panning stops before fetching
const GEOSERVER_URL  = `${import.meta.env.VITE_GEOSERVER_URL}`;

const normalizeLayerName = (value?: string) => {
  if (!value) return "DEFAULT"
  const cleaned = value.trim().toUpperCase()
  if (cleaned === "0") return "DEFAULT"
  return cleaned
}

const getBufferedBounds = (map: L.Map) => {
  const b   = map.getBounds()
  const sw  = b.getSouthWest()
  const ne  = b.getNorthEast()
  const lat = (ne.lat - sw.lat) * EXTENT_BUFFER
  const lng = (ne.lng - sw.lng) * EXTENT_BUFFER
  return L.latLngBounds(
    [sw.lat - lat, sw.lng - lng],
    [ne.lat + lat, ne.lng + lng]
  )
}

const RailwayMarkerLayer = ({ layer }: any) => {
  const map      = useMap()
  const dispatch = useDispatch()

  const [visibleFeatures, setVisibleFeatures] = useState<any[]>([])
  const [zoom, setZoom]                       = useState(map.getZoom())

  const renderQueue   = useRef<any[]>([])
  const chunkTimer    = useRef<any>(null)
  const panDebounce   = useRef<any>(null)       // ← debounce panning
  const abortCtrl     = useRef<AbortController | null>(null)  // ← cancel stale fetches
  const popupOpen     = useRef(false)           // ← track popup state

  /* ---------------- Icon Resize ---------------- */
  const getDynamicIcon = useCallback((baseIcon: L.Icon) => {
    if (zoom > 20) return L.icon({ ...baseIcon.options, iconSize: [40, 40] })
    return baseIcon
  }, [zoom])

  /* ---------------- Chunk Rendering ---------------- */
  const loadChunkIdle = useCallback(() => {
    if (!renderQueue.current.length) return
    const chunk = renderQueue.current.splice(0, CHUNK_SIZE)
    setVisibleFeatures(prev => [...prev, ...chunk])
    if ("requestIdleCallback" in window) {
      ;(window as any).requestIdleCallback(loadChunkIdle)
    } else {
      setTimeout(loadChunkIdle, 16)
    }
  }, [])

  const scheduleChunkLoad = useCallback((geojson: any) => {
    clearTimeout(chunkTimer.current)
    chunkTimer.current = setTimeout(() => {
      renderQueue.current = [...geojson.features]
      setVisibleFeatures([])
      loadChunkIdle()
    }, LOAD_DELAY)
  }, [loadChunkIdle])

  /* ---------------- Load WFS ---------------- */
  const loadData = useCallback(() => {
    const currentZoom = map.getZoom()

    if (currentZoom <= 6) {
      setVisibleFeatures([])
      dispatch(setGeoJson(null))
      return
    }

    if (currentZoom < 14) return

    // ✅ Cancel any in-flight request before starting a new one
    if (abortCtrl.current) {
      abortCtrl.current.abort()
    }
    abortCtrl.current = new AbortController()

    const bounds   = getBufferedBounds(map)
    const bbox     = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()},EPSG:4326`
    const workspace = layer.geoserverWorkSpace
    const layerName = layer.apiendpoint

    const wfsUrl =
      `${GEOSERVER_URL}/${workspace}/ows` +
      `?service=WFS&version=1.0.0&request=GetFeature` +
      `&typeName=${workspace}:${layerName}` +
      `&outputFormat=application/json&srsName=EPSG:4326` +
      `&bbox=${bbox}&maxFeatures=500`

    dispatch(setLoading(true))

    fetch(wfsUrl, { signal: abortCtrl.current.signal })
      .then(res => res.json())
      .then(json => {
        scheduleChunkLoad(json)
        dispatch(setGeoJson(json))
      })
      .catch(err => {
        if (err.name !== "AbortError") {
          console.error("WFS fetch error:", err)
        }
      })
      .finally(() => dispatch(setLoading(false)))

  }, [map, layer, dispatch, scheduleChunkLoad])

  /* ---------------- Map Events ---------------- */
  useEffect(() => {
    loadData()

    const onPopupOpen  = () => { popupOpen.current = true }
    const onPopupClose = () => { popupOpen.current = false }

    // ✅ As soon as user starts panning/zooming — close any open popup immediately
    const onMoveStart = () => {
      if (popupOpen.current) {
        map.closePopup()          // closes popup → triggers onPopupClose → unblocks
      }
    }

    const onMove = () => {
      if (popupOpen.current) return
      clearTimeout(panDebounce.current)
      panDebounce.current = setTimeout(() => loadData(), PAN_DEBOUNCE)
    }

    const onZoom = () => {
      if (popupOpen.current) return
      const z = map.getZoom()
      setZoom(z)
      clearTimeout(panDebounce.current)
      panDebounce.current = setTimeout(() => {
        if (z <= 6) setVisibleFeatures([])
        else loadData()
      }, PAN_DEBOUNCE)
    }

    map.on("popupopen",  onPopupOpen)
    map.on("popupclose", onPopupClose)
    map.on("movestart",  onMoveStart)   // ← closes popup the moment user starts dragging
    map.on("moveend",    onMove)
    map.on("zoomend",    onZoom)

    return () => {
      map.off("popupopen",  onPopupOpen)
      map.off("popupclose", onPopupClose)
      map.off("movestart",  onMoveStart)
      map.off("moveend",    onMove)
      map.off("zoomend",    onZoom)
      clearTimeout(panDebounce.current)
      clearTimeout(chunkTimer.current)
      // cancel any pending fetch on unmount
      abortCtrl.current?.abort()
    }
  }, [loadData])   

  if (zoom <= 6) return null
  if (!visibleFeatures.length) return null

  return (
    <>
{visibleFeatures.map((f: any, index: number) => {
  const [lng, lat] = f.geometry.coordinates
  const layerValue = normalizeLayerName(f.properties?.layer)
  const baseIcon = railwayMarkerIcons[layerValue] || railwayMarkerIcons["DEFAULT"]
  const icon = getDynamicIcon(baseIcon)

  return (
    <Marker
      key={`${layer.id}-${index}`}
      position={[lat, lng]}
      icon={icon}
    >
      {/* Tooltip acts like hover popup */}
      <Tooltip
        direction="top"
        offset={[0, -10]}
        opacity={1}
        interactive={true}      // allows mouse to hover inside
      >
        <div className="railway-popup">
          <div className="popup-header"> {f.properties.layer}</div>
          <div className="popup-body">
            <div className="popup-row">
              <span className="label">Pole ID</span>
              <span className="value">{f.properties.name}</span>
            </div>
            {f.properties.id && (
              <div className="popup-row">
                <span className="label">Feature ID</span>
                <span className="value">{f.properties.id}</span>
              </div>
            )}
            <div className="popup-row">
              <span className="label">Latitude</span>
              <span className="value">{lat.toFixed(6)}</span>
            </div>
            <div className="popup-row">
              <span className="label">Longitude</span>
              <span className="value">{lng.toFixed(6)}</span>
            </div>
          </div>
        </div>
      </Tooltip>

      {/* Popup still opens on click */}
      <Popup offset={[0, -10]}>
        <div className="railway-popup">
          <div className="popup-header"> {f.properties.layer}</div>
          <div className="popup-body">
            <div className="popup-row">
              <span className="label">Pole ID</span>
              <span className="value">{f.properties.name}</span>
            </div>
            {f.properties.id && (
              <div className="popup-row">
                <span className="label">Feature ID</span>
                <span className="value">{f.properties.id}</span>
              </div>
            )}
            <div className="popup-row">
              <span className="label">Latitude</span>
              <span className="value">{lat.toFixed(6)}</span>
            </div>
            <div className="popup-row">
              <span className="label">Longitude</span>
              <span className="value">{lng.toFixed(6)}</span>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  )
})}
    </>
  )
}

export default RailwayMarkerLayer