// utils/buildPopupHTML.ts

export const buildPopupHTML = (
  layerName: string,
  fieldValue: string
): string => `
  <div style="
    font-family: Arial, sans-serif;
    font-size: 13px;
    min-width: 180px;
    line-height: 1.4;
  ">
    <div style="
      font-weight: 600;
      margin-bottom: 6px;
      color: #333;
    ">
      ${layerName || "Layer"}
    </div>

    <div style="
      border-top: 1px solid #eee;
      padding-top: 6px;
      color: #555;
    ">
      ${fieldValue || "No Data"}
    </div>
  </div>
`;