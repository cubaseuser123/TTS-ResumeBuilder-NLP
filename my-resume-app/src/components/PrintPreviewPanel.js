import React from "react";
import "./PrintPreviewPanel.css";

const PrintPreviewPanel = ({
  pageType,
  setPageType,
  orientation,
  setOrientation,
  onClose,
  onPrint,
  children,
}) => {
  return (
    <div className="print-overlay">
      {/* LEFT PRINT BAR */}
      <div className="print-sidebar">
        <h3>Print settings</h3>

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

        <button className="print-btn" onClick={onPrint}>
          Print
        </button>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>

      {/* PREVIEW AREA */}
      <div className="print-preview">
        <div className={orientation === "landscape" ? "landscape" : ""}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PrintPreviewPanel;
