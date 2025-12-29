import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth/authContext";
import AlertContext from "../../context/alert/alertContext";
import Alert from "@mui/material/Alert";
import gymBg from "../../assets/gym-bg.png";

const Login = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

const { login, error, clearErrors, isAuthenticated, user } = authContext;


  const { setAlert, alerts } = alertContext;

  const navigate = useNavigate();

  useEffect(() => {
  if (isAuthenticated && user) {
  navigate("/app");
}


    if (error) {
      setAlert(error, "error");
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, user]);

const [loginForm, setLoginForm] = useState({
  email: "",
  password: "",
});


  const { email, password } = loginForm;


  const onChange = (e) =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });


  const onSubmit = (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      setAlert("Please fill in all fields", "error");
    } else {
      login({
        email,
        password,
      });
    }
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={onSubmit} style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>

        {alerts.map((alert) => (
          <Alert key={alert.id} severity={alert.type} sx={{ mb: 2 }}>
            {alert.msg}
          </Alert>
        ))}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={onChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={onChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Login
        </button>

        <div style={{ marginTop: "auto", textAlign: "center" }}>
          <span style={{ fontSize: "14px", opacity: 0.85 }}>
            Contact administrator for account access
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
    marginBottom: "32px",
    fontSize: "24px",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    padding: "20px",
    marginBottom: "24px",
    borderRadius: "16px",
    border: "none",
    outline: "none",
    fontSize: "20px",
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(90deg, #4d2b2bff, #281818ff)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Login;
