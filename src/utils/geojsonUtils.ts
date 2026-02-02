import proj4 from 'proj4'

proj4.defs(
  'EPSG:32644',
  '+proj=utm +zone=44 +datum=WGS84 +units=m +no_defs'
)

export const reprojectCoords = (coords: any): any => {
  if (typeof coords[0] === 'number') {
    const [lng, lat] = proj4('EPSG:32644', 'EPSG:4326', coords)
    return [lng, lat]
  }
  return coords.map(reprojectCoords)
}

export const convertGeoJSON = (data: any) =>
  JSON.parse(JSON.stringify({
    ...data,
    features: data.features.map((f: any) => ({
      ...f,
      geometry: {
        ...f.geometry,
        coordinates: reprojectCoords(f.geometry.coordinates)
      }
    }))
  }))
