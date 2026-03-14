import L from "leaflet";

const createIcon = (iconName: string, size = 24) =>
  L.icon({
    iconUrl: `src/assets/railway-icons/${iconName}.svg`,
    iconSize: [size, size],
  });

export const railwayMarkerIcons: Record<string, L.Icon> = {
  "POLE WITH ID": createIcon("POLEWITHID", 22),
  "POLE ID": createIcon("POLEID", 22),
  "SIGNALS": createIcon("SIGNALS", 24),
  "KM": createIcon("KM", 26),
  "KM STONE": createIcon("KM STONE", 26),
  "STATION CENTER": createIcon("STATION CENTER", 26),
  "TOWER": createIcon("TOWER", 26),
  "FIELD GEARS": createIcon("FIELDGEARS", 24),
  "LC GATE": createIcon("LCGATE", 24),
  "POINTS": createIcon("POINTS", 22),
  "SAND HUMP": createIcon("SANDHUMP", 22),
  "DEADEND": createIcon("DEADEND", 22),
  "BSLB": createIcon("BSLB", 22),
  "FM": createIcon("FM", 22),
  "STOPBOARD": createIcon("STOPBOARD", 22),
  "BRIDGE": createIcon("BRIDGE", 24),
  "CULVERT": createIcon("CULVERT", 24),
  "RUB": createIcon("RUB", 24),
  "ROB": createIcon("ROB", 24),
  "ISSUES": createIcon("Points", 22),
  // Default fallback icon
  "DEFAULT": createIcon("Points", 20),
};