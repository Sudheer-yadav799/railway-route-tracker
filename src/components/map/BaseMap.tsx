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
      center={[25.1013, 76.5119]}
      zoom={16}
      minZoom={5}
      style={{ height: "100%", width: "100%" }}
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