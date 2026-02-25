import { useEffect, ReactNode } from "react";
import { MapContainer, useMapEvents, useMap } from "react-leaflet";
import MeasureControl from "./MeasureControl";
import DroneImageWMS from "./droneImage";

const ZoomLogger = () => {
  const map = useMapEvents({
    zoomend: () => console.log("Current Zoom Level:", map.getZoom()),
    load: () => console.log("Initial Zoom Level:", map.getZoom()),
  });
  return null;
};

interface BaseMapProps {
  children: ReactNode;
  onMapReady: (map: any) => void;
  showDroneLayer: boolean;
  currentZoom: number;
  setCurrentZoom: (zoom: number) => void;
  // ✅ showMapImageLayer removed — now driven by Redux via DynamicLayerRenderer
}

const BaseMap: React.FC<BaseMapProps> = ({
  children,
  onMapReady,
  showDroneLayer,
  currentZoom,
  setCurrentZoom,
}) => {
  return (
    <MapContainer
      center={[18.58, 78.22]}
      zoom={15}
      minZoom={5}
      style={{ height: "calc(100vh - 60px)", width: "100%" }}
      whenCreated={onMapReady}
    >
      <DroneImageWMS enabled={true} />
      <ZoomLogger />
      <MeasureControl />
      <MapReady onReady={onMapReady} />
      {children}
    </MapContainer>
  );
};

export default BaseMap;

export const MapReady = ({ onReady }: { onReady: (map: any) => void }) => {
  const map = useMap();
  useEffect(() => {
    onReady(map);
  }, [map, onReady]);
  return null;
};