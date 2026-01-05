import React from "react";
import "./css/template5.css";

const renderStars = (level) => {
  const num = parseInt(level) || 0;
  return "★".repeat(num) + "☆".repeat(5 - num);
};

// UNIVERSAL SECTION RENDERER
const renderSection = (sectionName, data, sectionTitles) => {
  switch (sectionName) {
    case "Photo":
      return (
        <div className="t5-photo-wrap">
          <img
            src={data.pictureUrl}
            alt="profile"
            onError={(e) => {
              e.target.src =
                "https://placehold.co/200x200/1e3a8a/ffffff?text=Photo";
            }}
          />
        </div>
      );

    case "Contact":
      return (
        <>
          <h4 className="t5-side-heading">Contact</h4>
          <p>{data.email}</p>
          <p>{data.phone}</p>
          <p>{data.location}</p>
        </>
      );

    case "Profile":
      return (
        <>
          <h4 className="t5-side-heading" data-section-title>
            {sectionTitles.Profile || "Profile"}
          </h4>
          {data.profile.map((p, i) => (
            <div key={i} className="t5-profile-item">
              <p>{p.profileNetwork}</p>
              <p>{p.profileUsername}</p>
              <p>{p.profileWebsite}</p>
            </div>
          ))}
        </>
      );

    case "Skills":
      return (
        <>
          <h4 className="t5-section-title" data-section-title>
            {sectionTitles.Skills || "Skills"}
          </h4>
          <ul className="t5-side-list">
            {data.skills.map((s, i) => (
              <li key={i}>
                {s.skillName}{" "}
                <span className="t5-skill-stars">
                  {renderStars(s.skillLevel)}
                </span>
              </li>
            ))}
          </ul>
        </>
      );

    case "Languages":
      return (
        <>
          <h4 className="t5-section-title" data-section-title>
            {sectionTitles.Languages || "Languages"}
          </h4>
          <ul className="t5-side-list">
            {data.languages.map((l, i) => (
              <li key={i}>
                {l.langName} {l.langDescription && `— ${l.langDescription}`}{" "}
                <span className="t5-skill-stars">
                  {renderStars(l.langLevel)}
                </span>
              </li>
            ))}
          </ul>
        </>
      );

    case "Interests":
      return (
        <>
          <h4 className="t5-section-title" data-section-title>
            {sectionTitles.Interests || "Interests"}
          </h4>
          <ul className="t5-side-list">
            {data.interests.map((it, i) => (
              <li key={i}>{it.interestName}</li>
            ))}
          </ul>
        </>
      );

    case "Experience":
      return (
        <>
          <h3 className="t5-section-title" data-section-title>
            {sectionTitles.Experience || "Experience"}
          </h3>
          {data.experience.map((exp, i) => (
            <div key={i} className="t5-exp">
              <div className="t5-exp-head">
                <strong>{exp.expPosition}</strong>
                <span className="t5-exp-date">{exp.expDate}</span>
              </div>
              <div className="t5-exp-company">
                {exp.expCompany} — {exp.expLocation}
              </div>
              <p className="t5-exp-desc">{exp.expSummary}</p>
            </div>
          ))}
        </>
      );

    case "Education":
      return (
        <>
          <h3 className="t5-section-title" data-section-title>
            {sectionTitles.Education || "Education"}
          </h3>
          {data.education.map((edu, i) => (
            <div key={i} className="t5-edu">
              <div className="t5-edu-head">
                <strong>{edu.eduInstitute}</strong>
                <span className="t5-edu-date">{edu.eduDate}</span>
              </div>
              <div className="t5-edu-degree">
                {edu.eduType} — {edu.eduScore}
              </div>
            </div>
          ))}
        </>
      );

    case "Projects":
      return (
        <>
          <h3 className="t5-section-title" data-section-title>
            {sectionTitles.Projects || "Projects"}
          </h3>
          {data.projects.map((p, i) => (
            <div key={i} className="t5-proj">
              <strong>{p.projectName}</strong>
              <p>{p.projectDescription}</p>
            </div>
          ))}
        </>
      );

    case "Awards":
      return (
        <>
          <h3 className="t5-section-title" data-section-title>
            {sectionTitles.Awards || "Awards"}
          </h3>
          {data.awards.map((a, i) => (
            <div key={i}>
              <strong>{a.awardTitle}</strong> <p>{a.awardSummary}</p>
            </div>
          ))}
        </>
      );

    case "Certificates":
      return (
        <>
          <h3 className="t5-section-title" data-section-title>
            {sectionTitles.Certificates || "Certificates"}
          </h3>
          {data.certificates.map((c, i) => (
            <div key={i}>
              {c.certName} — {c.certIssuer} ({c.certDate})
            </div>
          ))}
        </>
      );

    case "Volunteering":
      return (
        <>
          <h3 className="t5-section-title" data-section-title>
            {sectionTitles.Volunteering || "Volunteering"}
          </h3>
          {data.volunteering.map((v, i) => (
            <div key={i}>
              <strong>{v.volOrg}</strong> — {v.volPosition}
              <p>{v.volSummary}</p>
            </div>
          ))}
        </>
      );

    case "References":
      return (
        <>
          <h3 className="t5-section-title" data-section-title>
            {sectionTitles.References || "References"}
          </h3>
          {data.references.map((r, i) => (
            <div key={i}>
              <strong>{r.refName}</strong>
              <p>{r.refDescription}</p>
            </div>
          ))}
        </>
      );

    case "Summary":
      return (
        <>
          <h3 className="t5-section-title" data-section-title>
            Summary
          </h3>
          <p>{data.summary}</p>
        </>
      );

    default:
      return null;
  }
};

const Template5 = ({
  data,
  pageType,
  layout,
  visibleSections,
  sectionTitles = {},
}) => {
  const pageStyle = {
    width: pageType === "A4" ? "210mm" : "8.5in",
    minHeight: pageType === "A4" ? "297mm" : "11in",
    background: "white",
    boxShadow: "0 0 5px rgba(0,0,0,0.15)",
    margin: "auto",
    boxSizing: "border-box",
    overflow: "visible",
  };

  return (
    <div className="t5-wrapper" style={pageStyle}>
      {/* LEFT BLUE SIDEBAR (dynamic items placed in layout.left) */}
      <aside className="t5-sidebar">
        {layout.left.map((sectionName, i) => (
          <div key={sectionName + "-" + i} className="t5-side-block">
            {" "}
            {visibleSections?.[sectionName] !== false &&
              renderSection(sectionName, data, sectionTitles)}
          </div>
        ))}
      </aside>

      {/* RIGHT MAIN (dynamic items placed in layout.right) */}
      <main className="t5-main">
        {/* Name/header always shown at top of main */}
        <header className="t5-header">
          <h1 className="t5-name">{data.fullName}</h1>
          <p className="t5-role">{data.headline}</p>
        </header>

        <div className="t5-main-content">
          {layout.right.map((sectionName, i) => (
            <div key={sectionName + "-" + i} className="t5-main-block">
              {" "}
              {visibleSections?.[sectionName] !== false &&
                renderSection(sectionName, data, sectionTitles)}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Template5;
