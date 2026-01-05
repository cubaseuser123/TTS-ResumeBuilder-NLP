import React from "react";
import "./css/template7.css";

// Render stars for skills & languages
const renderStars = (level) => {
  const num = parseInt(level) || 0;
  return "★".repeat(num) + "☆".repeat(5 - num);
};

//  Dynamic section renderer
const renderSection = (sectionName, data, sectionTitles) => {
  switch (sectionName) {
    case "Profile":
      return (
        <>
          <h3 className="t7-side-title">
            {" "}
            {sectionTitles.Profile || "Profile"}
          </h3>
          <div className="t7-side-block">
            {data.profile?.map((profile, i) => (
              <div key={i} className="t7-profile-item">
                <p>Network: {profile.profileNetwork}</p>
                <p>Username: {profile.profileUsername}</p>
                <p>Score: {profile.profileWebsite}</p>
                <p>Icon: {profile.profileIcon}</p>
              </div>
            ))}
          </div>
        </>
      );

    case "Summary":
      return (
        <>
          <h2 className="t8-section-title" data-section-title>
            Summary
          </h2>
          <p>{data.summary}</p>
        </>
      );

    case "Education":
      return (
        <>
          <h2 className="t7-section-title" data-section-title>
            {sectionTitles.Education || "Education"}
          </h2>
          {data.education?.map((edu, i) => (
            <div key={i} className="t7-edu-item">
              <strong>{edu.eduInstitute}</strong>
              <p>{edu.eduType}</p>
              <p>{edu.eduScore}</p>
              <span>{edu.eduDate}</span>
            </div>
          ))}
        </>
      );

    case "Skills":
      return (
        <>
          <h2 className="t7-section-title" data-section-title>
            {sectionTitles.Skills || "Skills"}
          </h2>
          <ul className="t7-skill-list">
            {data.skills?.map((skill, i) => (
              <li key={i}>
                {i + 1}. {skill.skillName} – {skill.skillDescription}
                {skill.skillKeyword} Level:{" "}
                <span className="stars">{renderStars(skill.skillLevel)}</span>
              </li>
            ))}
          </ul>
        </>
      );

    case "Experience":
      return (
        <>
          <h2 className="t7-section-title" data-section-title>
            {sectionTitles.Experience || "Experience"}
          </h2>
          {data.experience?.map((exp, i) => (
            <div key={i} className="t7-exp-item">
              <p className="t7-exp-company">
                {exp.expCompany} | {exp.expDate}
              </p>
              <p className="t7-exp-pos">{exp.expPosition}</p>
              <p className="t7-exp-loc">{exp.expLocation}</p>
              <p className="t7-exp-desc">{exp.expSummary}</p>
            </div>
          ))}
        </>
      );

    case "Languages":
      return (
        <>
          <h3 className="t7-section-title" data-section-title>
            {sectionTitles.Languages || "Languages"}
          </h3>
          <ul className="t7-skill-list">
            {data.languages?.map((lang, i) => (
              <li key={i}>
                {lang.langName} –{" "}
                <span className="stars">{renderStars(lang.langLevel)}</span>
              </li>
            ))}
          </ul>
        </>
      );

    case "Interests":
      return (
        <>
          <h3 className="t7-section-title" data-section-title>
            {sectionTitles.Interests || "Interests"}
          </h3>
          <ul className="t7-interest-list">
            {data.interests?.map((it, i) => (
              <li key={i}>{it.interestName}</li>
            ))}
          </ul>
        </>
      );

    case "Awards":
      return (
        <>
          <h3 className="t7-section-title" data-section-title>
            {sectionTitles.Awards || "Awards"}
          </h3>
          {data.awards?.map((a, i) => (
            <div key={i}>
              <strong>{a.awardTitle}</strong>
              <p>{a.awardDate}</p>
              <p>{a.awardSummary}</p>
            </div>
          ))}
        </>
      );

    case "Certificates":
      return (
        <>
          <h3 className="t7-section-title" data-section-title>
            {sectionTitles.Certificates || "Certificates"}
          </h3>
          {data.certificates?.map((c, i) => (
            <div key={i}>
              <strong>{c.certName}</strong> – {c.certIssuer} ({c.certDate})
            </div>
          ))}
        </>
      );

    case "Projects":
      return (
        <>
          <h3 className="t7-section-title" data-section-title>
            {sectionTitles.Projects || "Projects"}
          </h3>
          {data.projects?.map((p, i) => (
            <div key={i}>
              <strong>
                {p.projectName} – {p.projectWebsite}
              </strong>
              <p>{p.projectDescription}</p>
              <p>{p.projectSummary}</p>
            </div>
          ))}
        </>
      );

    case "Publications":
      return (
        <>
          <h3 className="t7-section-title" data-section-title>
            {sectionTitles.Publications || "Publications"}
          </h3>
          {data.publications?.map((pub, i) => (
            <div key={i}>
              <strong>{pub.publicationName}</strong> –{" "}
              {pub.publicationPublisher} ({pub.publicationDate})
              <p>{pub.publicationWebsite}</p>
              <p>{pub.publicationSummary}</p>
            </div>
          ))}
        </>
      );

    case "Volunteering":
      return (
        <>
          <h3 className="t7-section-title" data-section-title>
            {sectionTitles.Volunteering || "Volunteering"}
          </h3>
          {data.volunteering?.map((v, i) => (
            <div key={i}>
              <strong>{v.volOrg}</strong> – {v.volPosition} ({v.volDate})
              <p>{v.volLocation}</p>
              <p>{v.volSummary}</p>
            </div>
          ))}
        </>
      );

    default:
      return null;
  }
};

// FINAL TEMPLATE7 COMPONENT
const Template7 = ({
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
    <div className="t7-wrapper" style={pageStyle}>
      {/* HEADER */}
      <header className="t7-header">
        <h1>{data.fullName}</h1>
        <p className="t7-role">{data.headline}</p>
        <div className="t7-header-contact">
          <span>{data.phone}</span> • <span>{data.email}</span> •{" "}
          <span>{data.location}</span> • <span>{data.website}</span>
        </div>
      </header>

      <div className="t7-content"></div>
      {[...layout.left, ...layout.right].map((sectionName, i) => (
        <div key={i} className="t4-section-block">
          {visibleSections?.[sectionName] !== false &&
            renderSection(sectionName, data, sectionTitles)}
        </div>
      ))}
    </div>
  );
};

export default Template7;
