import React from "react";
import "./PrintPreviewPanel.css";

const PrintPreviewPanel = ({
  visible,
  pageType,
  setPageType,
  orientation,
  setOrientation,
  onClose,
  onPrint,
  children,
  visible,
}) => {
  if (!visible) return null;

  return (
    <div className="pp-overlay">
      {/* LEFT PRINT BAR */}
      <div className="pp-panel">
        <div className="pp-header">
          <h3>Print settings</h3>
          <button className="pp-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="pp-controls">
          <label>
            Page size
            <select
              value={pageType}
              onChange={(e) => setPageType(e.target.value)}
            >
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
            </select>
          </label>

          <label>
            Orientation
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </label>
        </div>

        <div className="pp-actions">
          <button onClick={onPrint}>Print</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>

      {/* PREVIEW AREA */}
      <div className="pp-preview">
        <div className={orientation === "landscape" ? "landscape" : ""}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PrintPreviewPanel;
