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
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  return (
    <>
      {/* Floating Bottom Toggle Button (Always Visible) */}
      {!open && (
        <div className="floating-toggle" onClick={() => setOpen(true)}>
          <FiLayers />
          <span>Layers</span>
          <FiChevronUp />
        </div>
      )}

      {/* Main Panel */}
      {open && (
        <div className="layer-card">
          <div className="layer-card-header">
            <span>Layers</span>
            <FiX className="close-icon" onClick={() => setOpen(false)} />
          </div>

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
                            onChange={() =>
                              dispatch(toggleLayer(layer.id))
                            }
                          />
                          <span>{layer.name}</span>
                        </div>

                        <span
                          className="color-dot"
                          style={{ background: layer.color || "red" }}
                        />
                      </div>
                    ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default LayerPanelSection;