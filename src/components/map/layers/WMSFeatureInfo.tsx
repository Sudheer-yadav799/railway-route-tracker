import { useMapEvents, useMap } from "react-leaflet";
import { useRef } from "react";
import L from "leaflet";
import { buildPopupHTML } from "../../../utils/popups/popup";

interface Props {
  layer: any;
  GEOSERVER_URL: string;
}

const WMSFeatureInfo = ({ layer, GEOSERVER_URL }: Props) => {
  const map = useMap();
  const isLoading = useRef(false); 

  useMapEvents({
    click: async (e) => {
      if (isLoading.current) return;
      isLoading.current = true;

      try {
        const bounds = map.getBounds();
        const size = map.getSize();
        const point = map.latLngToContainerPoint(e.latlng);

        const url =
          `${GEOSERVER_URL}/${layer.geoserverWorkSpace}/wms?` +
          `service=WMS&version=1.1.1&request=GetFeatureInfo` +
          `&layers=${layer.apiendpoint}` +
          `&query_layers=${layer.apiendpoint}` +
          `&bbox=${bounds.toBBoxString()}` +
          `&height=${size.y}` +
          `&width=${size.x}` +
          `&info_format=application/json` +
          `&feature_count=1` + // faster
          `&srs=EPSG:4326` +
          `&x=${Math.floor(point.x)}` +
          `&y=${Math.floor(point.y)}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!data.features?.length) return;

        const feature = data.features[0];

        const popupField = layer.popupfield || "name";

        const fieldValue =
          feature.properties?.[popupField] || "No Data";

        const layerName =
          feature.properties?.layer || layer.name || "";

        L.popup()
          .setLatLng(e.latlng)
          .setContent(buildPopupHTML(fieldValue, layerName))
          .openOn(map);
      } catch (err) {
        console.error("FeatureInfo error", err);
      } finally {
        isLoading.current = false;
      }
    },
  });

  return null;
};

export default WMSFeatureInfo;