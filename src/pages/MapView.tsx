import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import BaseMap from "../components/map/BaseMap";
import LayerPanelSection from "../components/map/LayerPanelSection";
import Legend from "../components/map/Legend";
import DynamicLayerRenderer from "../components/map/DynamicLayerRenderer";
import { useDispatch, useSelector } from "react-redux";
import { useUserProjectLayers } from "../hooks/useLayers";
import { setLayers } from "../store/slices/layersSlice";

const MapView = () => {
  const dispatch = useDispatch();
  const projectIds = useSelector(
  (state: any) => state.auth.user?.projectIds || []
);

   const { data } = useUserProjectLayers(projectIds);
  const [currentZoom, setCurrentZoom] = useState(15);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (data?.success) {
      dispatch(setLayers(data.data));
    }
  }, [data, dispatch]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0a0f1e' }}>
     <Header mapRef={mapRef} />

      {/* Map container — fills remaining height */}
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <BaseMap
          currentZoom={currentZoom}
          setCurrentZoom={setCurrentZoom}
          showDroneLayer={false}
          onMapReady={(map) => { mapRef.current = map; }}
        >
          <DynamicLayerRenderer />
        </BaseMap>

        {/* Map overlays */}
        <LayerPanelSection />
      </div>
    </div>
  );
};

export default MapView;