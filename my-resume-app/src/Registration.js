import React, { useState } from "react";

export default function App() {
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  // Temporary existing usernames
  const existingUsernames = ["john@123", "test!user", "vaishnavi#007"];

  // LIVE VALIDATION
  const validateField = (name, value) => {
    let message = "";

    if (name === "name") {
      if (!value.trim()) message = "Name is required";
      else if (value.length < 10)
        message = "Name must be at least 10 characters long";
      else if (!/^[A-Za-z ]+$/.test(value))
        message = "Name should contain only alphabets";
    }

    if (name === "username") {
      if (!value.trim()) message = "Username is required";
      else if (!/^[A-Za-z0-9]+$/.test(value))
        message = "Username should contain only letters and numbers";
      else if (existingUsernames.includes(value))
        message = "Username already exists. Choose another one";
    }

    if (name === "email") {
      if (!value.trim()) message = "Email is required";
      else if (!/^\S+@\S+\.\S+$/.test(value))
        message = "Enter a valid email with @";
    }

    if (name === "password") {
      if (!value.trim()) message = "Password is required";
      else if (
        !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(value)
      )
        message =
          "Password must contain alphabets, numbers & special character";
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  // GitHub Login
  const handleGitHubLogin = () => {
    window.location.href = "https://github.com/login";
  };

  // Google Login
  const handleGoogleLogin = () => {
    window.location.href =
      "https://accounts.google.com/o/oauth2/v2/auth?client_id=4736644206-pd74k8lebarup71vg8dcft8verc6qtr.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Frxresu.me%2Fapi%2Fauth%2Fgoogle&response_type=code&scope=openid%20email%20profile&prompt=select_account";
  };

  // FINAL VALIDATION
  const handleSignup = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    else if (form.name.length < 20)
      newErrors.name = "Name must be at least 20 characters long";
    else if (!/^[A-Za-z ]+$/.test(form.name))
      newErrors.name = "Name should contain only alphabets";

    if (!form.username.trim()) newErrors.username = "Username is required";
    else if (!/^[A-Za-z0-9]+$/.test(form.username))
      newErrors.username = "Username should contain only letters and numbers";
    else if (existingUsernames.includes(form.username))
      newErrors.username = "Username already exists. Choose another one";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Enter a valid email with @";

    if (!form.password.trim()) newErrors.password = "Password is required";
    else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(
        form.password
      )
    )
      newErrors.password =
        "Password must contain alphabets, numbers & special character";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert("Your information is saved successfully!");

      setForm({
        name: "",
        username: "",
        email: "",
        password: "",
      });

      setErrors({});
    }
  };

  return (
    <>
      <div style={styles.container} className="container">
        {/* LEFT SIDE */}
        <div style={styles.left} className="left">
          <h2>Create a new account</h2>

          <p style={styles.signinText}>
            Already have an account?{" "}
            <a href="#" style={styles.signinLink}>
              Sign in now
            </a>
          </p>

          {/* NAME */}
          <label style={styles.label}>Name</label>
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <p style={styles.error}>{errors.name}</p>}

          {/* USERNAME */}
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            type="text"
            name="username"
            placeholder="john123"
            autoComplete="off"
            value={form.username}
            onChange={handleChange}
          />
          {errors.username && <p style={styles.error}>{errors.username}</p>}

          {/* EMAIL */}
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="john@example.com"
            autoComplete="off"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p style={styles.error}>{errors.email}</p>}

          {/* PASSWORD */}
          <label style={styles.label}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              style={{ ...styles.input, paddingRight: 20 }}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              autoComplete="off"
              value={form.password}
              onChange={handleChange}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>

          {errors.password && <p style={styles.error}>{errors.password}</p>}

          <button style={styles.signupBtn} onClick={handleSignup}>
            Sign up
          </button>

          <p style={styles.continueText}>or continue with</p>

          <div style={styles.socialButtons}>
            <button style={styles.githubBtn} onClick={handleGitHubLogin}>
              GitHub
            </button>

            <button style={styles.googleBtn} onClick={handleGoogleLogin}>
              Google
            </button>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div style={styles.right} className="right"></div>
      </div>
    </>
  );
}

/* INLINE CSS */
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100%",
    fontFamily: "Arial, sans-serif",
  },

  left: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "40%",
    padding: 50,
  },

  right: {
    width: "60%",
    backgroundImage: "url('/images/resume1.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  signinText: {
    fontSize: 14,
    marginBottom: 25,
  },

  signinLink: {
    color: "#4c72ff",
    textDecoration: "none",
    fontWeight: "bold",
  },

  label: { marginTop: 15, marginBottom: 5, fontSize: 14 },

  input: {
    width: "100%",
    padding: 12,
    border: "1px solid #ccc",
    borderRadius: 6,
    fontSize: 15,
  },

  signupBtn: {
    marginTop: 25,
    padding: 14,
    width: "100%",
    backgroundColor: "black",
    color: "white",
    fontSize: 16,
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },

  continueText: {
    textAlign: "center",
    margin: "20px 0",
    color: "#666",
  },

  socialButtons: {
    display: "flex",
    gap: 10,
  },

  githubBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: "black",
    color: "white",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontSize: 16,
  },

  googleBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: "#4285f4",
    color: "white",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontSize: 16,
  },

  error: {
    color: "red",
    fontSize: 12,
    marginTop: 3,
    marginBottom: 5,
  },

  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 12,
    fontSize: 18,
    cursor: "pointer",
    userSelect: "none",
  },
};
