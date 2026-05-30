import React from "react";
import { GeoJSON } from "react-leaflet";

import { railwayStyleConfig } from "../../../utils/railwayStyleConfig";
import { buildPopupHTML } from "../../../utils/popups/popup";
import { useSelector } from "react-redux";

interface Props {
  layer: any;
  geoData: any;
}

const VectorLayerRenderer: React.FC<Props> = ({ layer, geoData }) => {
  if (!geoData) return null;
const enabledAssetLayers = useSelector(
  (state: any) =>
    state.assetLayers.enabledLayers
);

const filteredGeoData = {
  ...geoData,
  features: geoData.features?.filter((feature: any) => {
    const layerName =
      feature.properties?.layer
        ?.trim()
        ?.toUpperCase();

    console.log(
      "Feature Layer:",
      layerName,
      "Enabled:",
      enabledAssetLayers[layerName]
    );

    return enabledAssetLayers[layerName] !== false;
  }) || []
};

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
  key={`vector-${layer.id}-${Object.keys(enabledAssetLayers)
    .filter(k => enabledAssetLayers[k])
    .join("-")}`}
  data={filteredGeoData}
  style={getStyle}
  onEachFeature={handleEachFeature}
/>
  );
};

export default VectorLayerRenderer;