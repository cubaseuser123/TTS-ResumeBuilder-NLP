import React from "react";
import "./css/template8.css";
import maleAvatar from "../avatars/male.png";
import femaleAvatar from "../avatars/female.png";

// Render stars for skills & languages
const renderStars = (level) => {
  const num = parseInt(level) || 0;
  return "★".repeat(num) + "☆".repeat(5 - num);
};

// Universal section renderer preserving all CSS classes and structure
const renderSection = (sectionName, data, getProfileImage, sectionTitles) => {
  switch (sectionName) {
    case "NameHeadline":
      return (
        <div className="t8-name-block">
          <h1>{data.fullName}</h1>
          <h2>{data.headline}</h2>
        </div>
      );

    case "Contact":
      return (
        <div className="t8-section">
          {/*<h3>Contact</h3>*/}
          <ul>
            <li>{data.phone}</li>
            <li>{data.email}</li>
            <li>{data.location}</li>
            <li>{data.website}</li>
          </ul>
        </div>
      );

    case "Summary":
      return (
        <div className="t8-section-title" data-section-title>
          <h3>Summary</h3>
          <p>{data.summary}</p>
        </div>
      );

    case "HeaderBg":
      return <div className="t8-header-bg" />;

    case "Photo":
      return (
        <div className="t8-photo-wrapper">
          {getProfileImage() && (
            <img src={getProfileImage()} alt="profile" className="t1-photo" />
          )}
        </div>
      );
    case "Profile":
      return (
        <div className="t8-section">
          <h3 className="t8-section-title" data-section-title>
            {sectionTitles.Profile || "Profile"}
          </h3>
          <div className="t8-side-block">
            {data.profile?.map((profile, i) => (
              <div key={i} className="t8-profile-item">
                <p className="t8-profile-inst">
                  Network:{profile.profileNetwork}
                </p>
                <p className="t8-profile-degree">
                  Username:{profile.profileUsername}
                </p>
                <p className="t8-profile-degree">
                  Score:{profile.profileWebsite}
                </p>
              </div>
            ))}
          </div>
        </div>
      );

    case "Skills":
      return (
        <div className="t8-section">
          <h3 className="t8-section-title" data-section-title>
            {sectionTitles.Skills || "Skills"}
          </h3>
          <ul>
            {data.skills?.map((skill, i) => (
              <li key={i}>
                {i + 1}.{skill.skillName} – {skill.skillDescription}
                {skill.skillKeyword}
                <span className="stars"> {renderStars(skill.skillLevel)}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "Languages":
      return (
        <div className="t8-section">
          <h3 className="t8-section-title" data-section-title>
            {sectionTitles.Languages || "Languages"}
          </h3>
          <ul className="t8-skill-list">
            {data.languages?.map((lang, i) => (
              <li key={i}>
                {lang.langName}-{lang.langDescription}
                <span className="stars">{renderStars(lang.langLevel)}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "Interests":
      return (
        <div className="t8-section">
          <h3 className="t8-section-title" data-section-title>
            {sectionTitles.Interests || "Interests"}
          </h3>
          <ul className="t8-interest-list">
            {data.interests?.map((it, i) => (
              <li key={i}>{it.interestName}</li>
            ))}
          </ul>
        </div>
      );

    case "Education":
      return (
        <div className="t8-block">
          <h3 className="t8-section-title" data-section-title>
            {sectionTitles.Education || "Education"}
          </h3>
          {data.education?.map((edu, i) => (
            <div key={i} className="t8-item">
              <h4>{edu.eduType}</h4>
              <span className="t8-muted">
                {edu.eduInstitute}-{edu.eduScore}({edu.eduDate})
              </span>
            </div>
          ))}
        </div>
      );

    case "Experience":
      return (
        <div className="t8-block">
          <h3 className="t8-section-title" data-section-title>
            {sectionTitles.Experience || "Experience"}
          </h3>
          {data.experience?.map((exp, i) => (
            <div key={i} className="t8-item">
              <span className="t8-muted">
                {exp.expCompany}-{exp.expPosition}-{exp.expDate}
              </span>
              <p className="t8-exp-loc">{exp.expLocation}</p>
              <p>{exp.expSummary}</p>
            </div>
          ))}
        </div>
      );

    case "Awards":
      return (
        <div className="t8-block">
          <h3 className="t8-section-title" data-section-title>
            {sectionTitles.Awards || "Awards"}
          </h3>
          {data.awards?.map((a, i) => (
            <div key={i}>
              <strong>{a.awardTitle}</strong>
              <p>{a.awardDate}</p>
              <p>{a.awardSummary}</p>
            </div>
          ))}
        </div>
      );

    case "Certificates":
      return (
        <div className="t8-block">
          <h3 className="t8-section-title" data-section-title>
            {sectionTitles.Certificates || "Certificates"}
          </h3>
          {data.certificates?.map((c, i) => (
            <div key={i}>
              <strong>{c.certName} </strong>-{c.certIssuer}.{c.certDate}
            </div>
          ))}
        </div>
      );

    case "Projects":
      return (
        <div className="t8-block">
          <h3 className="t8-section-title" data-section-title>
            {sectionTitles.Projects || "Projects"}
          </h3>
          {data.projects?.map((p, i) => (
            <div key={i}>
              <strong>
                {p.projectName}-{p.projectWebsite}
              </strong>
              <p>{p.projectDescription}</p>
              <p>{p.projectSummary}</p>
            </div>
          ))}
        </div>
      );

    case "Publications":
      return (
        <div className="t8-block">
          <h3 className="t8-section-title" data-section-title>
            {sectionTitles.Publications || "Publications"}
          </h3>
          {data.publications?.map((pub, i) => (
            <div key={i}>
              <strong>{pub.publicationName}</strong>-{pub.publicationPublisher}.
              {pub.publicationDate}
              <p>{pub.publicationWebsite}</p>
              <p>{pub.publicationSummary}</p>
            </div>
          ))}
        </div>
      );

    case "Volunteering":
      return (
        <div className="t8-block">
          <h3 className="t8-section-title" data-section-title>
            {sectionTitles.Volunteering || "Volunteering"}
          </h3>
          {data.volunteering?.map((v, i) => (
            <div key={i}>
              <strong>{v.volOrg}:</strong>
              {v.volPosition}-{v.volDate}
              <p>{v.volLocation}</p>
              <p>{v.volSummary}</p>
            </div>
          ))}
        </div>
      );

    case "References":
      return (
        <div className="t8-block">
          <h3 className="t8-section-title" data-section-title>
            {sectionTitles.References || "References"}
          </h3>
          {data.references?.map((r, i) => (
            <div key={i} className="t8-ref">
              <h4>{r.refName}</h4>
              <p>{r.refDescription}</p>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
};

// Template8 component using Template1-style layout
const Template8 = ({
  data,
  pageType,
  layout = { left: [], right: [] },
  visibleSections = {},
  profileImageType,
  profilePhoto,
  sectionTitles = {},
}) => {
  const getProfileImage = () => {
    if (profileImageType === "photo" && profilePhoto) return profilePhoto;
    if (profileImageType === "male") return maleAvatar;
    if (profileImageType === "female") return femaleAvatar;
    return null;
  };
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
    <div className="t8-wrapper" style={pageStyle}>
      {/* LEFT PANEL */}
      <aside className="t8-left">
        {layout.left.map((sectionName) => (
          <div key={sectionName}>
            {" "}
            {visibleSections[sectionName] !== false &&
              renderSection(sectionName, data, getProfileImage, sectionTitles)}
          </div>
        ))}
      </aside>

      {/* RIGHT PANEL */}
      <main className="t8-right">
        {renderSection("NameHeadline", data)}
        {renderSection("Contact", data)}
        {layout.right.map((sectionName) => (
          <div key={sectionName}>
            {" "}
            {(!visibleSections || visibleSections[sectionName] !== false) &&
              renderSection(sectionName, data, getProfileImage, sectionTitles)}
          </div>
        ))}
      </main>
    </div>
  );
};

export default Template8;
