import React from "react";
import "./RightPanel.css";

import t1 from "../assets/templates/template1.png";
import t2 from "../assets/templates/template2.png";
import t3 from "../assets/templates/template3.png";
import t4 from "../assets/templates/template4.png";
import t5 from "../assets/templates/template5.png";
import t6 from "../assets/templates/template6.png";
import t7 from "../assets/templates/template7.png";
import t8 from "../assets/templates/template8.png";

export default function RightPanel({
  selectedTemplate,
  setSelectedTemplate,
  layout,
  setLayout,
  selectedFont,
  setSelectedFont,
  selectedFontSize,
  setSelectedFontSize,
  lineHeight,
  setLineHeight,
  pageType,
  setPageType,
  selectedTextColor,
  setSelectedTextColor,
  triggerApply,
  profileImageType = { profileImageType },
  setProfileImageType = { setProfileImageType },
  setProfilePhoto = { setProfilePhoto },
  primaryColor,
  setPrimaryColor,
}) {
  const layouts = [
    { id: "label1", label: "Profiles" },
    { id: "label2", label: "Experience" },
    { id: "label3", label: "Education" },
    { id: "label4", label: "Skills" },
    { id: "label5", label: "Language" },
    { id: "label6", label: "Awards" },
    { id: "label7", label: "Certifications" },
    { id: "label8", label: "Interests" },
    { id: "label9", label: "Projects" },
    { id: "label10", label: "Publications" },
    { id: "label11", label: "Volunteering" },
    { id: "label12", label: "References" },
  ];
  const [dragItem, setDragItem] = React.useState(null);
  const [dragSourceColumn, setDragSourceColumn] = React.useState(null);
  const [dragSourceIndex, setDragSourceIndex] = React.useState(null);

  const handleDragStart = (column, index) => {
    setDragSourceColumn(column);
    setDragSourceIndex(index);
    setDragItem(layout[column][index]);
  };

  const handleDrop = (targetColumn, targetIndex, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (
      dragItem === null ||
      dragSourceColumn === null ||
      dragSourceIndex === null
    ) {
      return;
    }

    const updated = {
      left: Array.isArray(layout.left) ? [...layout.left] : [],
      right: Array.isArray(layout.right) ? [...layout.right] : [],
    };

    updated[dragSourceColumn].splice(dragSourceIndex, 1);

    let insertIndex =
      targetIndex === null ? updated[targetColumn].length : targetIndex;

    if (dragSourceColumn === targetColumn && dragSourceIndex < insertIndex) {
      insertIndex = insertIndex - 1;
      if (insertIndex < 0) insertIndex = 0;
    }

    updated[targetColumn].splice(insertIndex, 0, dragItem);

    setLayout(updated);

    setDragItem(null);
    setDragSourceColumn(null);
    setDragSourceIndex(null);
  };

  const fontOptions = [
    "Merriweather",
    "Oswald",
    "Playfair Display",
    "PT Serif",
    "Raleway",
    "Source Sans 3",
    "Times New Roman",
    "Roboto",
    "Lato",
    "Poppins",
    "Lora",
    "Open Sans",
    "Montserrat",
  ];

  const templates = [
    { id: "template1", img: t1 },
    { id: "template2", img: t2 },
    { id: "template3", img: t3 },
    { id: "template4", img: t4 },
    { id: "template5", img: t5 },
    { id: "template6", img: t6 },
    { id: "template7", img: t7 },
    { id: "template8", img: t8 },
  ];

  const applyIfSelected = () => {
    const sel = window.getSelection();
    if (sel && sel.toString().length > 0) {
      triggerApply();
    }
  };
  // PRINT POPUP TRIGGER FUNCTION
  window.openPrintPopup = () => {
    const evt = new Event("open-print");
    window.dispatchEvent(evt);
  };

  return (
    <div className="right-panel panel">
      <div className="panel-header">
        <h2 className="title-text">Template</h2>
      </div>

      <div className="template-grid">
        {templates.map((t) => (
          <div
            key={t.id}
            className={`template-card ${
              selectedTemplate === t.id ? "selected" : ""
            }`}
            onClick={() => setSelectedTemplate(t.id)}
          >
            <img src={t.img} alt={t.id} className="template-image" />
            <p className="template-name">{t.id}</p>
          </div>
        ))}
      </div>

      <div className="layout-title">
        <h3>Layout</h3>
      </div>

      <div className="layout-container">
        <div
          className="layout-column"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop("left", null, e)}
        >
          <h3>Left</h3>

          {layout.left.map((item, index) => (
            <div
              key={item + "-" + index}
              className="layout-item"
              draggable
              onDragStart={() => handleDragStart("left", index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop("left", index, e)}
            >
              {item}
            </div>
          ))}
        </div>

        <div
          className="layout-column"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop("right", null, e)}
        >
          <h3>Right</h3>

          {layout.right.map((item, index) => (
            <div
              key={item + "-" + index}
              className="layout-item"
              draggable
              onDragStart={() => handleDragStart("right", index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop("right", index, e)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h3 className="title-text">Font Family</h3>
        <select
          className="font-dropdown"
          value={selectedFont}
          onChange={(e) => {
            setSelectedFont(e.target.value);
            applyIfSelected();
          }}
        >
          {fontOptions.map((font) => (
            <option
              key={font}
              value={font}
              style={{ fontFamily: `"${font}",sans-serif` }}
            >
              {font}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 12 }}>
        <h3>Font Size</h3>
        <input
          type="range"
          min="6"
          max="40"
          className="font-size"
          value={selectedFontSize}
          onChange={(e) => {
            setSelectedFontSize(e.target.value);
            applyIfSelected();
          }}
        />
        <p style={{ fontSize: 12, marginTop: 6 }}>Size: {selectedFontSize}px</p>
      </div>

      <div className="right-section">
        <h4>Line Height</h4>
        <input
          type="range"
          min="1"
          max="3"
          step="0.1"
          className="line-hight"
          value={lineHeight}
          onChange={(e) => setLineHeight(e.target.value)}
        />
        <span>{lineHeight}</span>
      </div>

      <div className="right-section">
        <h4>Page Label</h4>

        <select
          className="page-type-dropdown"
          value={pageType}
          onChange={(e) => setPageType(e.target.value)}
        >
          <option value="">Select Page Type</option>
          <option value="A4">A4</option>
          <option value="Letter">Letter</option>
        </select>

        <span>{pageType}</span>
      </div>

      <div className="theme-section">
        <h3 className="title-text">Theme</h3>
        <div className="color-palette">
          {[
            "#ff4d4d",
            "#ff9900",
            "#0099ff",
            "#6633ff",
            "#00cc66",
            "#ff66cc",
            "#333333",
            "#000000",
          ].map((clr) => (
            <div
              key={clr}
              className="color-dot"
              style={{ background: clr }}
              onClick={() => setPrimaryColor(clr)}
            />
          ))}
        </div>

        <label className="input-label">Primary Color</label>
        <input
          type="color"
          className="color-picker"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
        />

        <label className="input-label">Text Color</label>
        <input
          type="color"
          className="color-picker"
          onChange={(e) => {
            setSelectedTextColor(e.target.value);
            applyIfSelected();
          }}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <h3 className="title-text">Profile Image</h3>

        <select
          className="font-dropdown"
          value={profileImageType}
          onChange={(e) => setProfileImageType(e.target.value)}
        >
          <option value="photo">Upload Photo</option>
          <option value="male">Male Avatar</option>
          <option value="female">Female Avatar</option>
          <option value="none">No Image</option>
        </select>

        {profileImageType === "photo" && (
          <input
            type="file"
            accept="image/*"
            style={{ marginTop: 10 }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => setProfilePhoto(reader.result);
              reader.readAsDataURL(file);
            }}
          />
        )}
      </div>

      {/* PRINT BUTTON */}
      <div style={{ marginTop: 20 }}>
        <button
          style={{
            padding: "12px 18px",
            width: "100%",
            background: "#1f2937",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
          }}
          onClick={() => window.print()}
        >
          PRINT
        </button>
      </div>
    </div>
  );
}
