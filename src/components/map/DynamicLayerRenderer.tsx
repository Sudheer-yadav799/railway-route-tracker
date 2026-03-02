import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GeoJSON, WMSTileLayer, TileLayer } from "react-leaflet";
import L from "leaflet";
import { railwayStyleConfig } from "../../utils/railwayStyleConfig";
import RailwayMarkerLayer from "./MarkerLayer";
import { buildPopupHTML } from "../../utils/popups/popup";
import Legend from "./Legend";

const DynamicLayerRenderer = () => {
  const sections = useSelector((state: any) => state.layers.sections);
  const [geoJsonCache, setGeoJsonCache] = useState<any>({});

  
const [activeFeatureKeys, setActiveFeatureKeys] = useState<Set<string>>(new Set())


  /* --------------------------
     Load GeoJSON dynamically
  -------------------------- */
useEffect(() => {
  sections?.forEach((section: any) => {
    section.layers.forEach((layer: any) => {
      if (
        layer.isenabled &&
        ["polygonlayer", "linelayer"].includes(layer.type) &&
        !geoJsonCache[layer.id]
      ) {
        const workspace = layer.geoserverWorkSpace;
        const layerName = layer.apiendpoint;

        const wfsUrl = `http://localhost:8082/geoserver/${workspace}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${workspace}:${layerName}&outputFormat=application/json&srsName=EPSG:4326`;

        fetch(wfsUrl)
          .then((res) => res.json())
          .then((data) => {
            setGeoJsonCache((prev: any) => ({
              ...prev,
              [layer.id]: data
            }));
             const keys: string[] = data.features
    ?.map((f: any) => f.properties?.layer?.trim().toUpperCase())
    .filter(Boolean) ?? []

  setActiveFeatureKeys(prev => new Set([...prev, ...keys]))
          });
      }
    });
  });
}, [sections]);






  const normalizeLayerName = (value?: string) => {
    if (!value) return "DEFAULT";

    const cleaned = value.trim().toUpperCase();

    if (cleaned === "0") return "DEFAULT";

    return cleaned;
  };

  return (
    <><>
      {sections?.map((section: any) => section.layers.map((layer: any) => {
        // ✅ Skip rendering entirely when layer is disabled
        if (!layer.isenabled) return null;

        /* -------------------- WMS -------------------- */
        if (layer.type === "wmslayer") {
          return (
            <WMSTileLayer
              key={layer.id}
              url={`http://localhost:8082/geoserver/${layer.geoserverWorkSpace}/wms`}
              layers={layer.apiendpoint}
              format="image/png"
              transparent
              opacity={parseFloat(layer.opacity || "1")} />
          );
        }

          /* -------------------- TILE -------------------- */
          if (layer.type === "tilelayer") {
            if (layer.id === "osm_tile") {
              return (
                <TileLayer
                  key={layer.id}
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              );
            }
            if (layer.id === "google_street") {
              return (
                <TileLayer
                  key={layer.id}
                  url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                  subdomains={["mt0", "mt1", "mt2", "mt3"]}
                />
              );
            }
            if (layer.id === "satellite_tile") {
              return (
                <TileLayer
                  key={layer.id}
                  url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                  subdomains={["mt0", "mt1", "mt2", "mt3"]}
                />
              );
            }
            // ✅ Generic tile layer: any tilelayer with a url field
            if (layer.url) {
              return (
                <TileLayer
                  key={layer.id}
                  url={layer.url}
                  attribution={layer.attribution || ""}
                  maxZoom={layer.maxZoom || 25}
                  subdomains={layer.subdomains || "abc"}
                />
              );
            }
            return null;
          }


        /* -------------------- GEOJSON -------------------- */
        /* ===============================
           1️⃣ MARKER LAYER (SEPARATE)
        ================================= */
        if (layer.type === "markerlayer") {
          return (

            <RailwayMarkerLayer
              key={layer.id}
              layer={layer}
              onFeaturesLoaded={(keys: string[]) => setActiveFeatureKeys(prev => new Set([...prev, ...keys]))} />
          );
        }
        if (layer.type === "polygonlayer" || layer.type === "linelayer") {
          const geoData = geoJsonCache[layer.id];
          if (!geoData) return null;
          return (
            <GeoJSON
              key={`vector-${layer.id}`}
              data={geoData}
              style={(feature: any) => {
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
              } }
              onEachFeature={(feature, layerInstance) => {
                const popupField = layer.popupFieldName;
                if (popupField) {
                  const fieldValue = feature.properties?.[popupField] || "No Data";
                  const layerName = feature.properties?.layer || layer.name || "";
                  layerInstance.bindPopup(buildPopupHTML(layerName, fieldValue));
                }
              } } />
          );
        }

        return null;
      })
      )}
    </><Legend activeFeatureKeys={activeFeatureKeys} /></>
  );
};

export default DynamicLayerRenderer;