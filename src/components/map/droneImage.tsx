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
      url="http://localhost:8082/geoserver/drone/wms"
      layers="drone:cog_rgb"
      format="image/png"
      transparent={true}
      version="1.1.1"
      opacity={1}
      zIndex={1000} 
      maxZoom={25}  
    />
  )
}

export default DroneImageWMS
