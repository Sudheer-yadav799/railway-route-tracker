import React, { useState } from "react";

const GEOSERVER =
  "http://localhost:8082/geoserver/railwaytestgis/ows";

type FeatureType = "poles" | "areas";

const SearchBar = () => {

  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<FeatureType>("poles");
  const [filterOpen, setFilterOpen] = useState(false);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchSuggestions = async (keyword: string) => {

    if (!keyword) {
      setSuggestions([]);
      return;
    }

    let typeName = "";
    let field = "";

    if (filterType === "poles") {
      typeName = "railwaytestgis:srikalyanpua_boran_main_pole_points";
      field = "name";
    }

    if (filterType === "areas") {
      typeName = "railwaytestgis:srikalyanpua_boran_main_pole_areas";
      field = "layer";
    }

    const cql = `${field} ILIKE '%${keyword}%'`;

    const url =
      `${GEOSERVER}?service=WFS&version=1.0.0&request=GetFeature`
      + `&typeName=${typeName}`
      + `&outputFormat=application/json`
      + `&maxFeatures=10`
      + `&CQL_FILTER=${encodeURIComponent(cql)}`;

    try {

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
  };

  const handleSelect = (feature: any) => {

    setShowSuggestions(false);

    if (filterType === "poles") {
      setQuery(feature.properties.name);
    }

    if (filterType === "areas") {
      setQuery(feature.properties.layer);
    }

    console.log("Coordinates:", feature.geometry.coordinates);
  };

  return (

    <div className="header-search">
      <div className="search-filter-wrapper">
        <div
          className="search-filter-btn"
          onClick={() => setFilterOpen(v => !v)}
        >
          {filterType === "poles" ? "Poles" : "Areas"}
          <span className="filter-caret">▾</span>
        </div>

        {filterOpen && (
          <div className="search-filter-dropdown">
            <div
              className="search-filter-option"
              onClick={()=>{
                setFilterType("poles");
                setFilterOpen(false);
                setQuery("");
                setSuggestions([]);
              }}
            >
              Poles
            </div>
            <div
              className="search-filter-option"
              onClick={()=>{
                setFilterType("areas");
                setFilterOpen(false);
                setQuery("");
                setSuggestions([]);
              }}
            >
              Areas
            </div>
          </div>
        )}

      </div>

      {/* SEARCH INPUT */}

      <input
        type="text"
        placeholder={
          filterType === "poles"
            ? "Search pole name..."
            : "Search area layer..."
        }
        value={query}
        onChange={handleChange}
      />

      {/* SUGGESTIONS */}

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