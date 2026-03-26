import React, { useState, useRef, useEffect } from "react";
import L from "leaflet";
import { railwayMarkerIcons } from "../../utils/config/railwayMarkerIcons";

import { useSelector,shallowEqual  } from "react-redux";
const GEOSERVER = import.meta.env.VITE_GEOSERVER_URL;

type FeatureType = "poles" | "areas";

interface SearchBarProps {
  mapRef: React.MutableRefObject<any>;
}

const normalizeLayerName = (value?: string) => {
  if (!value) return "DEFAULT";
  const cleaned = value.trim().toUpperCase();
  if (cleaned === "0") return "DEFAULT";
  return cleaned;
};

const SearchBar = ({ mapRef }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<FeatureType>("poles");
  const [filterOpen, setFilterOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

 const sections = useSelector((state: any) => state.layers.sections,shallowEqual);

  // ── holds the raw Leaflet marker instance for the selected feature ──
  const highlightMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    return () => {
      if (highlightMarkerRef.current) {
        highlightMarkerRef.current.remove();
        highlightMarkerRef.current = null;
      }
    };
  }, []);

const fetchSuggestions = async (keyword: string) => {
  if (!keyword) {
    setSuggestions([]);
    return;
  }

  try {
    let selectedLayer: any = null;

    for (const section of sections) {
      for (const layer of section.layers) {
        if (filterType === "poles" && layer.type === "markerlayer") {
          selectedLayer = layer;
          break;
        }

        if (filterType === "areas" && layer.type === "polygonlayer") {
          selectedLayer = layer;
          break;
        }
      }
      if (selectedLayer) break;
    }

    if (!selectedLayer) {
      console.warn("No active layer found for search");
      return;
    }

    const workspace = selectedLayer.geoserverWorkSpace;
    const layerName = selectedLayer.apiendpoint;

    const typeName = `${workspace}:${layerName}`;

    // field used for search
    const field = filterType === "poles" ? "name" : "layer";

    const cql = `${field} ILIKE '%${keyword}%'`;

    const url =
      `${GEOSERVER}/${workspace}/ows?service=WFS&version=1.0.0&request=GetFeature`
      + `&typeName=${typeName}`
      + `&outputFormat=application/json`
      + `&srsName=EPSG:4326`
      + `&maxFeatures=10`
      + `&CQL_FILTER=${encodeURIComponent(cql)}`;

    const res = await fetch(url);
    const data = await res.json();

    setSuggestions(data.features || []);
  } catch (err) {
    console.error("Search error:", err);
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setShowSuggestions(true);
    fetchSuggestions(val);

    // clear highlight marker when user types again
    if (highlightMarkerRef.current) {
      highlightMarkerRef.current.remove();
      highlightMarkerRef.current = null;
    }
  };

  const handleSelect = (feature: any) => {
    setShowSuggestions(false);

    if (filterType === "poles") setQuery(feature.properties.name);
    if (filterType === "areas") setQuery(feature.properties.layer);

    const map = mapRef?.current;
    if (!map) { console.error("mapRef.current is null"); return; }
    if (typeof map.flyTo !== "function") { console.error("Not a Leaflet map:", map); return; }

    const geom = feature.geometry;
    if (!geom) return;

    // ── remove previous highlight marker ───────────────────────
    if (highlightMarkerRef.current) {
      highlightMarkerRef.current.remove();
      highlightMarkerRef.current = null;
    }

    if (geom.type === "Point") {
      const [lng, lat] = geom.coordinates;

      // ── resolve the correct icon for this layer ─────────────
      const layerValue = normalizeLayerName(feature.properties?.layer);
      const baseIcon = railwayMarkerIcons[layerValue] || railwayMarkerIcons["DEFAULT"];

      // ── create a slightly larger version to highlight it ─────
      const highlightIcon = L.icon({
        ...baseIcon.options,
        iconSize: [36, 36],            // bigger than normal marker
        iconAnchor: [18, 36],
      });

      // ── place marker directly on Leaflet map (not React-Leaflet) ─
      const marker = L.marker([lat, lng], { icon: highlightIcon })
        .addTo(map)
        .bindPopup(
          `<div style="min-width:200px">
            <strong>${feature.properties.name ?? ""}</strong><br/>
            <span style="opacity:0.7">${feature.properties.layer ?? ""}</span>
          </div>`
        )
        .openPopup();

      highlightMarkerRef.current = marker;

      // ── fly to it ────────────────────────────────────────────
      map.flyTo([lat, lng], 18, { animate: true, duration: 1.2 });

    } else if (geom.type === "Polygon" || geom.type === "MultiPolygon") {
      const geoLayer = L.geoJSON(feature);
      map.flyToBounds(geoLayer.getBounds(), { padding: [40, 40], animate: true, duration: 1.2 });
    }
  };

  return (
    <div className="header-search">
      <div className="search-filter-wrapper">
        <div className="search-filter-btn" onClick={() => setFilterOpen(v => !v)}>
          {filterType === "poles" ? "Poles" : "Areas"}
          <span className="filter-caret">▾</span>
        </div>

        {filterOpen && (
          <div className="search-filter-dropdown">
            <div className="search-filter-option" onClick={() => {
              setFilterType("poles"); setFilterOpen(false);
              setQuery(""); setSuggestions([]);
            }}>Poles</div>
            <div className="search-filter-option" onClick={() => {
              setFilterType("areas"); setFilterOpen(false);
              setQuery(""); setSuggestions([]);
            }}>Areas</div>
          </div>
        )}
      </div>

      <input
        type="text"
        // placeholder={filterType === "poles" ? "Search pole name..." : "Search area layer..."}
        value={query}
        onChange={handleChange}
      />

  {showSuggestions && suggestions.length > 0 && (

        <ul className="search-suggestions">

          {suggestions.map((f, idx) => (

            <li
              key={idx}
              onClick={() => handleSelect(f)}
            >

              {filterType === "poles" && (
                <>
                  {f.properties.name}
                  <span className="suggest-layer">
                    {f.properties.layer}
                  </span>
                </>
              )}

              {filterType === "areas" && (
                <>
                  {f.properties.layer}
                </>
              )}

            </li>

          ))}

        </ul>

      )}

    </div>
  );
};

export default SearchBar;