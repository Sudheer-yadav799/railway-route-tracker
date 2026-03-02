// RailwayMarkerLayer.tsx

import { Marker, Popup, useMap } from "react-leaflet"
import { useEffect, useRef, useState, useCallback } from "react"
import { useDispatch } from "react-redux"
import L from "leaflet"
import { railwayMarkerIcons } from "../../utils/config/railwayMarkerIcons"
import { setGeoJson, setLoading } from "../../store/slices/railwayGeoSlice"


const CHUNK_SIZE = 100
const EXTENT_BUFFER = 0.25
const LOAD_DELAY = 150

const normalizeLayerName = (value?: string) => {
  if (!value) return "DEFAULT"
  const cleaned = value.trim().toUpperCase()
  if (cleaned === "0") return "DEFAULT"
  return cleaned
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

const RailwayMarkerLayer = ({ layer }: any) => {
  const map = useMap()
  const dispatch = useDispatch()

  const [data, setData] = useState<any>(null)
  const [visibleFeatures, setVisibleFeatures] = useState<any[]>([])
  const [zoom, setZoom] = useState(map.getZoom())

  const renderQueue = useRef<any[]>([])
  const debounceTimer = useRef<any>(null)

  /* ---------------- Icon Resize ---------------- */
  const getDynamicIcon = useCallback(
    (baseIcon: L.Icon) => {
      if (zoom > 20) {
        return L.icon({
          ...baseIcon.options,
          iconSize: [40, 40],
        })
      }
      return baseIcon
    },
    [zoom]
  )

  /* ---------------- Load WFS ---------------- */
  const loadData = () => {
    if (map.getZoom() <= 6) {
      setVisibleFeatures([])
      dispatch(setGeoJson(null))
      return
    }

    if (map.getZoom() < 14) return

    const bounds = getBufferedBounds(map)

    const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()},EPSG:4326`

    const workspace = layer.geoserverWorkSpace
    const layerName = layer.apiendpoint

    const wfsUrl = `http://localhost:8082/geoserver/${workspace}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${workspace}:${layerName}&outputFormat=application/json&srsName=EPSG:4326&bbox=${bbox}&maxFeatures=1000`

    dispatch(setLoading(true))

    fetch(wfsUrl)
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        scheduleChunkLoad(json)

        // 🔥 Save globally
        dispatch(setGeoJson(json))
      })
      .finally(() => {
        dispatch(setLoading(false))
      })
  }

  /* ---------------- Chunk Rendering ---------------- */
  const scheduleChunkLoad = (geojson: any) => {
    clearTimeout(debounceTimer.current)

    debounceTimer.current = setTimeout(() => {
      renderQueue.current = [...geojson.features]
      setVisibleFeatures([])
      loadChunkIdle()
    }, LOAD_DELAY)
  }

  const loadChunkIdle = () => {
    if (!renderQueue.current.length) return

    const chunk = renderQueue.current.splice(0, CHUNK_SIZE)
    setVisibleFeatures((prev) => [...prev, ...chunk])

    if ("requestIdleCallback" in window) {
      ;(window as any).requestIdleCallback(loadChunkIdle)
    } else {
      setTimeout(loadChunkIdle, 16)
    }
  }

  /* ---------------- Map Events ---------------- */
  useEffect(() => {
    loadData()

    const onMove = () => loadData()

    const onZoom = () => {
      const currentZoom = map.getZoom()
      setZoom(currentZoom)

      if (currentZoom <= 6) {
        setVisibleFeatures([])
      } else {
        loadData()
      }
    }

    map.on("moveend", onMove)
    map.on("zoomend", onZoom)

    return () => {
      map.off("moveend", onMove)
      map.off("zoomend", onZoom)
    }
  }, [map, layer])

  if (zoom <= 6) return null
  if (!data) return null

  return (
    <>
      {visibleFeatures.map((f: any, index: number) => {
        const [lng, lat] = f.geometry.coordinates
        const layerValue = normalizeLayerName(f.properties?.layer)

        const baseIcon =
          railwayMarkerIcons[layerValue] ||
          railwayMarkerIcons["DEFAULT"]

        const icon = getDynamicIcon(baseIcon)

        return (
          <Marker
            key={`${layer.id}-${index}`}
            position={[lat, lng]}
            icon={icon}
          >
            <Popup>
              <div style={{ minWidth: "250px" }}>
                <strong>{f.properties.name}</strong>
                <br />
                {f.properties.layer}
              </div>
            </Popup>
          </Marker>
        )
      })}
    </>
  )
}

export default RailwayMarkerLayer