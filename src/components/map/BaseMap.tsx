

import { useEffect, ReactNode } from "react";
import { MapContainer, useMapEvents, useMap } from "react-leaflet";
import { useSelector } from "react-redux";
import MeasureControl from "./MeasureControl";
import DistanceRuler from "./ruler";

const ZoomLogger = () => {
  const map = useMapEvents({
    zoomend: () => console.log("Current Zoom Level:", map.getZoom()),
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
}) => {

  return (
    <MapContainer
      center={[25.1013, 76.5119]} // initial center
      zoom={16}
      minZoom={5}
  maxZoom={30}
  zoomControl={false}
      style={{ height: "100%", width: "100%" }}
      whenCreated={onMapReady}
    >
      <ZoomLogger />
      <MeasureControl />

      {/* Project map center updater */}
      <ProjectMapUpdater /> 
      <DistanceRuler />

      <MapReady onReady={onMapReady} />

      {children}
    </MapContainer>
  );
};

export default BaseMap;

const ProjectMapUpdater = () => {

  const map = useMap();

  const lat = useSelector((state:any)=>state.project.lat);
  const lng = useSelector((state:any)=>state.project.lng);

  useEffect(()=>{

    if(lat && lng){

      map.flyTo([lat,lng], 15,{
        animate:true,
        duration:1.5
      });

    }

  },[lat,lng,map]);

  return null;
};

export const MapReady = ({ onReady }: { onReady: (map: any) => void }) => {
  const map = useMap();
  useEffect(() => {
    onReady(map);
  }, [map, onReady]);
  return null;
};