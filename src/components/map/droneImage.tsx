import { useState } from "react"
import { useMap, useMapEvents, WMSTileLayer } from "react-leaflet"

const DroneImageWMS = ({ enabled }: { enabled: boolean }) => {
  const map = useMap()
  const [zoom, setZoom] = useState<number>(map.getZoom())

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  })

  // Zoom rule remains
  if (!enabled) return null
  if (zoom <= 15) return null

  return (
    <WMSTileLayer
      url="http://localhost:8080/geoserver/Rtk/wms"
      layers="Rtk:sampletilelayer"
      format="image/png"
      transparent={true}
      version="1.1.0"
      attribution="RTK Sample Layer"
      maxZoom={25}
    />
  )
}

export default DroneImageWMS
