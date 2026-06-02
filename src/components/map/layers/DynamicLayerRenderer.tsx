import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { GeoJSON, WMSTileLayer, TileLayer } from "react-leaflet";
import L from "leaflet";
import RailwayMarkerLayer from "./MarkerLayer";


import DroneImageWMS from "./droneImage";

import WMSFeatureInfo from "./WMSFeatureInfo";
import VectorLayerRenderer from "./VectorLayerRenderer";
import LegendView from "../Legend";
import { setAvailableLayers } from "../../../store/slices/assetLayersSlice";

const DynamicLayerRenderer = () => {
  const sections = useSelector(
    (state: any) => state.layers.sections,
    shallowEqual
  );
  const [geoJsonCache, setGeoJsonCache] = useState<any>({});
  const [activeFeatureKeys, setActiveFeatureKeys] = useState<Set<string>>(new Set())
  const GEOSERVER_URL = import.meta.env.VITE_GEOSERVER_URL;

   const dispatch = useDispatch()


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

          const wfsUrl = `${GEOSERVER_URL}/${workspace}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${workspace}:${layerName}&outputFormat=application/json&srsName=EPSG:4326`;

          fetch(wfsUrl)
            .then((res) => res.json())
           .then((data) => {

  setGeoJsonCache((prev: any) => ({
    ...prev,
    [layer.id]: data
  }));

  const uniqueLayers = [
    ...new Set(
      data.features
        ?.map((f: any) =>
          f.properties?.layer
            ?.trim()
            ?.toUpperCase()
        )
        .filter(Boolean)
    )
  ];

dispatch(
  setAvailableLayers({
    parentType:
      String(layer.type),
    layers:
      uniqueLayers
  })
);

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
        if (!layer.isenabled) return null;

        /* -------------------- WMS -------------------- */
        if (layer.type === "wmslayer") {
          return (
            <>
              <WMSTileLayer
                key={layer.id}
                url={`${GEOSERVER_URL}/${layer.geoserverWorkSpace}/wms`}
                layers={layer.apiendpoint}
                format="image/png"
                transparent
                opacity={1}
                maxZoom={30}
                zIndex={500}
              />

              <WMSFeatureInfo
                layer={layer}
                GEOSERVER_URL={GEOSERVER_URL}
              />
            </>
          );
        }

        if (layer.type === "droneimagelayer") {
          return (
            <DroneImageWMS
              key={layer.id}
              layer={layer}
            />
          );
        }

        /* -------------------- TILE -------------------- */
        if (layer.type === "tilelayer") {
          if (layer.layerCode === "osm_tile") {
            return (
              <TileLayer
                key={layer.layerCode}
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={30}
                maxNativeZoom={19}
              />
            );
          }
          if (layer.layerCode === "google_street") {
            return (
              <TileLayer
                key={layer.layerCode}
                url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
                maxZoom={30}
                maxNativeZoom={19}
              />
            );
          }
          if (layer.layerCode === "satellite_tile") {
            return (
              <TileLayer
                key={layer.layerCode}
                url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
                maxZoom={30}
                maxNativeZoom={20}
              />
            );
          }
          if (layer.url) {
            return (
              <TileLayer
                key={layer.id}
                url={layer.url}
                attribution={layer.attribution || ""}
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
          return (
            <VectorLayerRenderer
              key={layer.id}
              layer={layer}
              geoData={geoJsonCache[layer.id]}
            />
          );
        }

        return null;
      })
      )}
    </><LegendView activeFeatureKeys={activeFeatureKeys} /></>
  );
};

export default DynamicLayerRenderer;