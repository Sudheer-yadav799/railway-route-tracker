import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleLayer } from "../../store/slices/layersSlice";
import {
  FiChevronDown,
  FiChevronUp,
  FiX,
  FiLayers,
} from "react-icons/fi";
import "../../styles/layerpanelsection.css";
import {
  toggleAssetLayer,
} from "../../store/slices/assetLayersSlice";

const LayerPanelSection = () => {
  const dispatch = useDispatch();
  const sections = useSelector((state: any) => state.layers.sections);

  const assetLayers = useSelector(
    (state: any) => state.assetLayers.enabledLayers
  );

  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<number[]>([]);

  const toggleCollapse = (id: number) => {
    setCollapsed((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  /* ================= COUNTS ================= */
  const totalLayers = sections?.reduce(
    (sum: number, s: any) =>
      sum + (s.layers?.length ?? 0),
    0
  );

  const enabledLayers = sections?.reduce(
    (sum: number, s: any) =>
      sum +
      (s.layers?.filter((l: any) => l.isenabled)
        .length ?? 0),
    0
  );

  /* ================= ACTIVE PARENTS ================= */
  const activeParents = useMemo(() => {
    return (
      sections
        ?.flatMap((s: any) => s.layers)
        ?.filter((l: any) => l.isenabled) || []
    );
  }, [sections]);

  const isAnyParentActive = activeParents.length > 0;

  /* ================= GROUP BY TYPE ONLY ================= */
  const getGroupName = (type: string) => {
    switch (type) {
      case "linelayer":
        return "Railway Lines (All lines)";
      case "markerlayer":
        return "Signaling & Field Equipment";
      case "polygonlayer":
        return "Utilities & Other Assets";
      
    }
  };

  /* ================= BUILD GROUPED ASSETS ================= */
const groupedAssets = useMemo(() => {
  const groups: Record<string, string[]> = {};

  if (!isAnyParentActive) return {}; // 🔥 IMPORTANT FIX

  const validParents = activeParents.filter(
    (p: any) => p?.type
  );

  if (!validParents.length) return {}; // 🔥 prevents undefined group

  Object.keys(assetLayers || {}).forEach((key) => {
    const normalizedKey = key?.trim()?.toUpperCase();
    if (!normalizedKey) return;

    validParents.forEach((parent: any) => {
      const group = getGroupName(parent.type);

      if (!group) return; // 🔥 prevent undefined

      if (!groups[group]) groups[group] = [];

      groups[group].push(normalizedKey);
    });
  });

  return groups;
}, [assetLayers, activeParents, isAnyParentActive]);
  return (
    <div className="layer-panel-wrap">

      {/* FLOAT BUTTON */}
      {!open && (
        <div
          className="floating-toggle"
          onClick={() => setOpen(true)}
        >
          <FiLayers />
          <span>Layers</span>

          <span className="layer-count-badge">
            {enabledLayers}/{totalLayers}
          </span>

          <FiChevronUp />
        </div>
      )}

      {/* PANEL */}
      {open && (
        <div className="layer-card">

          {/* HEADER */}
          <div className="layer-card-header">
            <div className="layer-card-header-left">
              <FiLayers />
              <span>Map Layers</span>

              <span className="layer-count-badge">
                {enabledLayers}/{totalLayers}
              </span>
            </div>

            <FiX
              className="close-icon"
              onClick={() => setOpen(false)}
            />
          </div>

          <div className="layer-card-body">

            {/* ================= BASE LAYERS ================= */}
            {sections
              ?.slice()
              .sort((a: any, b: any) => a.section - b.section)
              .map((section: any) => {
                const isCollapsed = collapsed.includes(
                  section.section
                );

                return (
                  <div
                    key={section.section}
                    className="layer-group"
                  >
                    <div
                      className="group-header"
                      onClick={() =>
                        toggleCollapse(section.section)
                      }
                    >
                      <span>{section.title}</span>

                      {isCollapsed ? (
                        <FiChevronDown />
                      ) : (
                        <FiChevronUp />
                      )}
                    </div>

                    {!isCollapsed &&
                      section.layers.map((layer: any) => (
                        <div
                          key={layer.id}
                          className="layer-item"
                        >
                          <div className="left">
                            <input
                              type="checkbox"
                              checked={layer.isenabled}
                              onChange={() =>
                                dispatch(
                                  toggleLayer(layer.id)
                                )
                              }
                            />
                            <span>{layer.name}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                );
              })}

            <hr style={{ margin: "10px 0" }} />

            {/* ================= RAILWAY ASSETS ================= */}
            <div className="layer-group">
              <div className="group-header">
                <span>Railway Assets</span>
              </div>

              {/* ❌ KEY FIX: FULL CLEAR WHEN PARENT OFF */}
              {!isAnyParentActive ? (
                <div style={{ padding: 10, color: "#888" }}>
                  No active layers
                </div>
              ) : (
                Object.entries(groupedAssets).map(
                  ([groupName, items]) => (
                    <div key={groupName} style={{ marginTop: 10 }}>

                      {/* GROUP HEADER */}
                      <div className="group-header">
                      {groupName}
                      </div>

                      {/* CHILD ITEMS */}
                      {items.map((layerName) => (
                        <div
                          key={layerName}
                          className="layer-item"
                        >
                          <div className="left">
                            <input
                              type="checkbox"
                              checked={
                                assetLayers[layerName] ?? false
                              }
                              onChange={() =>
                                dispatch(
                                  toggleAssetLayer(layerName)
                                )
                              }
                            />
                            <span>{layerName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default LayerPanelSection;