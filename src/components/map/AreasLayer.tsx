import { GeoJSON } from 'react-leaflet'

const getColor = (layer: string) => {
  switch (layer) {
    case 'Bridge': return '#FF6B6B'
    case 'CULVERT': return '#4ECDC4'
    case 'RUB': return '#45B7D1'
    case 'ROB': return '#FFA07A'
    default: return '#95E1D3'
  }
}

const AreasLayer = ({ data }: any) => (
  <GeoJSON
    data={data}
    style={(f) => ({
      fillColor: getColor(f.properties.LAYER),
      color: '#FFD93D',
      weight: 2,
      fillOpacity: 0.6
    })}
    onEachFeature={(feature, layer) => {
      const p = feature.properties

      layer.bindPopup(
        `
        <div style="
          font-family: 'Segoe UI', Arial, sans-serif;
          min-width: 220px;
        ">
          <div style="
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #333;
            border-bottom: 2px solid ${getColor(p.LAYER)};
            padding-bottom: 4px;
          ">
            ${p.LAYER}
          </div>

          <table style="
            width: 100%;
            font-size: 13px;
            border-collapse: collapse;
          ">
            <tr>
              <td style="padding: 6px 4px; color:#666;"><strong>Type</strong></td>
              <td style="padding: 6px 4px;">${p.GM_TYPE ?? 'NA'}</td>
            </tr>

            <tr style="background:#f9fafb;">
              <td style="padding: 6px 4px; color:#666;"><strong>DGN Level</strong></td>
              <td style="padding: 6px 4px;">${p.DGN_LEVEL ?? 'NA'}</td>
            </tr>

          </table>
        </div>
        `,
        { maxWidth: 280 }
      )
    }}
  />
)

export default AreasLayer
