// ================================
// Railway Web GIS Styling Standard
// (All Layer Keys Uppercase)
// ================================

export const railwayStyleConfig: Record<string, any> = {
  /* ---------- POLYLINES ---------- */

  "MAIN LINES": {
    type: "line",
    color: "#E10600",
    weight: 4,
  },

  "OTHER LINES": {
    type: "line",
    color: "#555555",
    weight: 3,
  },

  "LOOP LINES": {
    type: "line",
    color: "#FF8C00",
    weight: 3,
    dashArray: "6,4",
  },

  "SHUNTS": {
    type: "line",
    color: "#800080",
    weight: 2,
    dashArray: "2,4",
  },

  "GLUE JOINTS": {
    type: "line",
    color: "#C0C0C0",
    weight: 2,
    dashArray: "4,4",
  },

  "OHE": {
    type: "line",
    color: "#00BFFF",
    weight: 2,
    dashArray: "6,3,2,3",
  },

  "RAILWAY BOUNDARY": {
    type: "line",
    color: "#000000",
    weight: 5,
    dashArray: "8,4,2,4",
  },

  "FOOT OVER BRIDGE": {
    type: "line",
    color: "#4682B4",
    weight: 4,
  },

  /* ---------- POLYGON / MIXED ---------- */

  "BRIDGE": {
    type: "mixed",
    color: "#003366",
    weight: 5,
    fillColor: "#003366",
    fillOpacity: 0.6,
  },

  "CULVERT": {
    type: "mixed",
    color: "#008080",
    weight: 4,
    fillColor: "#008080",
    fillOpacity: 0.6,
  },

  "RUB": {
    type: "mixed",
    color: "#006400",
    weight: 4,
    fillColor: "#006400",
    fillOpacity: 0.6,
  },

  "ROB": {
    type: "mixed",
    color: "#4B0082",
    weight: 4,
    fillColor: "#4B0082",
    fillOpacity: 0.6,
  },

  "BUILDING": {
    type: "polygon",
    color: "#D2B48C",
    fillColor: "#D2B48C",
    fillOpacity: 0.7,
  },

  "PLATFORM": {
    type: "polygon",
    color: "#FFC0CB",
    fillColor: "#FFC0CB",
    fillOpacity: 0.7,
  },

  "PARKING": {
    type: "polygon",
    color: "#87CEFA",
    fillColor: "#87CEFA",
    fillOpacity: 0.7,
  },

  "IB HUT": {
    type: "polygon",
    color: "#FF8C00",
    fillColor: "#FF8C00",
    fillOpacity: 0.7,
  },

  /* ---------- POINTS ---------- */

  "FIELD GEARS": {
    type: "point",
    color: "#8B4513",
    radius: 6,
  },

  "SIGNALS": {
    type: "point",
    color: "#008000",
    radius: 7,
  },

  "POINTS": {
    type: "point",
    color: "#0066CC",
    radius: 6,
  },

  "SAND HUMP": {
    type: "point",
    color: "#5A2D0C",
    radius: 6,
  },

  "DEAD END": {
    type: "point",
    color: "#000000",
    radius: 6,
  },

  "LC GATE": {
    type: "point",
    color: "#FFD700",
    radius: 7,
  },

  "BSLB": {
    type: "point",
    color: "#00CED1",
    radius: 6,
  },

  "FM": {
    type: "point",
    color: "#FF00FF",
    radius: 6,
  },

  "KM STONE": {
    type: "point",
    color: "#000000",
    fillColor: "#FFFFFF",
    radius: 7,
    weight: 2,
  },

  "STATION CENTER": {
    type: "point",
    color: "#FF0000",
    radius: 7,
  },

  "TOWER": {
    type: "point",
    color: "#8B0000",
    radius: 7,
  },
};