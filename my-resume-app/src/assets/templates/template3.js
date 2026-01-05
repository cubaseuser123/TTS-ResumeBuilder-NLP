import React from "react";
import "./css/template3.css";

const renderSection = (sectionName, data, sectionTitles) => {
  if (sectionName === "Photo") return null;
  switch (sectionName) {
    case "Profile":
      return (
        <>
          <h3 className="t3-section-title" data-section-title>
            {sectionTitles.Profile || "Profile"}
          </h3>
          {data.profile.map((p, i) => (
            <div key={i}>
              <p>{p.profileNetwork}</p>
              <p>{p.profileUsername}</p>
              <p>{p.profileWebsite}</p>
            </div>
          ))}
        </>
      );

    case "Summary":
      return (
        <>
          <h3 className="t3-section-title" data-section-title>
            Summary
          </h3>
          <p>{data.summary}</p>
        </>
      );

    case "Experience":
      return (
        <>
          <h3 className="t3-section-title" data-section-title>
            {sectionTitles.Experience || "Experience"}
          </h3>
          {data.experience.map((exp, i) => (
            <div key={i}>
              <strong>{exp.expPosition}</strong>
              <p>
                {exp.expCompany} | {exp.expDate}
              </p>
              <p>{exp.expLocation}</p>
              <p>{exp.expSummary}</p>
            </div>
          ))}
        </>
      );

    case "Education":
      return (
        <>
          <h3 className="t3-section-title" data-section-title>
            {sectionTitles.Education || "Education"}
          </h3>
          {data.education.map((edu, i) => (
            <div key={i}>
              {edu.eduInstitute}-{edu.eduType}
              <p>
                {edu.eduScore}-{edu.eduDate}
              </p>
            </div>
          ))}
        </>
      );

    case "Skills":
      return (
        <>
          <h3 className="t3-section-title" data-section-title>
            {sectionTitles.Skills || "Skills"}
          </h3>
          {data.skills.map((skill, i) => (
            <div key={i} className="t3-language-item">
              <div>
                {skill.skillName} –{skill.skillDescription}.{skill.skillKeyword}
              </div>
              <span className="stars">{renderStars(skill.skillLevel)}</span>
            </div>
          ))}
        </>
      );

    case "Languages":
      return (
        <>
          <h3 className="t3-section-title" data-section-title>
            {sectionTitles.Languages || "Languages"}
          </h3>
          {data.languages?.map((lang, i) => (
            <div key={i}>
              {lang.langName}-{lang.langDescription}
              <p>
                <span className="stars">{renderStars(lang.langLevel)}</span>
              </p>
            </div>
          ))}
        </>
      );

    case "Interests":
      return (
        <>
          <h3 className="t3-section-title" data-section-title>
            {sectionTitles.Interests || "Interests"}
          </h3>
          {data.interests.map((it, i) => (
            <div key={i}>{it.interestName}</div>
          ))}
        </>
      );

    case "Certificates":
      return (
        <>
          <h3 className="t3-section-title" data-section-title>
            {sectionTitles.Certificates || "Certificates"}
          </h3>
          {data.certificates.map((c, i) => (
            <div key={i}>
              {c.certName} - {c.certIssuer} ({c.certDate})
            </div>
          ))}
        </>
      );

    case "Awards":
      return (
        <>
          <h3 className="t3-section-title" data-section-title>
            {sectionTitles.Awards || "Awards"}
          </h3>
          {data.awards.map((a, i) => (
            <div key={i}>
              {a.awardTitle}
              {a.awardDate}
              <p>{a.awardSummary}</p>
            </div>
          ))}
        </>
      );

    case "Projects":
      return (
        <>
          <h3 className="t3-section-title" data-section-title>
            {sectionTitles.Projects || "Projects"}
          </h3>
          {data.projects.map((p, i) => (
            <div key={i}>
              {p.projectName}.{p.projectWebsite}
              <p>{p.projectDescription}</p>
              <p>{p.projectSummary}</p>
            </div>
          ))}
        </>
      );

    case "Publications":
      return (
        <>
          <h3 className="t3-section-title" data-section-title>
            {sectionTitles.Publications || "Publications"}
          </h3>
          {data.publications.map((pub, i) => (
            <div key={i}>
              {" "}
              <strong>{pub.publicationName}</strong>-{pub.publicationPublisher}.
              {pub.publicationDate}
              <p>{pub.publicationWebsite}</p>
              <p>{pub.publicationSummary}</p>
            </div>
          ))}
        </>
      );

    case "Volunteering":
      return (
        <>
          <h3 className="t3-section-title" data-section-title>
            {sectionTitles.Volunteering || "Volunteering"}
          </h3>
          {data.volunteering.map((v, i) => (
            <div key={i}>
              <strong>{v.volOrg}</strong> – {v.volPosition}-{v.volDate}
              <p>{v.volLocation}</p>
              <p>{v.volSummary}</p>
            </div>
          ))}
        </>
      );

    case "References":
      return (
        <>
          <h3 className="t3-section-title" data-section-title>
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

    default:
      return null;
  }
};
// DO NOT TOUCH
const renderStars = (level) => {
  const num = parseInt(level) || 0;
  return "★".repeat(num) + "☆".repeat(5 - num);
};
const Template3 = ({
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
    <div className="t3-wrapper" style={pageStyle}>
      {/* LEFT COLUMN — DYNAMIC */}
      <aside className="t3-left">
        {/* NAME ALWAYS FIXED */}
        <div className="main-heading">
          <h1 className="t3-name">{data.fullName}</h1>
          <p className="t3-role">{data.headline}</p>
          <div className="t3-contact-row">
            <div>{data.phone}</div>
            <div>{data.email}</div>
            <div>{data.website}</div>
            <div>{data.location}</div>
          </div>
        </div>

        <div className="t3-divider"></div>

        {/* Render dynamic left */}
        {layout.left.map((sectionName) => (
          <div key={sectionName} className="t3-section-block">
            {visibleSections?.[sectionName] !== false &&
              renderSection(sectionName, data, sectionTitles)}
          </div>
        ))}
      </aside>

      {/* RIGHT COLUMN — DYNAMIC */}
      <main className="t3-right">
        {layout.right.map((sectionName) => (
          <div key={sectionName} className="t3-section-block">
            {" "}
            {visibleSections?.[sectionName] !== false &&
              renderSection(sectionName, data, sectionTitles)}
          </div>
        ))}
      </main>
    </div>
  );
};

export default Template3;
