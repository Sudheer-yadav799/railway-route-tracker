
import L from "leaflet";


import POLEID from "../../assets/railway-icons/POLEID.svg";
import SIGNALS from "../../assets/railway-icons/SIGNAL.svg";
import KM_STONE from "../../assets/railway-icons/KMSTONE.svg";
import STATION_CENTER from "../../assets/railway-icons/STATIONCENTER.svg";
import TOWER from "../../assets/railway-icons/TOWER.svg";
import FIELDGEARS from "../../assets/railway-icons/FIELDGEARS.svg";
import LCGATE from "../../assets/railway-icons/LCGATE.svg";
import POINTS from "../../assets/railway-icons/POINTS.svg";
import SANDHUMP from "../../assets/railway-icons/SANDHUMP.svg";
import DEADEND from "../../assets/railway-icons/DEADEND.svg";
import BSLB from "../../assets/railway-icons/BSLB.svg";
import FM from "../../assets/railway-icons/FM.svg";
import STOPBOARD from "../../assets/railway-icons/STOPBOARD.svg";
import BRIDGE from "../../assets/railway-icons/BRIDGE.svg";
import CULVERT from "../../assets/railway-icons/CULVERT.svg";
import RUB from "../../assets/railway-icons/RUB.svg";
import ROB from "../../assets/railway-icons/ROB.svg";
import SHUNTS from "../../assets/railway-icons/SHUNTS.svg";
import BOARDS from "../../assets/railway-icons/BOARD.png";
import SHUNT from "../../assets/railway-icons/SHUNT.png";
import POINT from "../../assets/railway-icons/POINT.png";

const createIcon = (iconUrl: string, size = 24) =>
  L.icon({
    iconUrl,
    iconSize: [size, size],
    className: "railway-icon",
  });

export const railwayMarkerIcons: Record<string, L.Icon> = {
  "POLE WITH ID": createIcon(POLEID, 22),
  "POLES WITH ID": createIcon(POLEID, 22),
  "POLE ID": createIcon(POLEID, 22),
  "POLES ID": createIcon(POLEID, 22),
  "SIGNALS": createIcon(SIGNALS, 24),
  "SIGNAL": createIcon(SIGNALS, 24),
  "KM": createIcon(KM_STONE, 26),
  "KM STONE": createIcon(KM_STONE, 26),
  "STATIONCENTER": createIcon(STATION_CENTER, 26),
  "STATION CENTER": createIcon(STATION_CENTER, 26),
  "TOWER": createIcon(TOWER, 26),
  "FIELD GEARS": createIcon(FIELDGEARS, 24),
  "LC GATE": createIcon(LCGATE, 24),
  "POINTS": createIcon(POINTS, 22),
  "SAND HUMP": createIcon(SANDHUMP, 22),
  "DEADEND": createIcon(DEADEND, 22),
  "BSLB": createIcon(BSLB, 22),
  "FM": createIcon(FM, 22),
  "SHUNTS": createIcon(SHUNTS, 22),
  "STOPBOARD": createIcon(BOARDS, 22),
  "BRIDGE": createIcon(BRIDGE, 24),
  "CULVERT": createIcon(CULVERT, 24),
  "RUB": createIcon(RUB, 24),
  "ROB": createIcon(ROB, 24),
  "ISSUES": createIcon(POINTS, 22),
  "DEFAULT": createIcon(POINTS, 20),
  "SHUNT" : createIcon(SHUNT,20),
  "POINT" : createIcon(POINT,40)
};



const SPECIAL_NAME_LAYERS = [
  "STATION CENTER",
  "CULVERT",
  "RUB",
  "ROB",
  "FIELD GEARS",
  "LC GATE",
  "POINTS",
  "SAND HUMP",
  "DEADEND",
  "BSLB",
  "FM",
  "STOPBOARD",
  "BRIDGE"
]

// const ALL_LAYERS = [
//   "POLE WITH ID",
//   "POLE ID",
//   "SIGNALS",
//   "SIGNAL",
//   "KM",
//   "KM STONE",
//   "STATION CENTER",
//   "TOWER",
//   "FIELD GEARS",
//   "LC GATE",
//   "POINTS",
//   "SAND HUMP",
//   "DEADEND",
//   "BSLB",
//   "FM",
//   "STOPBOARD",
//   "BRIDGE",
//   "CULVERT",
//   "RUB",
//   "ROB",
//   "ISSUES",
//   "DEFAULT"
// ]

 export const getLabelText = (layer: string) => {
  if (!layer) return ""

  let cleanLayer = layer.toUpperCase().trim()

  // Remove unwanted keywords (example: remove extra "WITH")
  cleanLayer = cleanLayer.replace("WITH", "").trim()

  // If layer is in special list → return Name label
  if (SPECIAL_NAME_LAYERS.includes(cleanLayer)) {
    return "Name"
  }

  // If not containing ID → append ID
  if (!cleanLayer.includes("ID")) {
    return `${cleanLayer} ID`
  }

  return cleanLayer
}



export const getMarkerIconByName = (
  layer?: string,
  name?: string
): L.Icon => {
  const normalizedLayer = layer?.trim().toUpperCase() || "DEFAULT";

  // Only SIGNAL layer uses name-based icon selection
  if (
    normalizedLayer === "SIGNAL" ||
    normalizedLayer === "SIGNALS"
  ) {
    const cleanName = (name || "").trim().toUpperCase();

    // SH30, SH19, S6/SH19
    if (
      cleanName.startsWith("SH") ||
      cleanName.includes("/SH")
    ) {
      return railwayMarkerIcons.SHUNT;
    }

    // P9A, P27A, P10A
    if (cleanName.startsWith("P")) {
      return railwayMarkerIcons.POINT;
    }

    // LC12, LC5
    if (cleanName.startsWith("LC")) {
      return railwayMarkerIcons["LC GATE"];
    }

    // SB10
    if (cleanName.startsWith("SB")) {
      return railwayMarkerIcons.STOPBOARD;
    }

    // W/L-01, WL01
    if (
      cleanName.startsWith("W/L") ||
      cleanName.startsWith("WL")
    ) {
      return railwayMarkerIcons.STOPBOARD;
    }

    // FM1
    if (cleanName.startsWith("FM")) {
      return railwayMarkerIcons.FM;
    }

    // S37, S 26, S38, S1D
    if (cleanName.startsWith("S")) {
      return railwayMarkerIcons.SIGNALS;
    }

    return railwayMarkerIcons.SIGNALS;
  }

  // All other layers use normal layer icon
  return (
    railwayMarkerIcons[normalizedLayer] ||
    railwayMarkerIcons.DEFAULT
  );
};