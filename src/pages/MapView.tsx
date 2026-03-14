import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import BaseMap from "../components/map/BaseMap";
import LayerPanelSection from "../components/map/LayerPanelSection";

import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useUserProjectLayers } from "../hooks/useLayers";
import { setLayers } from "../store/slices/layersSlice";
import DynamicLayerRenderer from "../components/map/layers/DynamicLayerRenderer";


const MapView = () => {
  const dispatch = useDispatch();


 const selectedProjectId = useSelector(
  (state: any) => state.project?.projectId
);
  const { data } = useUserProjectLayers(selectedProjectId);

  const [currentZoom, setCurrentZoom] = useState(15);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (data?.success && data.data) {
      dispatch(setLayers(data.data));
    }
  }, [data?.success, data?.data, dispatch]);



  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#0a0f1e",
      }}
    >
      <Header mapRef={mapRef} />

      {/* Map container */}
      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
        <BaseMap
          currentZoom={currentZoom}
          setCurrentZoom={setCurrentZoom}
          showDroneLayer={false}
          onMapReady={(map) => {
            mapRef.current = map;
          }}
        >
          <DynamicLayerRenderer />
        </BaseMap>

        {/* Layer panel overlay */}
        <LayerPanelSection />
      </div>
    </div>
  );
};

export default MapView;