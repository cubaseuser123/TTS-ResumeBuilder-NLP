import LeftPanel from "../components/LeftPanel";
import MiddlePanel from "../components/MiddlePanel";
import RightPanel from "../components/RightPanel";
import PrintPreviewPanel from "../components/PrintPreviewPanel";
import "../App.css";
import "../fonts/fonts.css";
import "../responsive.css";
import React, { useState } from "react";

const ResumeEditor = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("template1");
  const [showPrintPopup, setShowPrintPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [promptValue, setPromptValue] = useState("");

  const [visibleSections, setVisibleSections] = useState({
    Photo: true,
    Contact: true,
    Summary: true,
    Experience: true,
    Education: true,
    Skills: true,
    Languages: true,
    Awards: true,
    Certificates: true,
    Interests: true,
    Projects: true,
    Publications: true,
    Volunteering: true,
    References: true,
    Profile: true,
  });

  const [resumeData, setResumeData] = useState({
    pictureUrl: "",
    profileImageType: "photo", // "photo" | "male" | "female" | "none"
    fullName: "",
    headline: "",
    email: "",
    website: "",
    phone: "",
    location: "",
    summary: "",

    profile: [
      {
        profileNetwork: "",
        profileUsername: "",
        profileWebsite: "",
        profileIcon: "",
      },
    ],
    experience: [
      {
        expCompany: "",
        expPosition: "",
        expDate: "",
        expLocation: "",
        expSummary: "",
      },
    ],
    education: [
      {
        eduInstitute: "",
        eduType: "",
        eduScore: "",
        eduDate: "",
        eduSummary: "",
      },
    ],
    skills: [
      { skillName: "", skillDescription: "", skillKeyword: "", skillLevel: 3 },
    ],
    languages: [{ langName: "", langDescription: "", langLevel: 3 }],
    awards: [{ awardTitle: "", awardDate: "", awardSummary: "" }],
    certificates: [
      { certName: "", certIssuer: "", certDate: "", certSummary: "" },
    ],
    interests: [{ interestName: "" }],
    projects: [
      {
        projectName: "",
        projectDescription: "",
        projectWebsite: "",
        projectSummary: "",
      },
    ],
    publications: [
      {
        publicationName: "",
        publicationPublisher: "",
        publicationDate: "",
        publicationWebsite: "",
        publicationSummary: "",
      },
    ],
    volunteering: [
      {
        volOrg: "",
        volPosition: "",
        volDate: "",
        volLocation: "",
        volSummary: "",
      },
    ],
    references: [{ refName: "", refDescription: "", refSummary: "" }],
  });

  const [sectionTitles, setSectionTitles] = useState({
    Profile: "Profile",
    Experience: "Experience",
    Education: "Education",
    Skills: "Skills",
    Languages: "Languages",
    Awards: "Awards",
    Certificates: "Certificates",
    Interests: "Interests",
    Projects: "Projects",
    Publications: "Publications",
    Volunteering: "Volunteering",
    References: "References",
  });

  const [layout, setLayout] = useState({
    left: ["Photo", "Profile", "Summary", "Skills", "Languages", "Interests"],
    right: [
      "Experience",
      "Education",
      "Certificates",
      "Projects",
      "Awards",
      "Publications",
      "Volunteering",
      "References",
    ],
  });

  const handleProfilePhotoChange = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setResumeData((prev) => ({
        ...prev,
        pictureUrl: reader.result, // store uploaded image
        profileImageType: "photo", // switch to photo automatically
      }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleChange = (e, section = null, index = 0) => {
    const { name, value } = e.target;

    // 1️⃣ VALIDATION (this will NOT affect your output)
    const newError = validateField(section, name, value);

    setErrors((prev) => ({
      ...prev,
      [`${section || "basic"}-${index}-${name}`]: newError,
    }));

    // UPDATE DATA (your old working code kept exactly same)
    setResumeData((prev) => {
      if (!section) return { ...prev, [name]: value };

      // special handling for profile (your original code)
      if (section === "profile") {
        const updated = [...prev.profile];
        updated[index] = { ...updated[index], [name]: value };
        return { ...prev, profile: updated };
      }

      // default for array sections
      const updated = Array.isArray(prev[section]) ? [...prev[section]] : [];
      updated[index] = { ...updated[index], [name]: value };
      return { ...prev, [section]: updated };
    });
  };

  // Converts "experience" → "Experience"
  const normalizeSectionKey = (section) => {
    if (!section) return section;
    return section.charAt(0).toUpperCase() + section.slice(1);
  };

  const addItem = (section) => {
    // 1️⃣ If section is hidden → just show it, don't add item yet
    if (!visibleSections[section] === false) {
      setVisibleSections((prev) => ({
        ...prev,
        [section]: true,
      }));
      return;
    }

    // 2️⃣ REQUIRED FIELDS VALIDATION (only Experience + Education)
    const requiredFields = {
      experience: ["expCompany", "expPosition", "expDate", "expLocation"],
      education: ["eduInstitute", "eduType", "eduScore", "eduDate"],
    };

    // Only validate if section has required fields
    if (requiredFields[section]) {
      const lastIndex = resumeData[section].length - 1;
      const lastItem = resumeData[section][lastIndex];

      for (let field of requiredFields[section]) {
        if (!lastItem[field] || lastItem[field].trim() === "") {
          alert(`Please fill required field: ${field}`);
          return; // stop adding new item
        }
      }
    }

    // 3️⃣ ADD NEW ITEM (your original defaults untouched)
    setResumeData((prev) => {
      const defaults = {
        experience: {
          expCompany: "",
          expPosition: "",
          expDate: "",
          expLocation: "",
          expSummary: "",
        },
        education: {
          eduInstitute: "",
          eduType: "",
          eduArea: "",
          eduScore: "",
          eduDate: "",
          eduWebsite: "",
          eduSummary: "",
        },
        skills: {
          skillName: "",
          skillDescription: "",
          skillKeyword: "",
          skillLevel: 3,
        },
        languages: { langName: "", langDescription: "", langLevel: 3 },
        awards: {
          awardTitle: "",
          awardName: "",
          awardDate: "",
          awardWebsite: "",
          awardSummary: "",
        },
        certificates: {
          certName: "",
          certIssuer: "",
          certDate: "",
          certWebsite: "",
          certSummary: "",
        },
        interests: { interestName: "", interestKeyword: "" },
        projects: {
          projectName: "",
          projectDescription: "",
          projectDate: "",
          projectWebsite: "",
          projectSummary: "",
          projectKeyword: "",
        },
        publications: {
          publicationName: "",
          publicationPublisher: "",
          publicationDate: "",
          publicationWebsite: "",
          publicationSummary: "",
        },
        volunteering: {
          volOrg: "",
          volPosition: "",
          volDate: "",
          volLocation: "",
          volWebsite: "",
          volSummary: "",
        },
        references: { refName: "", refDescription: "", refSummary: "" },
      };

      const sectionArray = Array.isArray(prev[section])
        ? [...prev[section]]
        : [];

      sectionArray.push(defaults[section] || {});

      return { ...prev, [section]: sectionArray };
    });
  };

  const removeItem = (section, index) => {
    setResumeData((prev) => {
      if (!Array.isArray(prev[section])) return prev;
      const updated = [...prev[section]];
      if (updated.length === 1) {
        const cleared = Object.keys(updated[0]).reduce((acc, key) => {
          acc[key] = typeof updated[0][key] === "number" ? 0 : "";
          return acc;
        }, {});
        return { ...prev, [section]: [cleared] };
      }
      updated.splice(index, 1);
      return { ...prev, [section]: updated };
    });
  };

  // Style controls
  const [selectedFont, setSelectedFont] = useState("Lato, sans-serif");
  const [selectedFontSize, setSelectedFontSize] = useState(14);
  const [pageType, setPageType] = useState("A4");
  const [lineHeight, setLineHeight] = useState(1.5);
  const [selectedTextColor, setSelectedTextColor] = useState("#000000");
  const [profileImageType, setProfileImageType] = useState("photo");
  const [profilePhoto, setProfilePhoto] = useState(null);

  // trigger to apply style: timestamp changes on each control change
  const [applyStyleTrigger, setApplyStyleTrigger] = useState(0);
  const triggerApply = () => setApplyStyleTrigger((prev) => prev + 1);

  const validateField = (section, field, value) => {
    // BASIC REGEX
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    // ERROR HOLDER
    let error = "";

    // -------- BASICS VALIDATION ----------
    if (!section) {
      if (field === "fullName" && !value.trim())
        error = "Full name is required.";

      if (field === "email") {
        if (!value.trim()) error = "Email is required.";
        else if (!emailRegex.test(value)) error = "Enter a valid email.";
      }

      if (field === "phone") {
        if (!value.trim()) error = "Phone is required.";
        else if (!phoneRegex.test(value)) error = "Phone must be 10 digits.";
      }

      return error;
    }

    // -------- EXPERIENCE ----------
    if (section === "experience") {
      if (field === "expCompany" && !value.trim())
        error = "Company name is required.";
      if (field === "expPosition" && !value.trim())
        error = "Position is required.";
      if (field === "expDate" && !value.trim()) error = "Date is required.";
      if (field === "expLocation" && !value.trim())
        error = "Location is required.";
    }

    // -------- EDUCATION ----------
    if (section === "education") {
      if (field === "eduInstitute" && !value.trim())
        error = "Institute name is required.";
      if (field === "eduType" && !value.trim())
        error = "Education type is required.";
      if (field === "eduScore" && !value.trim()) error = "Score is required.";
      if (field === "eduDate" && !value.trim()) error = "Date is required.";
    }

    return error;
  };

  return (
    <>
      <header className="mobile-header">
        <div className="flex-items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon-lg icon-margin-right"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <span className="title-text">frontend devleopment</span>
        </div>
        <div className="template-badge">{selectedTemplate}</div>
      </header>

      <div className="app-container" style={{ display: "flex", width: "100%" }}>
        <div style={{ width: "23%" }}>
          <LeftPanel
            resumeData={resumeData}
            handleChange={handleChange}
            addItem={addItem}
            removeItem={removeItem}
            visibleSections={visibleSections}
            setVisibleSections={setVisibleSections}
            profileImageType={profileImageType}
            setProfileImageType={setProfileImageType}
            setProfilePhoto={setProfilePhoto}
            sectionTitles={sectionTitles}
            setSectionTitles={setSectionTitles}
            promptValue={promptValue}
            onPromptChange={setPromptValue}
          />
        </div>

        <main style={{ width: "54%" }}>
          <MiddlePanel
            data={resumeData}
            template={selectedTemplate}
            selectedFont={selectedFont}
            selectedFontSize={selectedFontSize}
            applyStyleTrigger={applyStyleTrigger}
            pageType={pageType}
            lineHeight={lineHeight}
            selectedTextColor={selectedTextColor}
            layout={layout}
            visibleSections={visibleSections}
            profileImageType={profileImageType}
            profilePhoto={profilePhoto}
            setProfileImageType={setProfileImageType}
            setProfilePhoto={setProfilePhoto}
            primaryColor={primaryColor}
            sectionTitles={sectionTitles}
          />
        </main>

        <div style={{ width: "23%" }}>
          <RightPanel
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
            selectedFont={selectedFont}
            setSelectedFont={setSelectedFont}
            selectedFontSize={selectedFontSize}
            setSelectedFontSize={setSelectedFontSize}
            pageType={pageType}
            setPageType={setPageType}
            lineHeight={lineHeight}
            setLineHeight={setLineHeight}
            selectedTextColor={selectedTextColor}
            setSelectedTextColor={setSelectedTextColor}
            triggerApply={triggerApply}
            layout={layout}
            setLayout={setLayout}
            profileImageType={profileImageType}
            setProfileImageType={setProfileImageType}
            setProfilePhoto={setProfilePhoto}
          />
        </div>
      </div>

      {/* Print preview panel */}
      <PrintPreviewPanel
        visible={showPrintPopup}
        onClose={() => setShowPrintPopup(false)}
        resumeData={resumeData}
        selectedTemplate={selectedTemplate}
        pageType={pageType}
        layout={layout}
      />
    </>
  );
};

export default ResumeEditor;
