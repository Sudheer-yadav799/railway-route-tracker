import { useState, useEffect, ReactNode } from 'react'
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet'
import MeasureControl from './MeasureControl'
import DroneImageWMS from './droneImage'

const ZoomLogger = () => {
  const map = useMapEvents({
    zoomend: () => {
      const currentZoom = map.getZoom()
      console.log('Current Zoom Level:', currentZoom)
    },
    load: () => {
      const currentZoom = map.getZoom()
      console.log('Initial Zoom Level:', currentZoom)
    }
  })
  return null
}

interface BaseMapProps {
  children: ReactNode
  onMapReady: (map: any) => void
  showDroneLayer: boolean
  currentZoom: number
  setCurrentZoom: (zoom: number) => void
}

const BaseMap: React.FC<BaseMapProps> = ({
  children,
  onMapReady,
  showDroneLayer,
  currentZoom,
  setCurrentZoom
}) => {
  return (
    <MapContainer
      center={[18.58, 78.22]}
      zoom={15}
      minZoom={5}
      style={{ height: 'calc(100vh - 60px)', width: '100%' }}
      whenCreated={onMapReady}
    >
      <TileLayer
        url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
        attribution="Google"
        maxZoom={22}
      />

      <DroneImageWMS enabled={showDroneLayer} />

      <ZoomLogger />
      <MeasureControl />
      <MapReady onReady={onMapReady} />

      {children}
    </MapContainer>
  )
}

export default BaseMap

export const MapReady = ({ onReady }: { onReady: (map: any) => void }) => {
  const map = useMap()

  useEffect(() => {
    onReady(map)
  }, [map, onReady])

  return null
}
