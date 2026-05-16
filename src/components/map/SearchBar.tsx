import React, { useState, useRef, useEffect } from "react";
import L from "leaflet";
import { railwayMarkerIcons } from "../../utils/config/railwayMarkerIcons";

import { useSelector, shallowEqual } from "react-redux";
import toast from "react-hot-toast";

const GEOSERVER = import.meta.env.VITE_GEOSERVER_URL;

type FeatureType = "poles" | "areas" | "stations";

interface SearchBarProps {
  mapRef: React.MutableRefObject<any>;
  projectId: string;
}

const normalizeLayerName = (value?: string) => {
  if (!value) return "DEFAULT";

  const cleaned = value.trim().toUpperCase();

  if (cleaned === "0") return "DEFAULT";

  return cleaned;
};

const SearchBar = ({ mapRef, projectId }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] =
    useState<FeatureType>("poles");

  const [filterOpen, setFilterOpen] = useState(false);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [stationPage, setStationPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const suggestionBoxRef =
    useRef<HTMLUListElement | null>(null);

  const sections = useSelector(
    (state: any) => state.layers.sections,
    shallowEqual
  );

  const highlightMarkerRef =
    useRef<L.Marker | null>(null);

  // cleanup
  useEffect(() => {
    return () => {
      if (highlightMarkerRef.current) {
        highlightMarkerRef.current.remove();
        highlightMarkerRef.current = null;
      }
    };
  }, []);

  // project change reset
  useEffect(() => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);

    if (highlightMarkerRef.current) {
      highlightMarkerRef.current.remove();
      highlightMarkerRef.current = null;
    }
  }, [projectId]);

  // -----------------------------------------
  // NORMAL SEARCH (POLES + AREAS)
  // -----------------------------------------

  const fetchSuggestions = async (keyword: string) => {
    if (!keyword) {
      setSuggestions([]);
      return [];
    }

    try {
      let selectedLayer: any = null;

      for (const section of sections) {
        for (const layer of section.layers) {
          if (
            (filterType === "poles" ||
              filterType === "stations") &&
            layer.type === "markerlayer"
          ) {
            selectedLayer = layer;
            break;
          }

          if (
            filterType === "areas" &&
            layer.type === "polygonlayer"
          ) {
            selectedLayer = layer;
            break;
          }
        }

        if (selectedLayer) break;
      }

      if (!selectedLayer) {
        console.warn("No active layer found");
        return [];
      }

      const workspace =
        selectedLayer.geoserverWorkSpace;

      const layerName = selectedLayer.apiendpoint;

      const typeName = `${workspace}:${layerName}`;

      const field =
        filterType === "areas" ? "layer" : "name";

      let cql = `${field} ILIKE '%${keyword}%'`;

      // STATIONS ONLY
      if (filterType === "stations") {
        cql =
          `layer='STATION CENTER' ` +
          `AND ${field} ILIKE '%${keyword}%'`;
      }

      // EXCLUDE STATIONS FROM POLES
      if (filterType === "poles") {
        cql =
          `layer<>'STATION CENTER' ` +
          `AND ${field} ILIKE '%${keyword}%'`;
      }

      const url =
        `${GEOSERVER}/${workspace}/ows?service=WFS&version=1.0.0&request=GetFeature` +
        `&typeName=${typeName}` +
        `&outputFormat=application/json` +
        `&srsName=EPSG:4326` +
        `&maxFeatures=20` +
        `&CQL_FILTER=${encodeURIComponent(cql)}`;

      const res = await fetch(url);
      const data = await res.json();

      setSuggestions(data.features || []);

      return data.features || [];
    } catch (err) {
      console.error("Search error:", err);
      return [];
    }
  };

  // -----------------------------------------
  // STATION LIST LOADER
  // -----------------------------------------

  const fetchStations = async (
    keyword = "",
    page = 0,
    append = false
  ) => {
    try {
      let selectedLayer: any = null;

      for (const section of sections) {
        for (const layer of section.layers) {
          if (layer.type === "markerlayer") {
            selectedLayer = layer;
            break;
          }
        }

        if (selectedLayer) break;
      }

      if (!selectedLayer) return [];

      const workspace =
        selectedLayer.geoserverWorkSpace;

      const layerName = selectedLayer.apiendpoint;

      const typeName = `${workspace}:${layerName}`;

      let cql = `layer='STATION CENTER'`;

      if (keyword) {
        cql += ` AND name ILIKE '%${keyword}%'`;
      }

      const url =
        `${GEOSERVER}/${workspace}/ows?service=WFS&version=1.0.0&request=GetFeature` +
        `&typeName=${typeName}` +
        `&outputFormat=application/json` +
        `&srsName=EPSG:4326` +
        `&maxFeatures=100` +
        `&startIndex=${page * 100}` +
        `&CQL_FILTER=${encodeURIComponent(cql)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (append) {
        setSuggestions(prev => {
          const merged = [
            ...prev,
            ...(data.features || []),
          ];

          return merged.filter(
            (item, index, self) =>
              index ===
              self.findIndex(
                t =>
                  t.properties.name ===
                  item.properties.name
              )
          );
        });
      } else {
        setSuggestions(data.features || []);
      }

      return data.features || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  // -----------------------------------------
  // INFINITE SCROLL
  // -----------------------------------------

  const handleSuggestionScroll = async (
    e: React.UIEvent<HTMLUListElement>
  ) => {
    if (filterType !== "stations") return;

    const target = e.currentTarget;

    const bottom =
      target.scrollHeight - target.scrollTop <=
      target.clientHeight + 20;

    if (bottom && !loadingMore) {
      setLoadingMore(true);

      const nextPage = stationPage + 1;

      await fetchStations(query, nextPage, true);

      setStationPage(nextPage);

      setLoadingMore(false);
    }
  };

  // -----------------------------------------
  // SEARCH SUBMIT
  // -----------------------------------------

  const handleSearchSubmit = async () => {
    if (!query) return;

    // STATIONS
    if (filterType === "stations") {
      const data = await fetchStations(
        query,
        0,
        false
      );

      if (!data || data.length === 0) {
        toast.error("No stations found");
        return;
      }

      handleSelect(data[0]);

      return;
    }

    // NORMAL
    const data = await fetchSuggestions(query);

    if (!data || data.length === 0) {
      toast.error("No results found");
      return;
    }

    handleSelect(data[0]);
  };

  // -----------------------------------------
  // INPUT CHANGE
  // -----------------------------------------

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value;

    setQuery(val);
    setShowSuggestions(true);

    // clear marker
    if (highlightMarkerRef.current) {
      highlightMarkerRef.current.remove();
      highlightMarkerRef.current = null;
    }

    // stations
    if (filterType === "stations") {
      setStationPage(0);

      await fetchStations(val, 0, false);

      return;
    }

    // normal
    await fetchSuggestions(val);
  };

  // -----------------------------------------
  // SELECT FEATURE
  // -----------------------------------------

  const handleSelect = (feature: any) => {
    setShowSuggestions(false);

    if (
      filterType === "poles" ||
      filterType === "stations"
    ) {
      setQuery(feature.properties.name);
    }

    if (filterType === "areas") {
      setQuery(feature.properties.layer);
    }

    const map = mapRef?.current;

    if (!map) {
      console.error("mapRef.current is null");
      return;
    }

    if (typeof map.flyTo !== "function") {
      console.error("Not a Leaflet map:", map);
      return;
    }

    const geom = feature.geometry;

    if (!geom) return;

    // remove old marker
    if (highlightMarkerRef.current) {
      highlightMarkerRef.current.remove();
      highlightMarkerRef.current = null;
    }

    // POINT
    if (geom.type === "Point") {
      const [lng, lat] = geom.coordinates;

      const layerValue = normalizeLayerName(
        feature.properties?.layer
      );

      const baseIcon =
        railwayMarkerIcons[layerValue] ||
        railwayMarkerIcons["DEFAULT"];

      const highlightIcon = L.icon({
        ...baseIcon.options,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });

      const marker = L.marker([lat, lng], {
        icon: highlightIcon,
      })
        .addTo(map)
        .bindPopup(
          `<div style="min-width:200px">
            <strong>${feature.properties.name ?? ""}</strong><br/>
            <span style="opacity:0.7">
              ${feature.properties.layer ?? ""}
            </span>
          </div>`
        )
        .openPopup();

      highlightMarkerRef.current = marker;

      (map as any)._isSearchFly = true;

      map.flyTo([lat, lng], 18, {
        animate: true,
        duration: 1.2,
      });

      setTimeout(() => {
        (map as any)._isSearchFly = false;
      }, 1500);
    }

    // POLYGON
    else if (
      geom.type === "Polygon" ||
      geom.type === "MultiPolygon"
    ) {
      const geoLayer = L.geoJSON(feature);

      map.flyToBounds(geoLayer.getBounds(), {
        padding: [40, 40],
        animate: true,
        duration: 1.2,
      });
    }
  };

  return (
    <div className="header-search">

      {/* FILTER */}
      <div className="search-filter-wrapper">

        <div
          className="search-filter-btn"
          onClick={() =>
            setFilterOpen(v => !v)
          }
        >
          {filterType === "poles"
            ? "Poles"
            : filterType === "areas"
            ? "Areas"
            : "Stations"}

          <span className="filter-caret">
            ▾
          </span>
        </div>

        {filterOpen && (
          <div className="search-filter-dropdown">

            {/* POLES */}
            <div
              className="search-filter-option"
              onClick={() => {
                setFilterType("poles");
                setFilterOpen(false);

                setQuery("");
                setSuggestions([]);
                setStationPage(0);

                setShowSuggestions(false);
              }}
            >
              Poles
            </div>

            {/* AREAS */}
            <div
              className="search-filter-option"
              onClick={() => {
                setFilterType("areas");
                setFilterOpen(false);

                setQuery("");
                setSuggestions([]);
                setStationPage(0);

                setShowSuggestions(false);
              }}
            >
              Areas
            </div>

            {/* STATIONS */}
            <div
              className="search-filter-option"
              onClick={() => {
                setFilterType("stations");
                setFilterOpen(false);

                setQuery("");
                setSuggestions([]);

                setStationPage(0);

                setShowSuggestions(true);

                fetchStations("", 0, false);
              }}
            >
              Stations
            </div>

          </div>
        )}
      </div>

      {/* INPUT */}
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={(e) =>
          e.key === "Enter" &&
          handleSearchSubmit()
        }
      />

      {/* SUGGESTIONS */}
      {showSuggestions &&
        suggestions.length > 0 && (

          <ul
            className="search-suggestions"
            ref={suggestionBoxRef}
            onScroll={handleSuggestionScroll}
          >

            {suggestions.map((f, idx) => (

              <li
                key={idx}
                onClick={() =>
                  handleSelect(f)
                }
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

                {filterType === "stations" && (
                  <>
                    {f.properties.name}

                    <span className="suggest-layer">
                      {f.properties.layer}
                    </span>
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