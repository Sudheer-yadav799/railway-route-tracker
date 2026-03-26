// ================================
// Railway Web GIS Styling Standard
// (All Layer Keys Uppercase)
// ================================
export const railwayStyleConfig: Record<string, any> = {

  /* ---------- POLYLINES ---------- */

  "MAIN LINES": {
    type: "line",
    color: "#FF3B30", // strong red (primary track)
    weight: 4,
  },

  "OTHER LINES": {
    type: "line",
    color: "#1E90FF", // blue
    weight: 3,
  },

  "LOOP LINES": {
    type: "line",
    color: "#FF9500", // orange
    weight: 3,
    dashArray: "6,4",
  },

  "SHUNTS": {
    type: "line",
    color: "#AF52DE", // violet
    weight: 2,
    dashArray: "2,4",
  },

  "GLUE JOINTS": {
    type: "line",
    color: "#FFD60A", // yellow (visible on imagery)
    weight: 2,
    dashArray: "4,4",
  },

  "OHE": {
    type: "line",
    color: "#00C7BE", // cyan
    weight: 2,
    dashArray: "6,3,2,3",
  },

  "RAILWAY BOUNDARY": {
    type: "line",
    color: "#34C759", // green boundary
    weight: 4,
    dashArray: "8,4",
  },

  "FOOT OVER BRIDGE": {
    type: "line",
    color: "#5AC8FA", // light blue
    weight: 4,
  },

  /* ---------- POLYGON / MIXED ---------- */

  "BRIDGE": {
    type: "mixed",
    color: "#0A84FF",
    fillColor: "#0A84FF",
    fillOpacity: 0.6,
  },

  "CULVERT": {
    type: "mixed",
    color: "#30D158",
    fillColor: "#30D158",
    fillOpacity: 0.6,
  },

  "RUB": {
    type: "mixed",
    color: "#64D2FF",
    fillColor: "#64D2FF",
    fillOpacity: 0.6,
  },

  "ROB": {
    type: "mixed",
    color: "#BF5AF2",
    fillColor: "#BF5AF2",
    fillOpacity: 0.6,
  },

  "BUILDING": {
    type: "polygon",
    color: "#FF9F0A",
    fillColor: "#FF9F0A",
    fillOpacity: 0.7,
  },

  "PLATFORM": {
    type: "polygon",
    color: "#FFD60A",
    fillColor: "#FFD60A",
    fillOpacity: 0.7,
  },

  "PARKING": {
    type: "polygon",
    color: "#32D74B",
    fillColor: "#32D74B",
    fillOpacity: 0.7,
  },

  "IB HUT": {
    type: "polygon",
    color: "#FF6B00",
    fillColor: "#FF6B00",
    fillOpacity: 0.7,
  },

  /* ---------- POINTS ---------- */

  "FIELD GEARS": {
    type: "point",
    color: "#A2845E",
    radius: 6,
  },

  "SIGNALS": {
    type: "point",
    color: "#34C759", // green signal
    radius: 7,
  },

  "POINTS": {
    type: "point",
    color: "#007AFF",
    radius: 6,
  },

  "SAND HUMP": {
    type: "point",
    color: "#C17F2E",
    radius: 6,
  },

  "DEAD END": {
    type: "point",
    color: "#FF453A",
    radius: 6,
  },

  "LC GATE": {
    type: "point",
    color: "#FFD60A",
    radius: 7,
  },

  "BSLB": {
    type: "point",
    color: "#00C7BE",
    radius: 6,
  },

  "FM": {
    type: "point",
    color: "#AF52DE",
    radius: 6,
  },

  "KM STONE": {
    type: "point",
    color: "#FF9F0A",
    radius: 7,
  },

  "STATION CENTER": {
    type: "point",
    color: "#FF3B30",
    radius: 7,
  },

  "TOWER": {
    type: "point",
    color: "#BF5AF2",
    radius: 7,
  },
}