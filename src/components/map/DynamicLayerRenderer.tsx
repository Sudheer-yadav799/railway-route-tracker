import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GeoJSON, WMSTileLayer, TileLayer } from "react-leaflet";
import L from "leaflet";

const DynamicLayerRenderer = () => {
  const sections = useSelector((state: any) => state.layers.sections);
  const [geoJsonCache, setGeoJsonCache] = useState<any>({});

  /* --------------------------
     Load GeoJSON dynamically
  -------------------------- */
  useEffect(() => {
    sections?.forEach((section: any) => {
      section.layers.forEach((layer: any) => {
        if (
          layer.isenabled &&
          ["markerlayer", "polygonlayer", "linelayer"].includes(layer.type) &&
          !geoJsonCache[layer.id]
        ) {
          const workspace = layer.geoserverWorkSpace;
          const layerName = layer.apiendpoint;

          const wfsUrl = `http://localhost:8082/geoserver/${workspace}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${workspace}:${layerName}&outputFormat=application/json&srsName=EPSG:4326`;

          fetch(wfsUrl)
            .then((res) => res.json())
            .then((data) => {
              setGeoJsonCache((prev: any) => ({ ...prev, [layer.id]: data }));
              console.log("data", data);
            })
            .catch((err) =>
              console.error(`❌ Failed loading WFS ${layer.id}`, err)
            );
        }
      });
    });
  }, [sections]);

  return (
    <>
      {sections?.map((section: any) =>
        section.layers.map((layer: any) => {
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
                opacity={parseFloat(layer.opacity || "1")}
              />
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
                  maxZoom={layer.maxZoom || 22}
                  subdomains={layer.subdomains || "abc"}
                />
              );
            }
            return null;
          }

          /* -------------------- GEOJSON -------------------- */
          if (["markerlayer", "polygonlayer", "linelayer"].includes(layer.type)) {
            const geoData = geoJsonCache[layer.id];
            if (!geoData) return null;

            return (
              <GeoJSON
                key={layer.id}
                data={geoData}
                style={
                  layer.type === "polygonlayer"
                    ? {
                        color: layer.color,
                        fillColor: layer.fillcolor,
                        fillOpacity: 0.5,
                        weight: 2,
                      }
                    : layer.type === "linelayer"
                    ? { color: layer.color, weight: 3 }
                    : undefined
                }
                pointToLayer={(feature, latlng) => {
                  if (layer.type === "markerlayer") {
                    return L.circleMarker(latlng, {
                      radius: 6,
                      color: layer.color,
                      fillColor: layer.fillcolor,
                      fillOpacity: 1,
                    });
                  }
                  return L.marker(latlng);
                }}
                onEachFeature={(feature, layerInstance) => {
                  const popupField = layer.popupFieldName;
                  if (popupField) {
                    layerInstance.bindPopup(
                      feature.properties?.[popupField] || "No Data"
                    );
                  }
                }}
              />
            );
          }

          return null;
        })
      )}
    </>
  );
};

export default DynamicLayerRenderer;