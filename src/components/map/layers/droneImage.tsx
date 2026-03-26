import { useState } from "react";
import { useMap, useMapEvents, WMSTileLayer } from "react-leaflet";

const GEOSERVER_URL = import.meta.env.VITE_GEOSERVER_URL
interface DroneImageWMSProps {
  layer: any;
}

const DroneImageWMS = ({ layer }: DroneImageWMSProps) => {
  const map = useMap();
  const [zoom, setZoom] = useState<number>(map.getZoom());

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });

  if (!layer?.isenabled) return null;

  if (zoom <= 15) return null;

  const workspace = layer.geoserverWorkSpace;
  const layerName = layer.apiendpoint;
const wmsUrl = `${GEOSERVER_URL}/${workspace}/wms`;
  return (
    <WMSTileLayer
      key={layer.id}
      
      url={wmsUrl}
      layers={`${workspace}:${layerName}`}
      format="image/png"
      transparent
      version="1.1.1"
      tiled
      opacity={parseFloat(layer.opacity || "1")}
      zIndex={400}
      crs={L.CRS.EPSG3857}
      maxZoom={25}
    />
  );
};

export default DroneImageWMS;