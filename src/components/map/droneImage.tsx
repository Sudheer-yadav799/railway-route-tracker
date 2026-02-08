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
  //   <WMSTileLayer
  //     url="https://localhost:8080/geoserver/Rtk/wms"
  //     layers="Rtk:sampletilelayer"
  //     format="image/png"
  //     transparent
  //     version="1.1.0"
  //     attribution="RTK Sample Layer"
  //     maxZoom={25}
  //     params={{
  //     "ngrok-skip-browser-warning": "true",
  // }}
  //   />
  
      <WMSTileLayer
      url="https://roughish-armani-uncorrugated.ngrok-free.dev/geoserver/RailwayDroneImage/wms"
      layers="RailwayDroneImage:droneimage"
      format="image/png"
      transparent
      version="1.1.0"
      attribution="RTK Sample Layer"
      maxZoom={25}
      
      params={{
         tiled: true,
      "ngrok-skip-browser-warning": "true",
  }}
    />
  )
}

export default DroneImageWMS

  //   <WMSTileLayer
  //     url="https://roughish-armani-uncorrugated.ngrok-free.dev/geoserver/RailwayDroneImage/wms"
  //     layers="RailwayDroneImage:droneimage"
  //     format="image/png"
  //     transparent
  //     version="1.1.0"
  //     attribution="RTK Sample Layer"
  //     maxZoom={25}
  //     params={{
  //     "ngrok-skip-browser-warning": "true",
  // }}
  //   />