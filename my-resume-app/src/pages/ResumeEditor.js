import LeftPanel from "../components/LeftPanel";
import MiddlePanel from "../components/MiddlePanel";
import RightPanel from "../components/RightPanel";
import PrintPreviewPanel from "../components/PrintPreviewPanel";
import { generateResume } from "../services/api";
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

  // Pipeline states: idle | submitting | generating | needs_clarification | done | error
  const [pipelineState, setPipelineState] = useState("idle");
  const [pipelineError, setPipelineError] = useState("");
  const [clarificationQuestions, setClarificationQuestions] = useState([]);
  const [clarificationAnswers, setClarificationAnswers] = useState({});
  const [accumulatedAnswers, setAccumulatedAnswers] = useState({});
  const [extractedData, setExtractedData] = useState({});  // Store extracted data for merging
  const [finalResumeSnapshot, setFinalResumeSnapshot] = useState(null);

  // Visual streaming states (frontend-only animation)
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamProgress, setStreamProgress] = useState(0); // 0-100%

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
    profileImageType: "photo",
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

  const [printOrientation, setPrintOrientation] = useState("portrait");

  const handleProfilePhotoChange = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setResumeData((prev) => ({
        ...prev,
        pictureUrl: reader.result,
        profileImageType: "photo",
      }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleChange = (e, section = null, index = 0) => {
    const { name, value } = e.target;


    const newError = validateField(section, name, value);

    setErrors((prev) => ({
      ...prev,
      [`${section || "basic"}-${index}-${name}`]: newError,
    }));

    setResumeData((prev) => {
      if (!section) return { ...prev, [name]: value };

      if (section === "profile") {
        const updated = [...prev.profile];
        updated[index] = { ...updated[index], [name]: value };
        return { ...prev, profile: updated };
      }

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

  // =====================================================
  // DATA MAPPING: Backend → Frontend
  // =====================================================
  const mapBackendToFrontend = (backendData) => {
    if (!backendData) return null;

    const mapped = { ...resumeData }; // Start with current state

    // 1. PROFILE → Contact fields
    if (backendData.profile && typeof backendData.profile === 'object') {
      mapped.fullName = backendData.profile.name || "";
      mapped.headline = backendData.profile.role || "";
      mapped.email = backendData.profile.email || "";
      mapped.phone = backendData.profile.phone || "";
      mapped.location = backendData.profile.location || "";

      // Add GitHub and LinkedIn to profile array
      if (backendData.profile.github || backendData.profile.linkedin) {
        mapped.profile = [];
        if (backendData.profile.github) {
          mapped.profile.push({
            profileNetwork: "GitHub",
            profileUsername: backendData.profile.github,
            profileWebsite: backendData.profile.github,
            profileIcon: "github",
          });
        }
        if (backendData.profile.linkedin) {
          mapped.profile.push({
            profileNetwork: "LinkedIn",
            profileUsername: backendData.profile.linkedin,
            profileWebsite: backendData.profile.linkedin,
            profileIcon: "linkedin",
          });
        }
      }
    }

    // 2. SUMMARY
    if (backendData.summary) {
      mapped.summary = backendData.summary;
    }

    // 3. EXPERIENCE
    if (Array.isArray(backendData.experience) && backendData.experience.length > 0) {
      mapped.experience = backendData.experience.map((exp) => {
        if (typeof exp === 'string') {
          return {
            expCompany: "",
            expPosition: "",
            expDate: "",
            expLocation: "",
            expSummary: exp,
          };
        }
        return {
          expCompany: exp.company || "",
          expPosition: exp.role || exp.title || "",
          expDate: exp.date || exp.start_date || "",
          expLocation: exp.location || "",
          expSummary: exp.description || exp.summary || "",
        };
      });
    }

    // 4. EDUCATION
    if (Array.isArray(backendData.education) && backendData.education.length > 0) {
      mapped.education = backendData.education.map((edu) => {
        if (typeof edu === 'string') {
          return {
            eduInstitute: "",
            eduType: edu,
            eduScore: "",
            eduDate: "",
            eduSummary: "",
          };
        }
        return {
          eduInstitute: edu.institution || edu.school || "",
          eduType: edu.degree || edu.type || "",
          eduScore: edu.score || edu.gpa || "",
          eduDate: edu.year || edu.date || "",
          eduSummary: edu.summary || "",
        };
      });
    }

    // 5. SKILLS
    if (Array.isArray(backendData.skills) && backendData.skills.length > 0) {
      mapped.skills = backendData.skills.map((skill) => {
        if (typeof skill === 'string') {
          return {
            skillName: skill,
            skillDescription: "",
            skillKeyword: "",
            skillLevel: 3,
          };
        }
        return {
          skillName: skill.name || skill.skillName || skill,
          skillDescription: skill.description || "",
          skillKeyword: skill.keyword || "",
          skillLevel: skill.level || 3,
        };
      });
    }

    // 6. LANGUAGES
    if (Array.isArray(backendData.languages) && backendData.languages.length > 0) {
      mapped.languages = backendData.languages.map((lang) => {
        if (typeof lang === 'string') {
          return { langName: lang, langDescription: "", langLevel: 3 };
        }
        return {
          langName: lang.name || lang.langName || lang,
          langDescription: lang.description || "",
          langLevel: lang.level || 3,
        };
      });
    }

    // 7. PROJECTS
    if (Array.isArray(backendData.projects) && backendData.projects.length > 0) {
      mapped.projects = backendData.projects.map((proj) => {
        if (typeof proj === 'string') {
          return {
            projectName: proj,
            projectDescription: "",
            projectWebsite: "",
            projectSummary: "",
          };
        }
        return {
          projectName: proj.name || proj.title || "",
          projectDescription: proj.description || "",
          projectWebsite: proj.website || proj.url || "",
          projectSummary: proj.summary || "",
        };
      });
    }

    // 8. CERTIFICATES
    if (Array.isArray(backendData.certificates) && backendData.certificates.length > 0) {
      mapped.certificates = backendData.certificates.map((cert) => {
        if (typeof cert === 'string') {
          return {
            certName: cert,
            certIssuer: "",
            certDate: "",
            certSummary: "",
          };
        }
        return {
          certName: cert.name || cert.certName || "",
          certIssuer: cert.issuer || "",
          certDate: cert.date || "",
          certSummary: cert.summary || "",
        };
      });
    }

    // 9. AWARDS
    if (Array.isArray(backendData.awards) && backendData.awards.length > 0) {
      mapped.awards = backendData.awards.map((award) => {
        if (typeof award === 'string') {
          return { awardTitle: award, awardDate: "", awardSummary: "" };
        }
        return {
          awardTitle: award.title || award.name || "",
          awardDate: award.date || "",
          awardSummary: award.summary || "",
        };
      });
    }

    // 10. PUBLICATIONS
    if (Array.isArray(backendData.publications) && backendData.publications.length > 0) {
      mapped.publications = backendData.publications.map((pub) => {
        if (typeof pub === 'string') {
          return {
            publicationName: pub,
            publicationPublisher: "",
            publicationDate: "",
            publicationWebsite: "",
            publicationSummary: "",
          };
        }
        return {
          publicationName: pub.name || pub.title || "",
          publicationPublisher: pub.publisher || "",
          publicationDate: pub.date || "",
          publicationWebsite: pub.website || pub.url || "",
          publicationSummary: pub.summary || "",
        };
      });
    }

    // 11. VOLUNTEERING
    if (Array.isArray(backendData.volunteering) && backendData.volunteering.length > 0) {
      mapped.volunteering = backendData.volunteering.map((vol) => {
        if (typeof vol === 'string') {
          return {
            volOrg: "",
            volPosition: "",
            volDate: "",
            volLocation: "",
            volSummary: vol,
          };
        }
        return {
          volOrg: vol.organization || vol.org || "",
          volPosition: vol.position || vol.role || "",
          volDate: vol.date || "",
          volLocation: vol.location || "",
          volSummary: vol.summary || "",
        };
      });
    }

    // 12. INTERESTS
    if (Array.isArray(backendData.interests) && backendData.interests.length > 0) {
      mapped.interests = backendData.interests.map((interest) => {
        if (typeof interest === 'string') {
          return { interestName: interest };
        }
        return {
          interestName: interest.name || interest.interestName || interest,
        };
      });
    }

    // 13. REFERENCES
    if (Array.isArray(backendData.references) && backendData.references.length > 0) {
      mapped.references = backendData.references.map((ref) => {
        if (typeof ref === 'string') {
          return { refName: ref, refDescription: "", refSummary: "" };
        }
        return {
          refName: ref.name || ref.refName || "",
          refDescription: ref.description || "",
          refSummary: ref.summary || "",
        };
      });
    }

    return mapped;
  };

  // =====================================================
  // VISUAL LOADING: Show loading for minimum time
  // =====================================================
  const showDataWithDelay = async (mappedData) => {
    // Add a minimum loading time of 2.5 seconds for better UX
    await new Promise(resolve => setTimeout(resolve, 2500));
    console.log("Setting resumeData to:", mappedData);
    console.log("fullName:", mappedData.fullName);
    console.log("email:", mappedData.email);
    // Use functional update to ensure React re-renders
    setResumeData(prev => ({ ...prev, ...mappedData }));
    setPipelineState("done");
  };


  // =====================================================
  // PIPELINE SUBMISSION HANDLER
  // =====================================================
  const handlePromptSubmit = async () => {
    // Don't submit if already in progress
    if (pipelineState === "submitting" || pipelineState === "generating") {
      return;
    }

    // Clear previous errors and STALE ANSWERS (Start Fresh)
    setPipelineError("");
    setClarificationAnswers({});
    setAccumulatedAnswers({}); // <--- FIX: Clear stale answers
    setPipelineState("submitting");

    try {
      setPipelineState("generating");

      // Call API with prompt and EMPTY answers for a fresh start
      const response = await generateResume(promptValue, {});

      // DEBUG: Log the response
      console.log("=== API Response ===", response);
      console.log("response.success:", response.success);
      console.log("response.status:", response.status);
      console.log("response.data:", response.data);

      // Handle response based on status
      if (!response.success) {
        // Error case
        console.log("Setting state to ERROR");
        setPipelineState("error");
        setPipelineError(response.error || "An error occurred");
        return;
      }

      if (response.status === "needs_clarification") {
        // Case A: Clarification required
        console.log("Setting state to NEEDS_CLARIFICATION");
        console.log("Questions:", response.data?.questions);
        setClarificationQuestions(response.data?.questions || []);
        setClarificationAnswers({});
        // Store extracted data for merging on second pass
        if (response.data?.extractedData) {
          setExtractedData(response.data.extractedData);
        }
        setPipelineState("needs_clarification");
        return;
      }

      if (response.status === "success") {
        // Case B: Final resume returned
        console.log("Setting state to DONE");
        console.log("Backend data:", response.data);

        // Store immutable snapshot
        setFinalResumeSnapshot(response.data);

        // Map backend data to frontend format
        // Use final_resume which contains the structured resume data
        const resumeToMap = response.data.final_resume || response.data;
        const mappedData = mapBackendToFrontend(resumeToMap);
        console.log("Mapped data:", mappedData);

        if (mappedData) {
          // Show data after minimum loading time for better UX
          showDataWithDelay(mappedData);
        } else {
          setPipelineState("done");
        }
        return;
      }

      // QA failed or other status
      if (response.status === "qa_failed") {
        console.log("Setting state to ERROR (QA failed)");
        setPipelineState("error");
        setPipelineError("Quality check failed: " + (response.data?.issues?.join(", ") || "Unknown issues"));
        return;
      }

      // Unhandled status - log it
      console.log("UNHANDLED STATUS:", response.status);

    } catch (err) {
      console.error("API Error:", err);
      setPipelineState("error");
      setPipelineError(err.message || "Network error occurred");
    }
  };

  // Handle clarification answer changes
  const handleClarificationAnswerChange = (key, value) => {
    setClarificationAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle clarification submission
  const handleClarificationSubmit = async () => {
    // Merge extracted data + accumulated answers + new clarification answers
    const mergedAnswers = {
      ...extractedData,  // Previously extracted data from first pass
      ...accumulatedAnswers,
      ...clarificationAnswers,
    };
    setAccumulatedAnswers(mergedAnswers);

    // Clear previous errors and resubmit
    setPipelineError("");
    setPipelineState("submitting");

    try {
      setPipelineState("generating");

      const response = await generateResume(promptValue, mergedAnswers);

      if (!response.success) {
        setPipelineState("error");
        setPipelineError(response.error || "An error occurred");
        return;
      }

      console.log("=== Clarification Submit Response ===", response);

      if (response.status === "needs_clarification") {
        console.log("Status is needs_clarification, showing panel again.");
        setClarificationQuestions(response.data?.questions || []);
        setClarificationAnswers({});
        setPipelineState("needs_clarification");
        return;
      }

      if (response.status === "success") {
        console.log("Status is SUCCESS, updating snapshot and setting done.");

        // Store immutable snapshot
        setFinalResumeSnapshot(response.data || {});

        // Map backend data to frontend format
        // Use final_resume which contains the structured resume data
        const resumeToMap = (response.data || {}).final_resume || response.data || {};
        const mappedData = mapBackendToFrontend(resumeToMap);

        if (mappedData) {
          // Show data after minimum loading time for better UX
          showDataWithDelay(mappedData);
        } else {
          setPipelineState("done");
        }
        return;
      }

      if (response.status === "qa_failed") {
        setPipelineState("error");
        setPipelineError("Quality check failed: " + (response.data?.issues?.join(", ") || "Unknown issues"));
        return;
      }

    } catch (err) {
      setPipelineState("error");
      setPipelineError(err.message || "Network error occurred");
    }
  };

  // Clear error when prompt changes
  const handlePromptChange = (newValue) => {
    setPromptValue(newValue);
    if (pipelineError) {
      setPipelineError("");
      if (pipelineState === "error") {
        setPipelineState("idle");
      }
    }
  };

  const validateField = (section, field, value) => {
    // BASIC REGEX
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    // ERROR HOLDER
    let error = "";

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
            onPromptChange={handlePromptChange}
            onPromptSubmit={handlePromptSubmit}
            pipelineState={pipelineState}
            pipelineError={pipelineError}
            clarificationQuestions={clarificationQuestions}
            clarificationAnswers={clarificationAnswers}
            onClarificationAnswerChange={handleClarificationAnswerChange}
            onClarificationSubmit={handleClarificationSubmit}
          />
        </div>

        <main style={{ width: "54%" }}>
          <MiddlePanel
            data={resumeData}
            template={selectedTemplate}
            enablePrint={!showPrintPopup}
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
            pipelineState={pipelineState}
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
      {/* Print preview panel */}
      <PrintPreviewPanel
        visible={showPrintPopup}
        onClose={() => setShowPrintPopup(false)}
        pageType={pageType}
        setPageType={setPageType}
        orientation={printOrientation}
        setOrientation={setPrintOrientation}
        onPrint={() => window.print()}
      >
        <MiddlePanel
          customId="resume-preview"
          data={resumeData}
          template={selectedTemplate}
          selectedFont={selectedFont}
          selectedFontSize={selectedFontSize} // Preview uses same font size
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
          pipelineState="idle" // Force idle state for preview to avoid loading spinners
        />
      </PrintPreviewPanel>
    </>
  );
};

export default ResumeEditor;
