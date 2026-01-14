import WebFont from "webfontloader";
import ttsImage from "../fonts/tts.png";
import React, { useState } from "react";
import PromptBox from "./PromptBox/PromptBox";
import ClarificationPanel from "./ClarificationPanel/ClarificationPanel";

const EditableTitle = ({ value, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);

  const handleBlur = () => {
    setEditing(false);
    onChange(text); // update parent state
  };

  return editing ? (
    <input
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleBlur}
      autoFocus
      style={{ fontSize: "16px", fontWeight: "600", width: "100%" }}
    />
  ) : (
    <span
      onClick={() => setEditing(true)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // 👈 pushes pencil to right
        width: "100%",
        cursor: "pointer",
      }}
      title="Click to edit section title"
    >
      {value}
      <span style={{ marginLeft: "10px" }}>✏️</span>
    </span>
  );
};

const LeftPanel = ({
  resumeData,
  handleChange,
  addItem,
  removeItem,
  visibleSections,
  setVisibleSections,
  profileImageType,
  setProfileImageType,
  setProfilePhoto,
  sectionTitles,
  setSectionTitles,
  // PromptBox props
  promptValue,
  onPromptChange,
  onPromptSubmit,
  pipelineState,
  pipelineError,
  // ClarificationPanel props
  clarificationQuestions,
  clarificationAnswers,
  onClarificationAnswerChange,
  onClarificationSubmit,
}) => {
  return (
    <div className="left-panel panel">
      {/* HEADER */}
      <div className="panel-header">
        <img src={ttsImage} alt="TTS" className="panel-logo" />
      </div>

      <div className="space-y">
        {/* ================= PROFILE IMAGE ================= */}
        <h3 className="section-title">Basics</h3>

        <label className="input-group">
          <span className="input-label">Image Type</span>
          <select
            className="font-dropdown"
            value={profileImageType}
            onChange={(e) => {
              const value = e.target.value;
              setProfileImageType(value);

              if (value === "none") {
                setProfilePhoto(null);
              }
            }}
          >
            <option value="photo">Upload Photo</option>
            <option value="male">Male Avatar</option>
            <option value="female">Female Avatar</option>
          </select>
        </label>

        {profileImageType === "photo" && (
          <input
            type="file"
            accept="image/*"
            style={{ marginTop: 10 }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                setProfilePhoto(reader.result);
                setProfileImageType("photo");
              };
              reader.readAsDataURL(file);
            }}
          />
        )}

        <label className="input-group">
          <span className="input-label">Full Name</span>
          <input
            type="text"
            name="fullName"
            value={resumeData.fullName}
            onChange={(e) => handleChange(e)}
            className="text-input"
          />
        </label>

        <label className="input-group">
          <span className="input-label">Headline</span>
          <input
            type="text"
            name="headline"
            value={resumeData.headline}
            onChange={(e) => handleChange(e)}
            className="text-input"
          />
        </label>

        <div className="grid-2-cols">
          <label className="input-group">
            <span className="input-label">Email</span>
            <input
              type="email"
              name="email"
              value={resumeData.email}
              onChange={(e) => handleChange(e)}
              className="text-input"
            />
          </label>

          <label className="input-group">
            <span className="input-label">Website</span>
            <input
              type="text"
              name="website"
              value={resumeData.website}
              onChange={(e) => handleChange(e)}
              className="text-input"
            />
          </label>
        </div>

        <div className="grid-2-cols">
          <label className="input-group">
            <span className="input-label">Phone</span>
            <input
              type="text"
              name="phone"
              value={resumeData.phone}
              onChange={(e) => handleChange(e)}
              className="text-input"
            />
          </label>

          <label className="input-group">
            <span className="input-label">Location</span>
            <input
              type="text"
              name="location"
              value={resumeData.location}
              onChange={(e) => handleChange(e)}
              className="text-input"
            />
          </label>
        </div>

        <label className="input-group">
          <span className="input-label">Summary</span>
          <textarea
            name="summary"
            value={resumeData.summary}
            onChange={(e) => handleChange(e)}
            className="text-input"
            rows="4"
            placeholder="Write a short professional summary..."
          />
        </label>

        {/* PROFILE (object) */}
        <h3 className="section-title">
          <EditableTitle
            value={sectionTitles.Profile}
            onChange={(val) =>
              setSectionTitles((prev) => ({ ...prev, Profile: val }))
            }
          />
        </h3>

        {resumeData.profile.map((profile, idx) => (
          <div key={idx} className="item-block">
            <div className="grid-2-cols">
              <input
                type="text"
                name="profileNetwork"
                value={profile.profileNetwork}
                onChange={(e) => handleChange(e, "profile", idx)}
                className="text-input"
                placeholder="LinkedIn / GitHub / Twitter"
              />

              <input
                type="text"
                name="profileUsername"
                value={profile.profileUsername}
                onChange={(e) => handleChange(e, "profile", idx)}
                className="text-input"
                placeholder="@username"
              />
            </div>

            <label className="input-group">
              <span className="input-label">Website</span>
              <input
                type="text"
                name="profileWebsite"
                value={profile.profileWebsite}
                onChange={(e) => handleChange(e, "profile", idx)}
                className="text-input"
                placeholder="https://yourwebsite.com"
              />
            </label>
          </div>
        ))}

        {/* EXPERIENCE */}
        <h3 className="section-title">
          {" "}
          <EditableTitle
            value={sectionTitles.Experience}
            onChange={(val) =>
              setSectionTitles((prev) => ({ ...prev, Experience: val }))
            }
          />
        </h3>

        {resumeData.experience.map((exp, idx) => (
          <div key={idx} className="item-block">
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <strong>Item {idx + 1}</strong>

              <div>
                <button
                  type=" button"
                  onClick={() => removeItem("experience")}
                  className="mini-btn danger"
                  style={{ marginRight: "5px" }}
                >
                  Remove
                </button>
                {idx === resumeData.experience.length - 1 && (
                  <button
                    type=" button"
                    onClick={() => {
                      if (!visibleSections?.Experience) {
                        setVisibleSections((prev) => ({
                          ...prev,
                          Experience: true,
                        }));
                      }
                      addItem("experience");
                    }}
                    className="mini-btn"
                  >
                    + Add
                  </button>
                )}
              </div>
            </div>

            <div className="grid-2-cols">
              <input
                type="text"
                name="expCompany"
                value={exp.expCompany}
                onChange={(e) => handleChange(e, "experience", idx)}
                className="text-input"
                placeholder="Company Name"
              />
              <input
                type="text"
                name="expPosition"
                value={exp.expPosition}
                onChange={(e) => handleChange(e, "experience", idx)}
                className="text-input"
                placeholder="Job Title / Role"
              />
            </div>

            <div className="grid-2-cols">
              <input
                type="text"
                name="expDate"
                value={exp.expDate}
                onChange={(e) => handleChange(e, "experience", idx)}
                className="text-input"
                placeholder="Jan 2023 - Present"
              />
              <input
                type="text"
                name="expLocation"
                value={exp.expLocation}
                onChange={(e) => handleChange(e, "experience", idx)}
                className="text-input"
                placeholder="City, Country"
              />
            </div>

            <label className="input-group">
              <span className="input-label">Summary</span>
              <textarea
                name="expSummary"
                value={exp.expSummary}
                onChange={(e) => handleChange(e, "experience", idx)}
                className="text-input"
                rows="3"
                placeholder="Describe your role and achievements..."
              />
            </label>
            <button
              className="remove-section"
              type="button"
              style={{
                backgroundColor: "#404c7dff",
                width: "100%",
                border: "none",
                height: "25px",
                color: "white",
                marginBottom: "30px",
                marginTop: "10px",
                borderRadius: "8px",
              }}
              onClick={() => {
                setVisibleSections((prev) => ({
                  ...prev,
                  Experience: false,
                }));
              }}
            >
              Remove Section from resume
            </button>
          </div>
        ))}

        {/* EDUCATION */}
        <h3 className="section-title">
          <EditableTitle
            value={sectionTitles.Education}
            onChange={(val) =>
              setSectionTitles((prev) => ({ ...prev, Education: val }))
            }
          />
        </h3>
        {resumeData.education.map((edu, idx) => (
          <div key={idx} className="item-block">
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <strong>Item {idx + 1}</strong>
              <div>
                <button
                  type=" button"
                  onClick={() => removeItem("education", idx)}
                  className="mini-btn danger"
                  style={{ marginRight: "5px" }}
                >
                  Remove
                </button>

                {idx === resumeData.education.length - 1 && (
                  <button
                    type=" button"
                    onClick={() => {
                      if (!visibleSections?.Education) {
                        setVisibleSections((prev) => ({
                          ...prev,
                          Education: true,
                        }));
                      }
                      addItem("education");
                    }}
                    className="mini-btn"
                  >
                    +Add
                  </button>
                )}
              </div>
            </div>

            <div className="grid-2-cols">
              <input
                type="text"
                name="eduInstitute"
                value={edu.eduInstitute}
                onChange={(e) => handleChange(e, "education", idx)}
                className="text-input"
                placeholder="Institute"
              />
              <input
                type="text"
                name="eduType"
                value={edu.eduType}
                onChange={(e) => handleChange(e, "education", idx)}
                className="text-input"
                placeholder="Type of Study"
              />
            </div>

            <div className="grid-2-cols">
              <input
                type="text"
                name="eduScore"
                value={edu.eduScore}
                onChange={(e) => handleChange(e, "education", idx)}
                className="text-input"
                placeholder="Score"
              />
            </div>

            <label className="input-group">
              <span className="input-label">Date / Date Range</span>
              <input
                type="text"
                name="eduDate"
                value={edu.eduDate}
                onChange={(e) => handleChange(e, "education", idx)}
                className="text-input"
                placeholder="Jan 2020 - Dec 2023"
              />
            </label>
            <button
              className="remove-section"
              type="button"
              style={{
                backgroundColor: "#404c7dff",
                width: "100%",
                border: "none",
                height: "25px",
                color: "white",
                marginBottom: "30px",
                marginTop: "10px",
                borderRadius: "8px",
              }}
              onClick={() => {
                setVisibleSections((prev) => ({
                  ...prev,
                  Education: false,
                }));
              }}
            >
              Remove Section from resume
            </button>
          </div>
        ))}

        {/* SKILLS */}
        <h3 className="section-title">
          <EditableTitle
            value={sectionTitles.Skills}
            onChange={(val) =>
              setSectionTitles((prev) => ({ ...prev, Skills: val }))
            }
          />
        </h3>
        {resumeData.skills.map((skill, idx) => (
          <div key={idx} className="item-block">
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <strong>Item {idx + 1}</strong>
              <div>
                <button
                  type=" button"
                  onClick={() => removeItem("skills", idx)}
                  className="mini-btn danger"
                  style={{ marginRight: "5px" }}
                >
                  Remove
                </button>

                {idx === resumeData.skills.length - 1 && (
                  <button
                    type=" button"
                    onClick={() => {
                      if (!visibleSections?.Skills) {
                        setVisibleSections((prev) => ({
                          ...prev,
                          Skills: true,
                        }));
                      }
                      addItem("skills");
                    }}
                    className="mini-btn"
                  >
                    +Add
                  </button>
                )}
              </div>
            </div>

            <div className="grid-2-cols">
              <input
                type="text"
                name="skillName"
                value={skill.skillName}
                onChange={(e) => handleChange(e, "skills", idx)}
                className="text-input"
                placeholder="e.g., JavaScript"
              />
              <input
                type="text"
                name="skillDescription"
                value={skill.skillDescription}
                onChange={(e) => handleChange(e, "skills", idx)}
                className="text-input"
                placeholder="Brief description of the skill"
              />
            </div>

            <label className="input-group">
              <span className="input-label">Keyword</span>
              <input
                type="text"
                name="skillKeyword"
                value={skill.skillKeyword}
                onChange={(e) => handleChange(e, "skills", idx)}
                className="text-input"
                placeholder="e.g., React, Node.js"
              />
            </label>

            <label className="input-group">
              <span className="input-label">Level</span>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <input
                  type="range"
                  name="skillLevel"
                  min="1"
                  max="5"
                  value={skill.skillLevel}
                  onChange={(e) => handleChange(e, "skills", idx)}
                  className="text-input"
                />
                <span>{skill.skillLevel}</span>
              </div>
            </label>
            <button
              className="remove-section"
              type="button"
              style={{
                backgroundColor: "#404c7dff",
                width: "100%",
                border: "none",
                height: "25px",
                color: "white",
                marginBottom: "30px",
                marginTop: "10px",
                borderRadius: "8px",
              }}
              onClick={() => {
                setVisibleSections((prev) => ({
                  ...prev,
                  Skills: false,
                }));
              }}
            >
              Remove Section from resume
            </button>
          </div>
        ))}

        {/* LANGUAGES */}
        <h3 className="section-title">
          <EditableTitle
            value={sectionTitles.Languages}
            onChange={(val) =>
              setSectionTitles((prev) => ({ ...prev, Languages: val }))
            }
          />
        </h3>
        {resumeData.languages.map((lang, idx) => (
          <div key={idx} className="item-block">
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <strong>Item {idx + 1}</strong>
              <div>
                <button
                  type=" button"
                  onClick={() => removeItem("languages", idx)}
                  className="mini-btn danger"
                  style={{ marginRight: "5px" }}
                >
                  Remove
                </button>

                {idx === resumeData.languages.length - 1 && (
                  <button
                    type=" button"
                    onClick={() => {
                      if (!visibleSections?.Languages) {
                        setVisibleSections((prev) => ({
                          ...prev,
                          Languages: true,
                        }));
                      }
                      addItem("languages");
                    }}
                    className="mini-btn"
                  >
                    +Add
                  </button>
                )}
              </div>
            </div>

            <div className="grid-2-cols">
              <input
                type="text"
                name="langName"
                value={lang.langName}
                onChange={(e) => handleChange(e, "languages", idx)}
                className="text-input"
                placeholder="e.g., English"
              />
              <input
                type="text"
                name="langDescription"
                value={lang.langDescription}
                onChange={(e) => handleChange(e, "languages", idx)}
                className="text-input"
                placeholder="Proficiency"
              />
            </div>

            <label className="input-group">
              <span className="input-label">Level</span>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <input
                  type="range"
                  name="langLevel"
                  min="1"
                  max="5"
                  value={lang.langLevel}
                  onChange={(e) => handleChange(e, "languages", idx)}
                  className="text-input"
                />
                <span>{lang.langLevel}</span>
              </div>
            </label>
            <button
              className="remove-section"
              type="button"
              style={{
                backgroundColor: "#404c7dff",
                width: "100%",
                border: "none",
                height: "25px",
                color: "white",
                marginBottom: "30px",
                marginTop: "10px",
                borderRadius: "8px",
              }}
              onClick={() => {
                setVisibleSections((prev) => ({
                  ...prev,
                  Languages: false,
                }));
              }}
            >
              Remove Section from resume
            </button>
          </div>
        ))}

        {/* AWARDS */}
        <h3 className="section-title">
          <EditableTitle
            value={sectionTitles.Awards}
            onChange={(val) =>
              setSectionTitles((prev) => ({ ...prev, Awards: val }))
            }
          />
        </h3>
        {resumeData.awards.map((a, idx) => (
          <div key={idx} className="item-block">
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <strong>Item {idx + 1}</strong>
              <div>
                <button
                  type=" button"
                  onClick={() => removeItem("awards", idx)}
                  className="mini-btn danger"
                  style={{ marginRight: "5px" }}
                >
                  Remove
                </button>

                {idx === resumeData.awards.length - 1 && (
                  <button
                    type=" button"
                    onClick={() => {
                      if (!visibleSections?.Awards) {
                        setVisibleSections((prev) => ({
                          ...prev,
                          Awards: true,
                        }));
                      }
                      addItem("awards");
                    }}
                    className="mini-btn"
                  >
                    +Add
                  </button>
                )}
              </div>
            </div>

            <div className="grid-2-cols">
              <input
                type="text"
                name="awardTitle"
                value={a.awardTitle}
                onChange={(e) => handleChange(e, "awards", idx)}
                className="text-input"
                placeholder="Title"
              />
            </div>

            <div className="grid-2-cols">
              <input
                type="text"
                name="awardDate"
                value={a.awardDate}
                onChange={(e) => handleChange(e, "awards", idx)}
                className="text-input"
                placeholder="Date"
              />
            </div>

            <label className="input-group">
              <span className="input-label">Summary</span>
              <textarea
                name="awardSummary"
                value={a.awardSummary}
                onChange={(e) => handleChange(e, "awards", idx)}
                className="text-input"
                rows="2"
                placeholder="Brief description..."
              />
            </label>
            <button
              className="remove-section"
              type="button"
              style={{
                backgroundColor: "#404c7dff",
                width: "100%",
                border: "none",
                height: "25px",
                color: "white",
                marginBottom: "30px",
                marginTop: "10px",
                borderRadius: "8px",
              }}
              onClick={() => {
                setVisibleSections((prev) => ({
                  ...prev,
                  Awards: false,
                }));
              }}
            >
              Remove Section from resume
            </button>
          </div>
        ))}

        {/* CERTIFICATES */}
        <h3 className="section-title">
          <EditableTitle
            value={sectionTitles.Certificates}
            onChange={(val) =>
              setSectionTitles((prev) => ({ ...prev, Certificates: val }))
            }
          />
        </h3>
        {resumeData.certificates.map((c, idx) => (
          <div key={idx} className="item-block">
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <strong>Item {idx + 1}</strong>
              <div>
                <button
                  type=" button"
                  onClick={() => removeItem("certificates", idx)}
                  className="mini-btn danger"
                  style={{ marginRight: "5px" }}
                >
                  Remove
                </button>

                {idx === resumeData.certificates.length - 1 && (
                  <button
                    type=" button"
                    onClick={() => {
                      if (!visibleSections?.Certificates) {
                        setVisibleSections((prev) => ({
                          ...prev,
                          Certificates: true,
                        }));
                      }
                      addItem("certificates");
                    }}
                    className="mini-btn"
                  >
                    +Add
                  </button>
                )}
              </div>
            </div>

            <div className="grid-2-cols">
              <input
                type="text"
                name="certName"
                value={c.certName}
                onChange={(e) => handleChange(e, "certificates", idx)}
                className="text-input"
                placeholder="Certificate Name"
              />
              <input
                type="text"
                name="certIssuer"
                value={c.certIssuer}
                onChange={(e) => handleChange(e, "certificates", idx)}
                className="text-input"
                placeholder="Issuer"
              />
            </div>

            <div className="grid-2-cols">
              <input
                type="text"
                name="certDate"
                value={c.certDate}
                onChange={(e) => handleChange(e, "certificates", idx)}
                className="text-input"
                placeholder="Date"
              />
            </div>
            <button
              className="remove-section"
              type="button"
              style={{
                backgroundColor: "#404c7dff",
                width: "100%",
                border: "none",
                height: "25px",
                color: "white",
                marginBottom: "30px",
                marginTop: "10px",
                borderRadius: "8px",
              }}
              onClick={() => {
                setVisibleSections((prev) => ({
                  ...prev,
                  Certificates: false,
                }));
              }}
            >
              Remove Section from resume
            </button>
          </div>
        ))}

        {/* INTERESTS */}
        <h3 className="section-title">
          <EditableTitle
            value={sectionTitles.Interests}
            onChange={(val) =>
              setSectionTitles((prev) => ({ ...prev, Interests: val }))
            }
          />
        </h3>
        {resumeData.interests.map((it, idx) => (
          <div key={idx} className="item-block">
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <strong>Item {idx + 1}</strong>
              <div>
                <button
                  type=" button"
                  onClick={() => removeItem("interests", idx)}
                  className="mini-btn danger"
                  style={{ marginRight: "5px" }}
                >
                  Remove
                </button>

                {idx === resumeData.interests.length - 1 && (
                  <button
                    type=" button"
                    onClick={() => {
                      if (!visibleSections?.Interests) {
                        setVisibleSections((prev) => ({
                          ...prev,
                          Interests: true,
                        }));
                      }
                      addItem("interests");
                    }}
                    className="mini-btn"
                  >
                    +Add
                  </button>
                )}
              </div>
            </div>

            <label className="input-group">
              <span className="input-label">Interest Name</span>
              <input
                type="text"
                name="interestName"
                value={it.interestName}
                onChange={(e) => handleChange(e, "interests", idx)}
                className="text-input"
                placeholder="e.g., Traveling"
              />
            </label>
            <button
              className="remove-section"
              type="button"
              style={{
                backgroundColor: "#404c7dff",
                width: "100%",
                border: "none",
                height: "25px",
                color: "white",
                marginBottom: "30px",
                marginTop: "10px",
                borderRadius: "8px",
              }}
              onClick={() => {
                setVisibleSections((prev) => ({
                  ...prev,
                  Interests: false,
                }));
              }}
            >
              Remove Section from resume
            </button>
          </div>
        ))}

        {/* PROJECTS */}
        <h3 className="section-title">
          <EditableTitle
            value={sectionTitles.Projects}
            onChange={(val) =>
              setSectionTitles((prev) => ({ ...prev, Projects: val }))
            }
          />
        </h3>
        {resumeData.projects.map((p, idx) => (
          <div key={idx} className="item-block">
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <strong>Item {idx + 1}</strong>
              <div>
                <button
                  type=" button"
                  onClick={() => removeItem("projects", idx)}
                  className="mini-btn danger"
                  style={{ marginRight: "5px" }}
                >
                  Remove
                </button>

                {idx === resumeData.projects.length - 1 && (
                  <button
                    type=" button"
                    onClick={() => {
                      if (!visibleSections?.Projects) {
                        setVisibleSections((prev) => ({
                          ...prev,
                          Projects: true,
                        }));
                      }
                      addItem("projects");
                    }}
                    className="mini-btn"
                  >
                    +Add
                  </button>
                )}
              </div>
            </div>

            <div className="grid-2-cols">
              <input
                type="text"
                name="projectName"
                value={p.projectName}
                onChange={(e) => handleChange(e, "projects", idx)}
                className="text-input"
                placeholder="Project Name"
              />
              <input
                type="text"
                name="projectDescription"
                value={p.projectDescription}
                onChange={(e) => handleChange(e, "projects", idx)}
                className="text-input"
                placeholder="Short description"
              />
            </div>

            <div className="grid-2-cols">
              <input
                type="text"
                name="projectWebsite"
                value={p.projectWebsite}
                onChange={(e) => handleChange(e, "projects", idx)}
                className="text-input"
                placeholder="Website"
              />
            </div>

            <label className="input-group">
              <span className="input-label">Summary</span>
              <textarea
                name="projectSummary"
                value={p.projectSummary}
                onChange={(e) => handleChange(e, "projects", idx)}
                className="text-input"
                rows="2"
                placeholder="Describe the project..."
              />
            </label>
            <button
              className="remove-section"
              type="button"
              style={{
                backgroundColor: "#404c7dff",
                width: "100%",
                border: "none",
                height: "25px",
                color: "white",
                marginBottom: "30px",
                marginTop: "10px",
                borderRadius: "8px",
              }}
              onClick={() => {
                setVisibleSections((prev) => ({
                  ...prev,
                  Projects: false,
                }));
              }}
            >
              Remove Section from resume
            </button>
          </div>
        ))}

        {/* PUBLICATIONS */}
        <h3 className="section-title">
          <EditableTitle
            value={sectionTitles.Publications}
            onChange={(val) =>
              setSectionTitles((prev) => ({ ...prev, Publications: val }))
            }
          />
        </h3>
        {resumeData.publications.map((pub, idx) => (
          <div key={idx} className="item-block">
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <strong>Item {idx + 1}</strong>
              <div>
                <button
                  type=" button"
                  onClick={() => removeItem("publications", idx)}
                  className="mini-btn danger"
                  style={{ marginRight: "5px" }}
                >
                  Remove
                </button>

                {idx === resumeData.publications.length - 1 && (
                  <button
                    type=" button"
                    onClick={() => {
                      if (!visibleSections?.Publications) {
                        setVisibleSections((prev) => ({
                          ...prev,
                          Publications: true,
                        }));
                      }
                      addItem("publications");
                    }}
                    className="mini-btn"
                  >
                    +Add
                  </button>
                )}
              </div>
            </div>

            <div className="grid-2-cols">
              <input
                type="text"
                name="publicationName"
                value={pub.publicationName}
                onChange={(e) => handleChange(e, "publications", idx)}
                className="text-input"
                placeholder="Publication Name"
              />
              <input
                type="text"
                name="publicationPublisher"
                value={pub.publicationPublisher}
                onChange={(e) => handleChange(e, "publications", idx)}
                className="text-input"
                placeholder="Publisher"
              />
            </div>

            <div className="grid-2-cols">
              <input
                type="text"
                name="publicationDate"
                value={pub.publicationDate}
                onChange={(e) => handleChange(e, "publications", idx)}
                className="text-input"
                placeholder="Date / Range"
              />
              <input
                type="text"
                name="publicationWebsite"
                value={pub.publicationWebsite}
                onChange={(e) => handleChange(e, "publications", idx)}
                className="text-input"
                placeholder="Website"
              />
            </div>

            <label className="input-group">
              <span className="input-label">Summary</span>
              <textarea
                name="publicationSummary"
                value={pub.publicationSummary}
                onChange={(e) => handleChange(e, "publications", idx)}
                className="text-input"
                rows="2"
                placeholder="Brief description..."
              />
            </label>
            <button
              className="remove-section"
              type="button"
              style={{
                backgroundColor: "#404c7dff",
                width: "100%",
                border: "none",
                height: "25px",
                color: "white",
                marginBottom: "30px",
                marginTop: "10px",
                borderRadius: "8px",
              }}
              onClick={() => {
                setVisibleSections((prev) => ({
                  ...prev,
                  Publications: false,
                }));
              }}
            >
              Remove Section from resume
            </button>
          </div>
        ))}

        {/* VOLUNTEERING */}
        <h3 className="section-title">
          <EditableTitle
            value={sectionTitles.Volunteering}
            onChange={(val) =>
              setSectionTitles((prev) => ({ ...prev, Volunteering: val }))
            }
          />
        </h3>
        {resumeData.volunteering.map((vol, idx) => (
          <div key={idx} className="item-block">
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <strong>Item {idx + 1}</strong>
              <div>
                <button
                  type=" button"
                  onClick={() => removeItem("volunteering", idx)}
                  className="mini-btn danger"
                  style={{ marginRight: "5px" }}
                >
                  Remove
                </button>

                {idx === resumeData.volunteering.length - 1 && (
                  <button
                    type=" button"
                    onClick={() => {
                      if (!visibleSections?.Volunteering) {
                        setVisibleSections((prev) => ({
                          ...prev,
                          Volunteering: true,
                        }));
                      }
                      addItem("volunteering");
                    }}
                    className="mini-btn"
                  >
                    +Add
                  </button>
                )}
              </div>
            </div>

            <div className="grid-2-cols">
              <input
                type="text"
                name="volOrg"
                value={vol.volOrg}
                onChange={(e) => handleChange(e, "volunteering", idx)}
                className="text-input"
                placeholder="Organization"
              />
              <input
                type="text"
                name="volPosition"
                value={vol.volPosition}
                onChange={(e) => handleChange(e, "volunteering", idx)}
                className="text-input"
                placeholder="Position"
              />
            </div>

            <div className="grid-2-cols">
              <input
                type="text"
                name="volDate"
                value={vol.volDate}
                onChange={(e) => handleChange(e, "volunteering", idx)}
                className="text-input"
                placeholder="Date / Range"
              />
              <input
                type="text"
                name="volLocation"
                value={vol.volLocation}
                onChange={(e) => handleChange(e, "volunteering", idx)}
                className="text-input"
                placeholder="Location"
              />
            </div>

            <label className="input-group">
              <span className="input-label">Summary</span>
              <textarea
                name="volSummary"
                value={vol.volSummary}
                onChange={(e) => handleChange(e, "volunteering", idx)}
                className="text-input"
                rows="2"
                placeholder="Brief description..."
              />
            </label>
            <button
              className="remove-section"
              type="button"
              style={{
                backgroundColor: "#404c7dff",
                width: "100%",
                border: "none",
                height: "25px",
                color: "white",
                marginBottom: "30px",
                marginTop: "10px",
                borderRadius: "8px",
              }}
              onClick={() => {
                setVisibleSections((prev) => ({
                  ...prev,
                  Volunteering: false,
                }));
              }}
            >
              Remove Section from resume
            </button>
          </div>
        ))}

        {/* REFERENCES */}
        <h3 className="section-title">
          <EditableTitle
            value={sectionTitles.References}
            onChange={(val) =>
              setSectionTitles((prev) => ({ ...prev, References: val }))
            }
          />
        </h3>
        {resumeData.references.map((r, idx) => (
          <div key={idx} className="item-block">
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <strong>Item {idx + 1}</strong>
              <div>
                <button
                  type=" button"
                  onClick={() => removeItem("references", idx)}
                  className="mini-btn danger"
                  style={{ marginRight: "5px" }}
                >
                  Remove
                </button>

                {idx === resumeData.references.length - 1 && (
                  <button
                    type=" button"
                    onClick={() => {
                      if (!visibleSections?.References) {
                        setVisibleSections((prev) => ({
                          ...prev,
                          References: true,
                        }));
                      }
                      addItem("references");
                    }}
                    className="mini-btn"
                  >
                    +Add
                  </button>
                )}
              </div>
            </div>

            <div className="grid-2-cols">
              <input
                type="text"
                name="refName"
                value={r.refName}
                onChange={(e) => handleChange(e, "references", idx)}
                className="text-input"
                placeholder="Name"
              />
              <input
                type="text"
                name="refDescription"
                value={r.refDescription}
                onChange={(e) => handleChange(e, "references", idx)}
                className="text-input"
                placeholder="Description"
              />
            </div>

            <label className="input-group">
              <span className="input-label">Summary</span>
              <textarea
                name="refSummary"
                value={r.refSummary}
                onChange={(e) => handleChange(e, "references", idx)}
                className="text-input"
                rows="2"
                placeholder="Brief description..."
              />
            </label>
            <button
              className="remove-section"
              type="button"
              style={{
                backgroundColor: "#404c7dff",
                width: "100%",
                border: "none",
                height: "25px",
                color: "white",
                marginBottom: "30px",
                marginTop: "10px",
                borderRadius: "8px",
              }}
              onClick={() => {
                setVisibleSections((prev) => ({
                  ...prev,
                  References: false,
                }));
              }}
            >
              Remove Section from resume
            </button>
          </div>
        ))}

        {/* AI PROMPT BOX */}
        <PromptBox
          value={promptValue}
          onChange={onPromptChange}
          onSubmit={onPromptSubmit}
          errorMessage={pipelineError}
          disabled={pipelineState === "submitting" || pipelineState === "generating"}
        />

        {/* Clarification Panel - shown when backend needs more info */}
        {pipelineState === "needs_clarification" && (
          <ClarificationPanel
            questions={clarificationQuestions}
            answers={clarificationAnswers}
            onAnswerChange={onClarificationAnswerChange}
            onSubmit={onClarificationSubmit}
            disabled={pipelineState === "submitting" || pipelineState === "generating"}
          />
        )}
      </div>
    </div>
  );
};

export default LeftPanel;
