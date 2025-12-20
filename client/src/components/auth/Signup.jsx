import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import gymBg from "../../assets/gym-bg.png";


const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gymName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/signup`,
        formData
      );

      // ✅ READ TOKEN FROM HEADER
      const token = res.headers["x-auth-token"];

      // ✅ SAVE TOKEN
      localStorage.setItem("token", token);

      // ✅ REDIRECT
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          err.response?.data?.errors?.[0]?.msg ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={onSubmit} style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={onChange}
          required
          style={styles.input}
        />

       

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={onChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={onChange}
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

       <div style={{ marginTop: "auto", textAlign: "center" }}>
  <span style={{ fontSize: "14px" }}>
    Already have an account?{" "}
    <Link to="/login" style={{ color: "#a855f7" }}>
      Login
    </Link>
  </span>
</div>

      </form>
    </div>
  );
};

const styles = {
 wrapper: {
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",

  backgroundImage: `
    linear-gradient(
      rgba(75, 20, 20, 0.75),
      rgba(2, 1, 1, 1)
    ),
    url(${gymBg})
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
},

  card: {
  width: "100%",
  maxWidth: "420px",
  minHeight: "520px",
  padding: "40px 32px",
  borderRadius: "16px",

  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",

  background: "rgba(15,15,15,0.92)",
  backdropFilter: "blur(6px)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
  color: "#fff",
},

  title: {
  textAlign: "center",
  marginBottom: "32px", // ✅ pushes inputs down nicely
  fontSize: "24px",
  fontWeight: "600",
},

input: {
  width: "100%",
  padding: "14px",
  marginBottom: "24px", // ✅ more breathing space
  borderRadius: "8px",
  border: "none",
  outline: "none",
  fontSize: "16px",
},

  button: {
    width: "100%",
    padding: "16px",
  background: "linear-gradient(90deg, #4d2b2bff, #281818ff)",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "10px",
  },
  footer: {
    textAlign: "center",
    marginTop: "15px",
  },
};

export default Signup;
