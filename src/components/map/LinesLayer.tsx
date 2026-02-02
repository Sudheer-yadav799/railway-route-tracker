import { GeoJSON } from 'react-leaflet'

const LinesLayer = ({ data }: any) => (
  <>
    {/* Track base (ballast) */}
    <GeoJSON
      data={data}
      style={(f) => ({
        color: '#2f2f2f',
        weight: f.properties.LAYER === 'Mainlines' ? 6 : 4,
        opacity: 1
      })}
    />

    {/* Rail line (top stroke) */}
    <GeoJSON
      data={data}
      style={(f) => ({
        color: f.properties.LAYER === 'Mainlines' ? '#00FFFF' : '#180c88',
        weight: f.properties.LAYER === 'Mainlines' ? 3 : 2,
        opacity: 1
      })}
      onEachFeature={(feature, layer) => {
        const p = feature.properties

        layer.bindPopup(
          `
          <div style="
            font-family:'Segoe UI', Arial, sans-serif;
            min-width: 220px;
          ">
            <div style="
              font-size: 15px;
              font-weight: 600;
              margin-bottom: 8px;
              color: #1f2937;
              border-bottom: 2px solid ${
                p.LAYER === 'Mainlines' ? '#00FFFF' : '#925d17'
              };
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
                <td style="padding: 6px 4px; color:#6b7280;">
                  <strong>Distance</strong>
                </td>
                <td style="padding: 6px 4px;">
                  ${p.Distance ? p.Distance.toFixed(2) + ' m' : 'NA'}
                </td>
              </tr>

              <tr style="background:#f9fafb;">
                <td style="padding: 6px 4px; color:#6b7280;">
                  <strong>Line Style</strong>
                </td>
                <td style="padding: 6px 4px;">
                  ${p.LINE_STYLE ?? 'NA'}
                </td>
              </tr>

              <tr>
                <td style="padding: 6px 4px; color:#6b7280;">
                  <strong>Line Width</strong>
                </td>
                <td style="padding: 6px 4px;">
                  ${p.LINE_WIDTH ?? 'NA'}
                </td>
              </tr>
            </table>
          </div>
          `,
          { maxWidth: 280 }
        )
      }}
    />
  </>
)

export default LinesLayer
