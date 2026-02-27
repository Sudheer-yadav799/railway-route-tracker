import { useState } from "react";
import "./styles/admin-layer-styles.css";

const PAGE_SIZE = 10;


const LayerStylesDashboard = () => {
    const [page, setPage] = useState(1);

    const layers = [
        // POLYLINE
        { name: "Main Lines", type: "Polyline", preview: "━━━", color: "#E10600" },
        { name: "Other Lines", type: "Polyline", preview: "───", color: "#555555" },
        { name: "Loop Lines", type: "Polyline", preview: "- - -", color: "#FF8C00" },
        { name: "Shunts", type: "Polyline", preview: "···", color: "#800080" },
        { name: "Glue Joints", type: "Polyline", preview: "- - -", color: "#C0C0C0" },
        { name: "OHE", type: "Polyline", preview: "- · -", color: "#00BFFF" },
        { name: "Foot Over Bridge", type: "Polyline", preview: "━━━", color: "#4682B4" },
        { name: "Railway Boundary", type: "Polyline", preview: "- · -", color: "#000000" },

        // POINT
        { name: "Field Gears", type: "Point", preview: "●", color: "#8B4513" },
        { name: "Signals", type: "Point", preview: "●", color: "#008000" },
        { name: "Points", type: "Point", preview: "●", color: "#0066CC" },
        { name: "Sand Hump", type: "Point", preview: "▲", color: "#5A2D0C" },
        { name: "Dead End", type: "Point", preview: "●", color: "#000000" },
        { name: "LC Gate", type: "Point", preview: "●", color: "#FFD700" },
        { name: "BSLB", type: "Point", preview: "●", color: "#00CED1" },
        { name: "FM", type: "Point", preview: "●", color: "#FF00FF" },
        { name: "KM Stone", type: "Point", preview: "⬤", color: "#FFFFFF" },
        { name: "Station Center", type: "Point", preview: "✚", color: "#FF0000" },
        { name: "Tower", type: "Point", preview: "🗼", color: "#8B0000" },

        // POLYGON
        { name: "Bridge", type: "Polygon", preview: "■", color: "#003366" },
        { name: "Culvert", type: "Polygon", preview: "■", color: "#008080" },
        { name: "RUB", type: "Polygon", preview: "■", color: "#006400" },
        { name: "ROB", type: "Polygon", preview: "■", color: "#4B0082" },
        { name: "Building", type: "Polygon", preview: "■", color: "#D2B48C" },
        { name: "Platform", type: "Polygon", preview: "■", color: "#FFC0CB" },
        { name: "Parking", type: "Polygon", preview: "■", color: "#87CEFA" },
        { name: "IB HUT", type: "Polygon", preview: "■", color: "#FF8C00" },

        // LABEL
        { name: "Station Name", type: "Label", preview: "Text", color: "#000000" },
        { name: "Distance", type: "Label", preview: "Text", color: "#666666" },
    ];
    const totalPages = Math.ceil(layers.length / PAGE_SIZE);

    const paginatedData = layers.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );


    const renderSymbol = (layer: any) => {
        switch (layer.name) {

            // ───── POLYLINES ─────
            case "Main Lines":
                return (
                    <svg width="80" height="20">
                        <line x1="5" y1="10" x2="75" y2="10"
                            stroke="#E10600"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                    </svg>
                );

            case "Other Lines":
                return (
                    <svg width="80" height="20">
                        <line x1="5" y1="10" x2="75" y2="10"
                            stroke="#555555"
                            strokeWidth="3"
                        />
                    </svg>
                );

            case "Loop Lines":
                return (
                    <svg width="80" height="20">
                        <line x1="5" y1="10" x2="75" y2="10"
                            stroke="#FF8C00"
                            strokeWidth="3"
                            strokeDasharray="6,4"
                        />
                    </svg>
                );

            case "Shunts":
                return (
                    <svg width="80" height="20">
                        <line x1="5" y1="10" x2="75" y2="10"
                            stroke="#800080"
                            strokeWidth="2"
                            strokeDasharray="2,4"
                        />
                    </svg>
                );

            case "OHE":
                return (
                    <svg width="80" height="20">
                        <line x1="5" y1="10" x2="75" y2="10"
                            stroke="#00BFFF"
                            strokeWidth="2"
                            strokeDasharray="6,3,2,3"
                        />
                    </svg>
                );

            // ───── POINTS ─────
            case "Signals":
                return (
                    <svg width="30" height="30">
                        <circle cx="15" cy="15" r="6" fill="#008000" />
                    </svg>
                );

            case "Station Center":
                return (
                    <svg width="30" height="30">
                        <line x1="15" y1="5" x2="15" y2="25"
                            stroke="#FF0000"
                            strokeWidth="3"
                        />
                        <line x1="5" y1="15" x2="25" y2="15"
                            stroke="#FF0000"
                            strokeWidth="3"
                        />
                    </svg>
                );

            case "Sand Hump":
                return (
                    <svg width="30" height="30">
                        <polygon points="15,5 25,25 5,25"
                            fill="#5A2D0C"
                        />
                    </svg>
                );

            case "Tower":
                return (
                    <svg width="30" height="30">
                        <rect x="13" y="5" width="4" height="20"
                            fill="#8B0000"
                        />
                    </svg>
                );

            // ───── POLYGONS ─────
            case "Building":
                return (
                    <svg width="30" height="30">
                        <rect x="5" y="5" width="20" height="20"
                            fill="#D2B48C"
                        />
                    </svg>
                );

            case "Platform":
                return (
                    <svg width="30" height="30">
                        <rect x="5" y="10" width="20" height="10"
                            fill="#FFC0CB"
                        />
                    </svg>
                );

            default:
                return (
                    <svg width="30" height="30">
                        <circle cx="15" cy="15" r="6" fill={layer.color} />
                    </svg>
                );
        }
    };
    return (
        <div className="layer-style-wrapper">

            <h2 className="page-title">
                Railway Web GIS Styling Standards
            </h2>

            <div className="layer-style-table">

                <div className="layer-style-row header">
                    <div>Layer Name</div>
                    <div>Type</div>
                    <div>Color</div>
                    <div>Symbol Preview</div>
                </div>

                {paginatedData.map((layer: any, index: number) => (
                    <div key={index} className="layer-style-row">

                        <div className="layer-name">
                            {layer.name}
                        </div>

                        <div>
                            <span className="type-badge">
                                {layer.type}
                            </span>
                        </div>

                        <div className="color-cell">
                            <span
                                className="color-box"
                                style={{ background: layer.color }}
                            />
                            <span className="hex-text">{layer.color}</span>
                        </div>

                        <div className="symbol-preview-cell">
                            {renderSymbol(layer)}
                        </div>

                    </div>
                ))}

            </div>

            {/* PAGINATION */}
            <div className="pagination">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                >
                    Prev
                </button>

                <span>
                    Page {page} of {totalPages}
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                >
                    Next
                </button>
            </div>

        </div>
    );
};

export default LayerStylesDashboard;