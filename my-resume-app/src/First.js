import React, { useState, useRef, useEffect } from "react";
import "./First.css";
import { useNavigate } from "react-router-dom";
import ttsLogo from "./tts.png";

export default function First() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [activePage, setActivePage] = useState("resumes");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [activeResumeId, setActiveResumeId] = useState(null);
  const [showResumeMenu, setShowResumeMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const fileInputRef = useRef();
  const resumeMenuRef = useRef(null);

  const jobTitles = [
    "Software Developer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "React Developer",
    "Angular Developer",
    "Node.js Developer",
    "Java Developer",
    "Python Developer",
    "PHP Developer",
    ".NET Developer",
    "Android Developer",
    "iOS Developer",
    "Mobile App Developer",
    "DevOps Engineer",
    "Cloud Engineer",
    "AWS Engineer",
    "Azure Engineer",
    "Google Cloud Engineer",
    "UI/UX Designer",
    "Web Designer",
    "Web Developer",
    "Database Administrator",
    "Data Analyst",
    "Data Scientist",
    "AI Engineer",
    "Machine Learning Engineer",
    "Cybersecurity Analyst",
    "Network Engineer",
    "System Administrator",
    "IT Support Engineer",
    "Test Engineer",
    "QA Engineer",
    "Automation Tester",
    "Blockchain Developer",
    "Game Developer",
    "Software Architect",
    "Product Manager",
    "Scrum Master",
    "IAS Officer",
    "IPS Officer",
    "IFS Officer",
    "IRS Officer",
    "State PCS Officer",
    "Talathi / Patwari",
    "Gram Sevak",
    "Police Sub-Inspector (PSI)",
    "Police Constable",
    "Clerk (SSC/MPSC)",
    "RBI Grade B Officer",
    "Bank PO",
    "Bank Clerk",
    "Railway TT",
    "Railway JE",
    "Railway Station Master",
    "Defence – Army Soldier",
    "Air Force Technician",
    "Navy Sailor",
    "SSC GD",
    "ITI Technician (Govt)",
    "Teacher (Government School)",
    "Assistant Professor (Govt College)",
    "Financial Analyst",
    "Investment Banker",
    "Accountant",
    "Chartered Accountant",
    "Cost Accountant",
    "Loan Officer",
    "Insurance Sales Officer",
    "Branch Manager",
    "Finance Manager",
    "Tax Consultant",
    "Audit Manager",
    "HR Executive",
    "HR Manager",
    "Recruiter",
    "Talent Acquisition Specialist",
    "Sales Executive",
    "Sales Manager",
    "Marketing Executive",
    "Digital Marketing Specialist",
    "SEO Specialist",
    "Business Analyst",
    "Business Development Executive",
    "Operations Manager",
    "Admin Executive",
    "Customer Support",
    "Call Center Executive",
    "Relationship Manager",
  ];
  const [resumes, setResumes] = useState(() => {
    const saved = localStorage.getItem("resumes");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: Date.now(),
            title: "frontenddeveloper",
            updated: "just now",
            img: "/images/resume1.jpg",
          },
        ];
  });

  // SETTINGS
  const [profile, setProfile] = useState({
    pictureUrl: "",
    name: "",
    username: "",
    email: "",
    theme: "system",
    language: "en-US",
    currentPassword: "",
    newPassword: "",
  });

  const updateProfile = (k, v) => setProfile((prev) => ({ ...prev, [k]: v }));

  // ADD — APPLY THEME TO BODY
  useEffect(() => {
    const body = document.body;

    // remove previous theme classes
    body.classList.remove("theme-light", "theme-dark");

    if (profile.theme === "light") {
      body.classList.add("theme-light");
    } else if (profile.theme === "dark") {
      body.classList.add("theme-dark");
    } else {
      // system theme
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      body.classList.add(prefersDark ? "theme-dark" : "theme-light");
    }
  }, [profile.theme]);

  // CUSTOM CURSOR STATE
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(true);

  // TRACK MOUSE MOVEMENT
  useEffect(() => {
    const move = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const handleCreateResume = () => {
    if (!title) {
      alert("Please select a title");
      return;
    }

    const newResume = {
      id: Date.now(),
      title: slug || title,
      updated: "just now",
      img: "/images/resume1.jpg",
    };

    setResumes((prev) => [...prev, newResume]);

    setTitle("");
    setSlug("");
    setShowModal(false);
  };

  const handleResumeClick = (e, id) => {
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();

    setMenuPosition({
      x: rect.right + 10,
      y: rect.top,
    });

    setActiveResumeId(id);
    setShowResumeMenu(true);
  };

  const handleOpen = () => {
    const resume = resumes.find((r) => r.id === activeResumeId);
    if (!resume) return;

    // keep your existing logic here 👆

    // ✅ then navigate
    navigate("/editor");
  };

  const handleDelete = () => {
    setResumes((prev) => prev.filter((r) => r.id !== activeResumeId));
    setShowResumeMenu(false);
  };

  const handleRename = () => {
    const newName = prompt("Enter new resume name");
    if (!newName) return;

    setResumes((prev) =>
      prev.map((r) => (r.id === activeResumeId ? { ...r, title: newName } : r))
    );

    setShowResumeMenu(false);
  };

  useEffect(() => {
    localStorage.setItem("resumes", JSON.stringify(resumes));
  }, [resumes]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showResumeMenu &&
        resumeMenuRef.current &&
        !resumeMenuRef.current.contains(event.target)
      ) {
        setShowResumeMenu(false);
        setActiveResumeId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showResumeMenu]);

  return (
    <div className="page">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h1 className="logo">
          <img src={ttsLogo} alt="ATSfree logo" />
        </h1>

        <nav className="menu">
          <p
            className={
              activePage === "resumes" ? "menu-item active" : "menu-item"
            }
            onClick={() => setActivePage("resumes")}
          >
            📄 Resumes
          </p>
          <p
            className={
              activePage === "settings" ? "menu-item active" : "menu-item"
            }
            onClick={() => setActivePage("settings")}
          >
            ⚙ Settings
          </p>
        </nav>

        <div
          className="footer-user clickable"
          onClick={() => setShowUserMenu((prev) => !prev)}
        >
          <div className="avatar">H</div>
          <div>
            <strong>Harsh Patil</strong>
          </div>

          {showUserMenu && (
            <div className="user-popup">
              <p
                className="popup-item"
                onClick={() => {
                  setActivePage("settings");
                  setShowUserMenu(false);
                }}
              >
                ⚙ Settings
              </p>
              <p className="popup-item" onClick={() => alert("Logged out!")}>
                🚪 Logout
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        {activePage === "resumes" ? (
          <>
            <header className="header-row">
              <h2 className="title">Resumes</h2>

              <div className="view-buttons">
                <button
                  className={viewMode === "grid" ? "btn active" : "btn"}
                  onClick={() => setViewMode("grid")}
                >
                  🔳 Grid
                </button>

                <button
                  className={viewMode === "list" ? "btn active" : "btn"}
                  onClick={() => setViewMode("list")}
                >
                  📋 List
                </button>
              </div>
            </header>

            <div className={viewMode === "grid" ? "card-row" : "list-view"}>
              <div
                className={viewMode === "grid" ? "card" : "list-card"}
                onClick={() => setShowModal(true)}
              >
                <div className="icon-plus">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="60"
                    height="60"
                    fill="currentColor"
                    className="bi bi-plus-square"
                    viewBox="0 0 16 16"
                  >
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                  </svg>
                </div>
                <div>
                  <p className="card-title">Create a new resume</p>
                  <p className="card-sub">Start building from scratch</p>
                </div>
              </div>

              <div
                className={viewMode === "grid" ? "card" : "list-card"}
                onClick={() => fileInputRef.current.click()}
              >
                <div className="icon-download">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="60"
                    height="60"
                    fill="currentColor"
                    className="bi bi-upload"
                    viewBox="0 0 16 16"
                  >
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
                  </svg>
                </div>
                <div>
                  <p className="card-title">Import an existing resume</p>
                  <p className="card-sub">LinkedIn, JSON Resume, etc.</p>
                </div>
              </div>
              {resumes.map((item) => (
                <div
                  key={item.id}
                  className={
                    viewMode === "grid" ? "resume-card" : "list-resume-card"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResumeClick(e, item.id);
                  }}
                >
                  <img
                    src={item.img}
                    alt="resume"
                    className={
                      viewMode === "grid" ? "resume-img" : "list-resume-img"
                    }
                  />
                  <div>
                    <p className="resume-title">{item.title}</p>
                    <p className="resume-sub">Last updated {item.updated}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="settings-page">
            <h2 className="title large">Settings</h2>

            {/* Account */}
            <section className="section">
              <h3 className="section-title">Account</h3>
              <p className="muted">
                Here, you can update your account information such as your
                profile picture, name and username.
              </p>

              <div className="form-grid">
                <div className="avatar-large">H</div>
                <div className="col-span-2">
                  <label>Picture</label>
                  <input
                    type="text"
                    className="input"
                    value={profile.pictureUrl}
                    placeholder="Profile Image URL"
                    onChange={(e) =>
                      updateProfile("pictureUrl", e.target.value)
                    }
                  />

                  <div className="row two-columns">
                    <div style={{ marginTop: 8 }}>
                      <label>Name</label>
                      <input
                        className="input"
                        placeholder="Enter Your Name"
                        value={profile.name}
                        onChange={(e) => updateProfile("name", e.target.value)}
                      />
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <label>Username</label>
                      <input
                        className="input"
                        placeholder="Enter User Name"
                        value={profile.username}
                        onChange={(e) =>
                          updateProfile("username", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <label>Email</label>
                    <input
                      className="input"
                      placeholder="Enter Valid Email ID"
                      value={profile.email}
                      onChange={(e) => updateProfile("email", e.target.value)}
                    />
                    <div className="verified">✔ Verified</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Security */}
            <section className="section">
              <h3 className="section-title">Security</h3>
              <p className="muted">
                In this section, you can change your password and enable/disable
                two-factor authentication.
              </p>

              <div className="row two-columns">
                <div>
                  <label>Current Password</label>
                  <input
                    type="password"
                    className="input"
                    placeholder="**********"
                    value={profile.currentPassword}
                    onChange={(e) =>
                      updateProfile("currentPassword", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label>New Password</label>
                  <input
                    type="password"
                    className="input"
                    placeholder="**********"
                    value={profile.newPassword}
                    onChange={(e) =>
                      updateProfile("newPassword", e.target.value)
                    }
                  />
                </div>
              </div>

              <div style={{ marginTop: 18 }}>
                <h4 className="subheading">Two-Factor Authentication</h4>
                <p className="muted">
                  Two-factor authentication is currently disabled. You can
                  enable it by adding an authenticator app to your account.
                </p>
                <button className="btn-outline">Enable 2FA</button>
              </div>
            </section>

            {/* Profile */}
            <section className="section">
              <h3 className="section-title">Profile</h3>
              <p className="muted">
                Here, you can update your profile to customize and personalize
                your experience.
              </p>

              <div className="row two-columns" style={{ marginTop: 12 }}>
                <div>
                  <label>Theme</label>
                  <select
                    className="input"
                    value={profile.theme}
                    onChange={(e) => updateProfile("theme", e.target.value)}
                  >
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                <div>
                  <label>Language</label>
                  <select
                    className="input"
                    value={profile.language}
                    onChange={(e) => updateProfile("language", e.target.value)}
                  >
                    <option value="en-US">English (en-US)</option>
                    <option value="hi-IN">Hindi (hi-IN)</option>
                    <option value="mr-IN">Marathi (mr-IN)</option>
                  </select>
                  <div className="muted small">
                    Don't see your language?{" "}
                    <a className="link">Help translate the app.</a>
                  </div>
                </div>
              </div>
            </section>

            <section className="section">
              <h3 className="section-title">
                OpenAI/Azure OpenAI/Ollama Integration
              </h3>
              <p className="muted">
                You can make use of the OpenAI API, Azure OpenAI, or Ollama to
                help you generate content, or improve your writing while
                composing your resume.
              </p>
              <p className="muted">
                You have the option to{" "}
                <strong>obtain your own OpenAI API key</strong>. This key
                empowers you to leverage the API as you see fit.
              </p>
            </section>
          </div>
        )}
        {showResumeMenu && (
          <div
            ref={resumeMenuRef}
            className="resume-menu"
            style={{
              position: "absolute",
              top: menuPosition.y,
              left: menuPosition.x,
              zIndex: 1000,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="first-container" onClick={handleOpen}>
              Open
            </p>
            <p onClick={handleRename}> Rename</p>
            <p className="danger" onClick={handleDelete}>
              Delete
            </p>
          </div>
        )}
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  fill="currentColor"
                  className="bi bi-plus-square"
                  viewBox="0 0 16 16"
                >
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>{" "}
                Create a new resume
              </h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✖
              </button>
            </div>

            <label>Title</label>

            <select
              className="input"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
              }}
            >
              <option value="">-- Select Title --</option>
              {jobTitles.map((j, i) => (
                <option key={i} value={j}>
                  {j}
                </option>
              ))}
            </select>

            <label>Slug</label>
            <input
              type="text"
              className="input"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />

            <button className="create-btn" onClick={handleCreateResume}>
              Create
            </button>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        className="hidden-file"
        onChange={(e) => {
          if (e.target.files.length > 0) {
            alert("Selected File: " + e.target.files[0].name);
          }
        }}
      />
    </div>
  );
}
