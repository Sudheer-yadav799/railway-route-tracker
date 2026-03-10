import React from "react";
import { GeoJSON } from "react-leaflet";
import { railwayStyleConfig } from "../../utils/railwayStyleConfig";
import { buildPopupHTML } from "../../utils/popups/popup";

interface Props {
  layer: any;
  geoData: any;
}

const VectorLayerRenderer: React.FC<Props> = ({ layer, geoData }) => {
  if (!geoData) return null;

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

  const handleEachFeature = (feature: any, layerInstance: any) => {
    const popupField = layer.popupFieldName;

    if (popupField) {
      const fieldValue = feature.properties?.[popupField] || "No Data";
      const layerName = feature.properties?.layer || layer.name || "";

      layerInstance.bindPopup(buildPopupHTML(fieldValue, layerName));
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