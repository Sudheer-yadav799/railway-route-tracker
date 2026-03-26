import React from "react";
import { GeoJSON } from "react-leaflet";

import { railwayStyleConfig } from "../../../utils/railwayStyleConfig";
import { buildPopupHTML } from "../../../utils/popups/popup";

interface Props {
  layer: any;
  geoData: any;
}

const VectorLayerRenderer: React.FC<Props> = ({ layer, geoData }) => {
  if (!geoData) return null;

const getStyle = (feature: any) => {

  const props = feature.properties || {}

  // 🔥 Priority-based detection (VERY IMPORTANT)
  const layerKey =
    props.layer?.toUpperCase() ||
    props.type?.toUpperCase() ||
    props.asset_type?.toUpperCase() ||
    props.category?.toUpperCase() ||
    props.feature_type?.toUpperCase()

  const styleConfig = railwayStyleConfig[layerKey]

  if (!styleConfig) {
    return {
      color: "#FF3B30", // fallback (visible red)
      weight: 2,
    }
  }

  return {
    color: styleConfig.color,
    weight: styleConfig.weight || 2,
    dashArray: styleConfig.dashArray,
    fillColor: styleConfig.fillColor,
    fillOpacity: styleConfig.fillOpacity,
  }
}

  const handleEachFeature = (feature: any, layerInstance: any) => {
    const popupField = layer.popupFieldName;

    if (popupField) {
      const fieldValue = feature.properties?.[popupField] || "No Data";
      const layerName = feature.properties?.layer || layer.name || "";

      layerInstance.bindPopup(buildPopupHTML( layerName,fieldValue))
    }
  };

  return (
    <GeoJSON
      key={`vector-${layer.id}`}
      data={geoData}
      style={getStyle}
      onEachFeature={handleEachFeature}
    />
  );
};

export default VectorLayerRenderer;