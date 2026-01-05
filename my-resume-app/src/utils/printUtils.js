// PrintPreviewPanel.js
import React, { useState, useEffect } from "react";
import "./css/printPreview.css"; // we'll add minimal styles below
import Template1 from "../assets/templates/template1";
import Template2 from "../assets/templates/template2";
import Template3 from "../assets/templates/template3";
import Template4 from "../assets/templates/template4";
import Template5 from "../assets/templates/template5";
import Template6 from "../assets/templates/template6";
import Template7 from "../assets/templates/template7";
import Template8 from "../assets/templates/template8";

import {
  exportElementToPdf,
  exportElementToPng,
  exportElementToDocx,
} from "../utils/printUtils";

const templates = {
  template1: Template1,
  template2: Template2,
  template3: Template3,
  template4: Template4,
  template5: Template5,
  template6: Template6,
  template7: Template7,
  template8: Template8,
};

const PrintPreviewPanel = ({
  visible,
  onClose,
  resumeData,
  selectedTemplate,
  pageType,
  layout,
}) => {
  const [orientation, setOrientation] = useState("portrait");
  const [size, setSize] = useState(pageType || "A4");
  const SelectedTemplate = templates[selectedTemplate] || Template1;

  useEffect(() => {
    setSize(pageType || "A4");
  }, [pageType]);

  if (!visible) return null;

  return (
    <div className="pp-overlay">
      <div className="pp-panel">
        <div className="pp-header">
          <h3>Print Preview</h3>
          <div>
            <button className="pp-close" onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        <div className="pp-controls">
          <label>
            Orientation:
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </label>

          <label>
            Page Size:
            <select value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
            </select>
          </label>

          <div className="pp-actions">
            <button
              onClick={() =>
                exportElementToPdf({
                  elementId: "resume-to-print",
                  fileName: `${resumeData.fullName || "resume"}.pdf`,
                  orientation,
                  pageSize: size,
                })
              }
            >
              Save as PDF
            </button>

            <button
              onClick={() =>
                exportElementToPng({
                  elementId: "resume-to-print",
                  fileName: `${resumeData.fullName || "resume"}.png`,
                })
              }
            >
              Save as PNG
            </button>

            <button
              onClick={() =>
                exportElementToDocx({
                  elementId: "resume-to-print",
                  fileName: `${resumeData.fullName || "resume"}.docx`,
                })
              }
            >
              Save as Word
            </button>

            <button
              onClick={() => {
                // simple browser print as fallback - will print what is visible in main
                window.print();
              }}
            >
              Browser Print
            </button>
          </div>
        </div>

        <div className="pp-preview">
          {/* Render the template live here so preview is accurate */}
          <div
            className="pp-preview-inner"
            style={{
              width: size === "A4" ? "210mm" : "8.5in",
              minHeight: size === "A4" ? "297mm" : "11in",
              transform:
                orientation === "landscape"
                  ? "rotate(90deg) scale(0.6)"
                  : "none",
              transformOrigin: "top left",
              background: "white",
              margin: "12px auto",
              boxShadow: "0 0 5px rgba(0,0,0,0.12)",
            }}
          >
            <SelectedTemplate
              data={resumeData}
              pageType={size}
              layout={layout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintPreviewPanel;
