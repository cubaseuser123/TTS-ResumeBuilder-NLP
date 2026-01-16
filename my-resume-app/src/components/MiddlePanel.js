import React, { useEffect, useRef, useState, useCallback } from "react";
import Template1 from "../assets/templates/template1";
import Template2 from "../assets/templates/template2";
import Template3 from "../assets/templates/template3";
import Template4 from "../assets/templates/template4";
import Template5 from "../assets/templates/template5";
import Template6 from "../assets/templates/template6";
import Template7 from "../assets/templates/template7";
import Template8 from "../assets/templates/template8";

const MiddlePanel = ({
  data,
  template,
  selectedFont,
  selectedFontSize,
  applyStyleTrigger,
  pageType,
  lineHeight,
  selectedTextColor,
  layout,
  visibleSections,
  profileImageType,
  profilePhoto,
  supportsImage,
  backgroundColor,
  primaryColor,
  textColor,
  sectionTitles,
  pipelineState,
  isStreaming = false,
  streamProgress = 0,
  onSkipStreaming,
  customId = "resume-to-print",
  enablePrint = true,
}) => {
  const containerRef = useRef(null);
  const [snapshotHtml, setSnapshotHtml] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setSnapshotHtml(null);
  }, [data, template]);

  const pageStyle = {
    width: "100%", //pageType === "A4" ? "210mm" : "8.5in",
    maxWidth: pageType === "A4" ? "210mm" : "8.5in",
    height: 'auto', //pageType === "A4" ? "297mm" : "11in",
    margin: "0 auto",
    overflow: "visible",
    lineHeight: lineHeight,
    fontFamily: selectedFont || "Arial, sans-serif",
    fontSize: `${selectedFontSize}px`,
    "--resume-font-size": `${selectedFontSize}px`,
  };

  const applyStyleToSelection = useCallback(() => {
    try {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      if (range.collapsed) return;
      const parent = range.commonAncestorContainer.parentElement;
      if (parent && parent.tagName === "SPAN") {
        parent.style.fontFamily = selectedFont;
        parent.style.fontSize = `${selectedFontSize}px`;
        parent.style.color = selectedTextColor;
        return;
      }
      const extracted = range.extractContents();
      const wrapper = document.createElement("span");
      wrapper.style.fontFamily = selectedFont || "";
      wrapper.style.fontSize = `${selectedFontSize}px`;
      wrapper.style.color = selectedTextColor;
      wrapper.appendChild(extracted);
      range.insertNode(wrapper);
    } catch (err) {
      console.error(err);
    }
  }, [selectedFont, selectedFontSize, selectedTextColor]);

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

  const SelectedTemplate = templates[template] || Template1;

  const renderedContent = snapshotHtml ? (
    <div
      id={customId}
      ref={containerRef}
      style={pageStyle}
      dangerouslySetInnerHTML={{ __html: snapshotHtml }}
    />
  ) : (
    <div id={customId} ref={containerRef} style={pageStyle}>
      <SelectedTemplate
        data={data}
        pageType={pageType}
        layout={layout}
        visibleSections={visibleSections}
        profileImageType={profileImageType}
        profilePhoto={profilePhoto}
        lineHeight={lineHeight}
        theme={{
          backgroundColor,
          primaryColor,
          textColor,
        }}
        sectionTitles={sectionTitles}
      />
    </div>
  );

  useEffect(() => {
    if (!containerRef.current || !wrapperRef.current) return;

    if (window.matchMedia("print").matches) {
      containerRef.current.style.transform = "none";
      return;
    }

    const container = containerRef.current;
    const parentWidth = wrapperRef.current.clientWidth;
    const pageWidth = container.offsetWidth;

    let scale = parentWidth / pageWidth;
    if (scale > 1) scale = 1;

    container.style.transform = `scale(${scale})`;
    container.style.transformOrigin = "top center";
  }, [pageType, template, selectedFont, selectedFontSize, lineHeight]);

  console.log("Primary color:", primaryColor);

  useEffect(() => {
    applyStyleToSelection();
  }, [applyStyleTrigger]);
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
    @media print {
      @page { size: ${pageType}; margin: 0; }
    }
  `;
    document.head.appendChild(style);
  }, [pageType]);

  useEffect(() => {
    if (!primaryColor) return;

    const container = document.getElementById(customId);
    if (!container) return;

    const applyColor = () => {
      const headings = container.querySelectorAll("[data-section-title]");
      headings.forEach((el) => {
        el.style.color = primaryColor;
      });
    };

    // apply immediately (if already rendered)
    applyColor();

    // observe future DOM changes (snapshotHtml / template switch)
    const observer = new MutationObserver(() => {
      applyColor();
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [primaryColor, template, snapshotHtml]);

  // Check if pipeline is running (show loading)
  const isLoading = pipelineState === "submitting" || pipelineState === "generating";
  const showSkipButton = isStreaming && onSkipStreaming;

  return (
    <div
      ref={wrapperRef}
      className={`resume-print-area ${enablePrint ? "print-area" : ""}`}
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(31, 41, 55, 0.85)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid #4b5563",
              borderTop: "4px solid #6366f1",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ color: "#f3f4f6", marginTop: "16px", fontSize: "1rem" }}>
            Generating your resume...
          </p>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      )}

      {/* Streaming Skip Button */}
      {showSkipButton && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 101,
          }}
        >
          <button
            onClick={onSkipStreaming}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#4f46e5";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#6366f1";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Skip Animation ⏩
          </button>
        </div>
      )}
      {renderedContent}
    </div>
  );
};

export default MiddlePanel;
