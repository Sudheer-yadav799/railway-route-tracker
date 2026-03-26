

const layerStyles = [
  // POLYLINES
  { name: "Main Lines", type: "Polyline", color: "#E10600", width: "4px", style: "solid", preview: "━━━" },
  { name: "Other Lines", type: "Polyline", color: "#555555", width: "3px", style: "solid", preview: "───" },
  { name: "Loop Lines", type: "Polyline", color: "#FF8C00", width: "3px", style: "dash", preview: "- - -" },
  { name: "Shunts", type: "Polyline", color: "#800080", width: "2px", style: "dot", preview: "···" },
  { name: "OHE", type: "Polyline", color: "#00BFFF", width: "2px", style: "dash-dot", preview: "- · -" },
  { name: "Foot Over Bridge", type: "Polyline", color: "#4682B4", width: "4px", style: "solid", preview: "━━━" },
  { name: "Railway Boundary", type: "Polyline", color: "#000000", width: "5px", style: "dash-dot", preview: "- · -" },

  // POINTS
  { name: "Signals", type: "Point", color: "#008000", size: "14px", preview: "●" },
  { name: "Points", type: "Point", color: "#0066CC", size: "12px", preview: "●" },
  { name: "Station Center", type: "Point", color: "#FF0000", size: "14px", preview: "✚" },
  { name: "Tower", type: "Point", color: "#8B0000", size: "14px", preview: "🗼" },
  { name: "Sand Hump", type: "Point", color: "#5A2D0C", size: "12px", preview: "▲" },
  { name: "LC Gate", type: "Point", color: "#FFD700", size: "14px", preview: "●" },

  // POLYGONS
  { name: "Building", type: "Polygon", color: "#D2B48C", preview: "■" },
  { name: "Platform", type: "Polygon", color: "#FFC0CB", preview: "■" },
  { name: "Parking", type: "Polygon", color: "#87CEFA", preview: "■" },
  { name: "IB HUT", type: "Polygon", color: "#FF8C00", preview: "■" },
  { name: "Bridge", type: "Polygon", color: "#003366", preview: "■" },
  { name: "Culvert", type: "Polygon", color: "#008080", preview: "■" },
  { name: "RUB", type: "Polygon", color: "#006400", preview: "■" },
  { name: "ROB", type: "Polygon", color: "#4B0082", preview: "■" },
];

const AdminLayerStyles = () => {
  return (
    <div className="layer-style-wrapper">

      <h2 className="page-title">Railway Web GIS Styling Standard</h2>

      <div className="layer-style-table">

        <div className="layer-style-row header">
          <div>Layer Name</div>
          <div>Type</div>
          <div>Color</div>
          <div>Preview</div>
        </div>

        {layerStyles.map((layer, index) => (
          <div key={index} className="layer-style-row">

            <div>{layer.name}</div>

            <div>
              <span className="type-badge">{layer.type}</span>
            </div>

            <div>
              <span
                className="color-box"
                style={{ background: layer.color }}
              />
              {layer.color}
            </div>

            <div
              className="symbol-preview"
              style={{ color: layer.color }}
            >
              {layer.preview}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default AdminLayerStyles;