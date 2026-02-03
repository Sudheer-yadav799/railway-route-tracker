import { useState } from "react"
import { useMap, useMapEvents, WMSTileLayer } from "react-leaflet"

const DroneImageWMS = ({ enabled }: { enabled: boolean }) => {
  const map = useMap()
  const [zoom, setZoom] = useState<number>(map.getZoom())

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  })

  // Zoom rule
  if (!enabled) return null
  if (zoom <= 15) return null

  return (
    <WMSTileLayer
      url="https://8e752270bb54.ngrok-free.app/geoserver/Rtk/wms"
      layers="Rtk:sampletilelayer"
      format="image/png"
      transparent
      version="1.1.0"
      attribution="RTK Sample Layer"
      maxZoom={25}
      params={{
       headers: {
      "ngrok-skip-browser-warning": "true",
    },
  }}
    />
  )
}

export default DroneImageWMS
