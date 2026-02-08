import React, { useEffect, useState, useRef } from 'react'
import Header from '../components/Header'
import BaseMap from '../components/map/BaseMap'
import AreasLayer from '../components/map/AreasLayer'
import LinesLayer from '../components/map/LinesLayer'
import PointsLayer from '../components/map/PointsLayer'
import LayerPanel from '../components/map/LayerPanel'
import SearchBar from '../components//map/SearchBar'
import { convertGeoJSON } from '../utils/geojsonUtils'
import Legend from '../components/map/Legend'

const MapView = () => {
  const [areas, setAreas] = useState<any>(null)
  const [lines, setLines] = useState<any>(null)
  const [points, setPoints] = useState<any>(null)

  const [showAreas, setShowAreas] = useState(true)
  const [showLines, setShowLines] = useState(true)
  const [showPoints, setShowPoints] = useState(true)
  const [showDroneLayer, setShowDroneLayer] = useState(false) // new
  const [selectedPole, setSelectedPole] = useState<string | null>(null)
  const [showMapImageLayer, setMapImageLayer] = useState(true)

  const [currentZoom, setCurrentZoom] = useState(15)

  const [suggestions, setSuggestions] = useState<string[]>([])
  const mapRef = useRef<any>(null)

useEffect(() => {
  const base = import.meta.env.BASE_URL;

  Promise.all([
    fetch(`${base}data/mainPolesAreas.json`).then(r => r.json()),
    fetch(`${base}data/mainPolesLines.json`).then(r => r.json()),
    fetch(`${base}data/mainPolesPoints.json`).then(r => r.json())
  ])
    .then(([a, l, p]) => {
      setAreas(convertGeoJSON(a))
      setLines(convertGeoJSON(l))
      setPoints(convertGeoJSON(p))
    })
    .catch(err => {
      console.error("❌ Failed to load GeoJSON", err)
    })
}, [])


  const handleSearch = (query: string) => {
    if (!points || !query) {
      setSuggestions([])
      return
    }

    const matches = points.features
      .map((f: any) => f.properties.NAME)
      .filter((name: string) =>
        name.toLowerCase().includes(query.toLowerCase())
      )

    setSuggestions(matches)
  }

  const handleSelect = (name: string) => {
    if (!points || !mapRef.current) return

    const feature = points.features.find(
      (f: any) => f.properties.NAME === name
    )

    if (!feature) return

    const lat = feature.properties.LAT
    const lng = feature.properties.LONG

    setSelectedPole(name)

    mapRef.current.flyTo([lat, lng], 19, {
      animate: true,
      duration: 1.5
    })
  }

  return (
    <>
      <Header />

      <BaseMap
        showDroneLayer={showDroneLayer}
          currentZoom={currentZoom}
          setCurrentZoom={setCurrentZoom}
          showMapImageLayer={showMapImageLayer}
        onMapReady={(map) => {
          console.log('✅ Map is ready')
          mapRef.current = map
        }}
      >
        {showAreas && areas && <AreasLayer data={areas} />}
        {showLines && lines && <LinesLayer data={lines} />}
        {showPoints && points && (
          <PointsLayer data={points} selectedPole={selectedPole} />
        )}
      </BaseMap>

      <SearchBar
        suggestions={suggestions}
        onSearch={handleSearch}
        onSelect={handleSelect}
      />

      <LayerPanel
        showAreas={showAreas} setShowAreas={setShowAreas}
        showLines={showLines} setShowLines={setShowLines}
        showPoints={showPoints} setShowPoints={setShowPoints}
        showDroneLayer={showDroneLayer} setShowDroneLayer={setShowDroneLayer}
        showMapImageLayer={showMapImageLayer}
        setShowMapImageLayer={setMapImageLayer}
      />


      <Legend />
    </>
  )
}

export default MapView
