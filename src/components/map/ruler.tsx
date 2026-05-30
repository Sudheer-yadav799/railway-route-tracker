import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const DistanceRuler = () => {
  const map = useMap();

  const pointsRef = useRef<L.LatLng[]>([]);
  const activeRef = useRef(false);

  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const popupRef = useRef<L.Popup | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const formatDistance = (m: number) =>
    m < 1000 ? `${m.toFixed(2)} m` : `${(m / 1000).toFixed(3)} km`;

  useEffect(() => {
    // -----------------------------
    // CREATE LAYER GROUP
    // -----------------------------
    layerGroupRef.current = L.layerGroup().addTo(map);

    // -----------------------------
    // CLEAR ALL (100% SAFE RESET)
    // -----------------------------
    const clearAll = () => {
      pointsRef.current = [];
      activeRef.current = false;

      layerGroupRef.current?.clearLayers();

      if (popupRef.current) {
        map.closePopup(popupRef.current);
        popupRef.current = null;
      }

      if (btnRef.current) {
        btnRef.current.style.background = "white";
      }
    };

    // -----------------------------
    // CALCULATE DISTANCE
    // -----------------------------
    const calculateDistance = (pts: L.LatLng[]) => {
      let total = 0;
      for (let i = 1; i < pts.length; i++) {
        total += pts[i - 1].distanceTo(pts[i]);
      }
      return total;
    };

    // -----------------------------
    // UPDATE LINE + POPUP
    // -----------------------------
    const updateLine = () => {
      layerGroupRef.current?.clearLayers();

      const polyline = L.polyline(pointsRef.current, {
        color: "#ff0000",
        weight: 3,
      });

      layerGroupRef.current?.addLayer(polyline);

      const last = pointsRef.current[pointsRef.current.length - 1];
      const dist = calculateDistance(pointsRef.current);

      // -----------------------------
      // CREATE SAFE CONTAINER
      // -----------------------------
      const container = L.DomUtil.create("div");

      container.innerHTML = `
        <div style="font-size:13px;">
          📏 <b>${formatDistance(dist)}</b>
          <div style="margin-top:6px;">
            <button id="clearBtn"
              style="padding:3px 6px; font-size:11px; cursor:pointer;">
              Clear
            </button>
          </div>
        </div>
      `;

      // prevent map interactions
      L.DomEvent.disableClickPropagation(container);

      if (popupRef.current) {
        map.closePopup(popupRef.current);
      }

      popupRef.current = L.popup({
        closeButton: false,
        autoClose: false,
      })
        .setLatLng(last)
        .setContent(container)
        .openOn(map);

      // -----------------------------
      // SAFE EVENT BINDING
      // -----------------------------
      const btn = container.querySelector("#clearBtn");

      if (btn) {
        L.DomEvent.on(btn as HTMLElement, "click", (e) => {
          L.DomEvent.stopPropagation(e);
          clearAll();
        });
      }
    };

    // -----------------------------
    // RULER BUTTON
    // -----------------------------
    const RulerControl = L.Control.extend({
      onAdd: () => {
        const btn = L.DomUtil.create("button");

        btn.innerHTML = "📏";
        btn.title = "Distance Ruler";

        btn.style.width = "34px";
        btn.style.height = "34px";
        btn.style.background = "white";
        btn.style.border = "2px solid #ccc";
        btn.style.borderRadius = "6px";
        btn.style.cursor = "pointer";

        L.DomEvent.disableClickPropagation(btn);

        btn.onclick = () => {
          activeRef.current = !activeRef.current;

          btn.style.background = activeRef.current
            ? "#ffe0e0"
            : "white";

          if (!activeRef.current) clearAll();
        };

        btnRef.current = btn;
        return btn;
      },
    });

    const control = new RulerControl({ position: "topleft" });
    map.addControl(control);

    // -----------------------------
    // MAP CLICK
    // -----------------------------
    const onClick = (e: L.LeafletMouseEvent) => {
      if (!activeRef.current) return;

      pointsRef.current.push(e.latlng);
      updateLine();
    };

    const onDblClick = () => {
      activeRef.current = false;
      clearAll();
    };

    map.on("click", onClick);
    map.on("dblclick", onDblClick);

    return () => {
      map.off("click", onClick);
      map.off("dblclick", onDblClick);

      map.removeControl(control);
      layerGroupRef.current?.clearLayers();
    };
  }, [map]);

  return null;
};

export default DistanceRuler;