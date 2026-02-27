import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleLayer } from "../../store/slices/layersSlice";
import { FiChevronDown, FiChevronUp, FiX, FiLayers } from "react-icons/fi";
import "../../styles/layerpanelsection.css";

const LayerPanelSection = () => {
  const dispatch = useDispatch();
  const sections = useSelector((state: any) => state.layers.sections);

  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<number[]>([]);

  const toggleCollapse = (id: number) => {
    setCollapsed((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Count total enabled layers
  const totalLayers = sections?.reduce(
    (sum: number, s: any) => sum + (s.layers?.length ?? 0),
    0
  );
  const enabledLayers = sections?.reduce(
    (sum: number, s: any) =>
      sum + (s.layers?.filter((l: any) => l.isenabled).length ?? 0),
    0
  );

  return (
    <div className="layer-panel-wrap">
      {/* Floating toggle when closed */}
      {!open && (
        <div className="floating-toggle" onClick={() => setOpen(true)}>
          <FiLayers />
          <span>Layers</span>
          {enabledLayers != null && (
            <span
              style={{
                background: "rgba(0,200,255,0.15)",
                border: "1px solid rgba(0,200,255,0.25)",
                borderRadius: 20,
                padding: "1px 7px",
                fontSize: 10,
                fontWeight: 700,
                color: "#00c8ff",
              }}
            >
              {enabledLayers}/{totalLayers}
            </span>
          )}
          <FiChevronUp />
        </div>
      )}

      {/* Main panel */}
      {open && (
        <div className="layer-card">
          {/* Header */}
          <div className="layer-card-header">
            <div className="layer-card-header-left">
              <FiLayers />
              <span>Map Layers</span>
              <span className="layer-count-badge">
                {enabledLayers}/{totalLayers}
              </span>
            </div>
            <FiX className="close-icon" onClick={() => setOpen(false)} />
          </div>

          {/* Body */}
          <div className="layer-card-body">
            {sections?.map((section: any) => {
              const isCollapsed = collapsed.includes(section.section);

              return (
                <div key={section.section} className="layer-group">
                  <div
                    className="group-header"
                    onClick={() => toggleCollapse(section.section)}
                  >
                    <span>{section.title}</span>
                    {isCollapsed ? <FiChevronDown /> : <FiChevronUp />}
                  </div>

                  {!isCollapsed &&
                    section.layers.map((layer: any) => (
                      <div key={layer.id} className="layer-item">
                        <div className="left">
                          <input
                            type="checkbox"
                            checked={layer.isenabled}
                            onChange={() => dispatch(toggleLayer(layer.id))}
                          />
                          <span>{layer.name}</span>
                        </div>
                        <span
                          className="color-dot"
                          style={{ background: layer.color || "#00c8ff" }}
                        />
                      </div>
                    ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LayerPanelSection;