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
}) => {
  const containerRef = useRef(null);
  const [snapshotHtml, setSnapshotHtml] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setSnapshotHtml(null);
  }, [data, template]);

  const pageStyle = {
    width: pageType === "A4" ? "210mm" : "8.5in",
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
      id="resume-to-print"
      ref={containerRef}
      style={pageStyle}
      dangerouslySetInnerHTML={{ __html: snapshotHtml }}
    />
  ) : (
    <div id="resume-to-print" ref={containerRef} style={pageStyle}>
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

    const container = document.getElementById("resume-to-print");
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

  return (
    <div
      ref={wrapperRef}
      className="resume-print-area print-area"
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {renderedContent}
    </div>
  );
};

export default MiddlePanel;
