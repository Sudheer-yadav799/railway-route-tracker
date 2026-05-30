const getHierarchy = (layer: any) => {
  const name = layer.name?.toUpperCase() || "";
  const type = layer.type?.toUpperCase() || "";

  /* =========================
     1. RAILWAY LINES
  ========================= */
  if (type === "LINELAYER" || name.includes("LINE")) {
    return {
      group: "Railway Lines",
      subgroup: "All Lines",
    };
  }

  /* =========================
     2. MARKERS → SIGNALING
  ========================= */
  if (type === "MARKERLAYER") {
    return {
      group: "Signaling & Field Equipment",
      subgroup: "General",
    };
  }

  /* =========================
     3. OHE
  ========================= */
  if (name.includes("OHE")) {
    return {
      group: "OHE",
      subgroup: "OHE Poles",
    };
  }

  /* =========================
     4. UTILITIES
  ========================= */
  if (
    name.includes("BRIDGE") ||
    name.includes("CULVERT") ||
    name.includes("RUB") ||
    name.includes("ROB")
  ) {
    const subgroup =
      name.includes("ROB")
        ? "ROB"
        : name.includes("RUB")
        ? "RUB"
        : name.includes("BRIDGE")
        ? "Bridges"
        : name.includes("CULVERT")
        ? "Culvert"
        : "Other";

    return {
      group: "Utilities & Other Assets",
      subgroup,
    };
  }

  return {
    group: "Other Layers",
    subgroup: "General",
  };
};