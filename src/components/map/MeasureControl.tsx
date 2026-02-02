import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-measure'

const MeasureControl = () => {
  const map = useMap()

  useEffect(() => {
    const measureControl = new (L as any).Control.Measure({
      position: 'topleft',
      primaryLengthUnit: 'feet',
      secondaryLengthUnit: 'kilometers',
      primaryAreaUnit: 'acres',
      secondaryAreaUnit: 'sqfeet',
      activeColor: '#fc7a00',
      completedColor: '#e1e2e2',
    })

    map.addControl(measureControl)

    // store original pan methods
    const originalPanBy = map.panBy.bind(map)
    const originalPanTo = map.panTo.bind(map)
    const originalSetView = map.setView.bind(map)
    const originalFlyTo = (map as any).flyTo?.bind(map)

    const disablePan = () => {
      map.dragging.disable()
      map.scrollWheelZoom.disable()
      map.doubleClickZoom.disable()
      map.boxZoom.disable()
      map.touchZoom.disable()

      // Prevent plugin from auto panning
      map.panBy = () => map
      map.panTo = () => map
      map.setView = () => map
      if ((map as any).flyTo) (map as any).flyTo = () => map
    }

    const enablePan = () => {
      map.dragging.enable()
      map.scrollWheelZoom.enable()
      map.doubleClickZoom.enable()
      map.boxZoom.enable()
      map.touchZoom.enable()

      // Restore pan methods
      map.panBy = originalPanBy
      map.panTo = originalPanTo
      map.setView = originalSetView
      if ((map as any).flyTo) (map as any).flyTo = originalFlyTo
    }

    map.on('measurestart', disablePan)
    map.on('measurefinish', enablePan)
    map.on('measurecancel', enablePan)

    return () => {
      map.off('measurestart', disablePan)
      map.off('measurefinish', enablePan)
      map.off('measurecancel', enablePan)

      map.removeControl(measureControl)
    }
  }, [map])

  return null
}

export default MeasureControl
