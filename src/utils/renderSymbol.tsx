
export const renderSymbol = (layer: any) => {
  const c = layer.color || "#999";

  if (layer.type === "polyline") {
    const dash =
      layer.id?.includes("LOOP")     ? "6,4"     :
      layer.id?.includes("SHUNT")    ? "2,4"     :
      layer.id?.includes("OHE")      ? "6,3,2,3" :
      layer.id?.includes("GLUE")     ? "4,4"     :
      layer.id?.includes("BOUNDARY") ? "8,4,2,4" : undefined;

    const sw =
      layer.id?.includes("MAIN")     ? 4 :
      layer.id?.includes("BOUNDARY") ? 5 :
      layer.id?.includes("FOOT")     ? 4 : 2;

    return (
      <svg width="80" height="20">
        <line x1="5" y1="10" x2="75" y2="10"
          stroke={c} strokeWidth={sw}
          strokeDasharray={dash}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (layer.type === "polygon") {
    return (
      <svg width="30" height="30">
        <rect x="4" y="4" width="22" height="22"
          fill={c} fillOpacity="0.7"
          stroke={c} strokeWidth="1.5"
        />
      </svg>
    );
  }

  if (layer.type === "label") {
    return <span style={{ color: c, fontWeight: 700, fontSize: 13 }}>Abc</span>;
  }

  // point — special cases
  if (layer.id === "STATION_CENTER") {
    return (
      <svg width="30" height="30">
        <line x1="15" y1="4"  x2="15" y2="26" stroke={c} strokeWidth="3" />
        <line x1="4"  y1="15" x2="26" y2="15" stroke={c} strokeWidth="3" />
      </svg>
    );
  }
  if (layer.id === "SAND_HUMP") {
    return <svg width="30" height="30"><polygon points="15,4 26,26 4,26" fill={c} /></svg>;
  }
  if (layer.id === "TOWER") {
    return <svg width="30" height="30"><rect x="13" y="4" width="4" height="22" fill={c} /></svg>;
  }
  if (layer.id === "KM_STONE") {
    return (
      <svg width="30" height="30">
        <circle cx="15" cy="15" r="10" fill={c} stroke="#000" strokeWidth="2"/>
      </svg>
    );
  }

  // default point
  return (
    <svg width="30" height="30">
      <circle cx="15" cy="15" r="7" fill={c} />
    </svg>
  );
};