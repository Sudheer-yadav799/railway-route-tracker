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

<<<<<<< HEAD
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
=======
  const getStyle = (feature: any) => {
    const layerName = feature.properties?.layer?.toUpperCase();
    const styleConfig = railwayStyleConfig[layerName];

    if (!styleConfig) {
      return { color: "#c70d0d", weight: 2 };
    }

    return {
      color: styleConfig.color,
      weight: styleConfig.weight || 2,
      dashArray: styleConfig.dashArray,
      fillColor: styleConfig.fillColor,
      fillOpacity: styleConfig.fillOpacity,
    };
  };
>>>>>>> bd0893bbba46a0e529a9346238f37165fd8c1335

  const handleEachFeature = (feature: any, layerInstance: any) => {
    const popupField = layer.popupFieldName;

    if (popupField) {
      const fieldValue = feature.properties?.[popupField] || "No Data";
      const layerName = feature.properties?.layer || layer.name || "";

<<<<<<< HEAD
      layerInstance.bindPopup(buildPopupHTML( layerName,fieldValue))
=======
      layerInstance.bindPopup(buildPopupHTML(fieldValue, layerName));
>>>>>>> bd0893bbba46a0e529a9346238f37165fd8c1335
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