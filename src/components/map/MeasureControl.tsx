import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-measure";

const MeasureControl = () => {
  const map = useMap();

  useEffect(() => {
    const measureControl =
      new (L as any).Control.Measure({
        position: "topleft",

        /* ================= AREA UNITS ================= */

        primaryAreaUnit:
          "sqmeters",

        secondaryAreaUnit:
          "acres",

        /* ================= COLORS ================= */

        activeColor:
          "#fc7a00",

        completedColor:
          "#00FFFF",

        /* ================= CUSTOM UNITS ================= */

        units: {
          sqmeters: {
            factor: 1,
            display:
              "Sq Meter",
            decimals: 2,
          },

          sqft: {
            factor:
              10.7639,
            display:
              "Sq Ft",
            decimals: 2,
          },

          acres: {
            factor:
              0.000247105,
            display:
              "Acres",
            decimals: 4,
          },
        },

        /* ================= SHOW ONLY AREA ================= */

        captureZIndex:
          10000,
      });

    map.addControl(
      measureControl
    );

    /* ================= STORE ORIGINAL METHODS ================= */

    const originalPanBy =
      map.panBy.bind(map);

    const originalPanTo =
      map.panTo.bind(map);

    const originalSetView =
      map.setView.bind(map);

    const originalFlyTo =
      (
        map as any
      ).flyTo?.bind(map);

    /* ================= DISABLE PAN ================= */

    const disablePan =
      () => {
        map.dragging.disable();
        map.scrollWheelZoom.disable();
        map.doubleClickZoom.disable();
        map.boxZoom.disable();
        map.touchZoom.disable();

        // Prevent auto pan
        map.panBy = () =>
          map;

        map.panTo = () =>
          map;

        map.setView =
          () => map;

        if (
          (
            map as any
          ).flyTo
        ) {
          (
            map as any
          ).flyTo =
            () => map;
        }
      };

    /* ================= ENABLE PAN ================= */

    const enablePan =
      () => {
        map.dragging.enable();
        map.scrollWheelZoom.enable();
        map.doubleClickZoom.enable();
        map.boxZoom.enable();
        map.touchZoom.enable();

        map.panBy =
          originalPanBy;

        map.panTo =
          originalPanTo;

        map.setView =
          originalSetView;

        if (
          (
            map as any
          ).flyTo
        ) {
          (
            map as any
          ).flyTo =
            originalFlyTo;
        }
      };

    map.on(
      "measurestart",
      disablePan
    );

    map.on(
      "measurefinish",
      enablePan
    );

    map.on(
      "measurecancel",
      enablePan
    );

    return () => {
      map.off(
        "measurestart",
        disablePan
      );

      map.off(
        "measurefinish",
        enablePan
      );

      map.off(
        "measurecancel",
        enablePan
      );

      map.removeControl(
        measureControl
      );
    };
  }, [map]);

  return null;
};

export default MeasureControl;