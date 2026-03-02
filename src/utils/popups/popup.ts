// utils/buildPopupHTML.ts

export const buildPopupHTML = (layerName: string, fieldValue: string): string => `
  <div style="
    font-family: 'Segoe UI', Arial, sans-serif;
    min-width: 200px;
    max-width: 260px;
    border-radius: 12px;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    border: 1px solid #e5e7eb;
  ">

    <!-- Top accent bar -->
    <div style="
      height: 4px;
      background: linear-gradient(90deg, #d97706, #f59e0b, #fbbf24);
    "></div>

    <!-- Header -->
    <div style="
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px 8px;
      background: #1c1917;
    ">
      <div style="
        width: 28px; height: 28px;
        background: #d97706;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 13px;
        flex-shrink: 0;
      ">🗺️</div>
      <div>
        <div style="
          font-size: 10px;
          color: #a8a29e;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          font-weight: 500;
          line-height: 1;
          margin-bottom: 2px;
        ">Layer</div>
        <div style="
          font-size: 13px;
          font-weight: 700;
          color: #fef3c7;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        ">${layerName || "Unknown"}</div>
      </div>
    </div>

    <!-- Divider -->
    <div style="height: 1px; background: linear-gradient(90deg, #d97706 30%, transparent);"></div>

    <!-- Value Row -->
    <div style="
      padding: 12px 14px;
      background: #fffbf5;
      display: flex;
      align-items: flex-start;
      gap: 10px;
    ">
      <div style="
        width: 6px; height: 6px;
        background: #d97706;
        border-radius: 50%;
        margin-top: 5px;
        flex-shrink: 0;
      "></div>
      <div>
        <div style="
          font-size: 10px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          font-weight: 500;
          margin-bottom: 3px;
        ">Value</div>
        <div style="
          font-size: 14px;
          font-weight: 700;
          color: #1c1917;
          line-height: 1.3;
          word-break: break-word;
        ">${fieldValue || "No Data"}</div>
      </div>
    </div>

    <!-- Footer -->
    <div style="
      padding: 5px 14px;
      background: #f5f5f4;
      border-top: 1px solid #e7e5e4;
      font-size: 10px;
      color: #a8a29e;
      display: flex;
      align-items: center;
      gap: 4px;
    ">
      🛤️ <span>Railway Route Infrastructure</span>
    </div>

  </div>
`;