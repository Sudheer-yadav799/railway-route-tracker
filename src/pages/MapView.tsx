import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import BaseMap from "../components/map/BaseMap";
import AreasLayer from "../components/map/AreasLayer";
import LinesLayer from "../components/map/LinesLayer";
import PointsLayer from "../components/map/PointsLayer";
import LayerPanel from "../components/map/LayerPanel";
import SearchBar from "../components/map/SearchBar";
import { convertGeoJSON } from "../utils/geojsonUtils";
import Legend from "../components/map/Legend";
import { useDispatch, useSelector } from "react-redux";
import { useLayers } from "../hooks/useLayers";
import { setLayers } from "../store/slices/layersSlice";
import { WMSTileLayer } from "react-leaflet";
import LayerPanelSection from "../components/map/LayerPanelSection";
import DynamicLayerRenderer from "../components/map/DynamicLayerRenderer";

const MapView = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useLayers();



  const [showDroneLayer, setShowDroneLayer] = useState(false);
  const [showMapImageLayer, setMapImageLayer] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(15);

  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (data?.success) {
      dispatch(setLayers(data.data));
    }
  }, [data, dispatch]);

  return (
    <>
      <Header />

      <BaseMap
        currentZoom={currentZoom}
        setCurrentZoom={setCurrentZoom}
        showMapImageLayer={showMapImageLayer}
        onMapReady={(map) => {
          mapRef.current = map;
        }}
      >
       <DynamicLayerRenderer/>
      </BaseMap>

      <LayerPanelSection />
      <Legend />
    </>
  );
};

export default MapView;