import React from "react";
import { Link } from "react-router-dom";
import gymBg from "../../assets/gym-bg.png";

const Landing = () => {
  return (
    <div style={styles.page} className="landing-page">
      <div className="landing-animated-bg">
        <div className="landing-blob landing-blob1" />
        <div className="landing-blob landing-blob2" />
        <div className="landing-blob landing-blob3" />
      </div>
      {/* ================= HEADER ================= */}
      <header style={styles.header}>
        <h2 style={styles.logo}>Gym CRM</h2>
        <div>
          <Link to="/login" style={styles.linkBtn}>
            Login
          </Link>
          <Link to="/signup" style={styles.primaryBtn}>
            Sign Up
          </Link>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay}>
          <h1 style={styles.heroTitle}>
            Manage Your Gym <br /> Smarter & Faster
          </h1>
          <p style={styles.heroText}>
            One platform to manage members, payments, staff & growth.
          </p>

          <div>
            <Link to="/signup" style={styles.primaryBtnLarge}>
              Get Started
            </Link>
            <Link to="/login" style={styles.secondaryBtnLarge}>
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Why Choose Gym CRM?</h2>

        <div style={styles.features}>
          <div style={styles.card}>
            <h3>Member Management</h3>
            <p>Track members, plans, renewals and attendance easily.</p>
          </div>

          <div style={styles.card}>
            <h3>Payments & Revenue</h3>
            <p>Monitor payments, dues, income and financial reports.</p>
          </div>

          <div style={styles.card}>
            <h3>Staff & Trainers</h3>
            <p>Manage staff roles, schedules and trainer assignments.</p>
          </div>
        </div>
      </section>

      {/* ================= REVIEWS ================= */}
      <section style={styles.darkSection}>
        <h2 style={styles.sectionTitleLight}>What Our Clients Say</h2>

        <div style={styles.reviews}>
          <div style={styles.reviewCard}>
            <p>
              “This CRM completely changed how we manage our gym. Super easy!”
            </p>
            <strong>— Kalart Gym</strong>
          </div>

          <div style={styles.reviewCard}>
            <p>
              “Payments, attendance, reports — everything in one place.”
            </p>
            <strong>— FitZone</strong>
          </div>

          <div style={styles.reviewCard}>
            <p>
              “Best decision we made for our gym business.”
            </p>
            <strong>— PowerHouse</strong>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} Gym CRM. All rights reserved.</p>
        <div>
          <Link to="/login" style={styles.footerLink}>
            Login
          </Link>
          <Link to="/signup" style={styles.footerLink}>
            Sign Up
          </Link>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  page: {
    fontFamily: "sans-serif",
    color: "#fff",
  },

  /* Header */
  header: {
    position: "fixed",
    top: 0,
    width: "100%",
    padding: "16px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(29, 17, 17, 0.6)",
    backdropFilter: "blur(8px)",
    zIndex: 10,
  },

  logo: {
    margin: 0,
    fontWeight: "700",
  },

  linkBtn: {
    color: "#fff",
    marginRight: "16px",
    textDecoration: "none",
    fontWeight: "500",
  },

  primaryBtn: {
    background: "#572626ff",
    padding: "8px 16px",
    borderRadius: "6px",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "600",
  },

  /* Hero */
  hero: {
    height: "100vh",
    backgroundImage: `
      linear-gradient(rgba(93, 19, 19, 0.7), rgba(5, 1, 1, 0.7)),
      url(${gymBg})
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "20px",
  },

  heroOverlay: {
    maxWidth: "800px",
  },

  heroTitle: {
    fontSize: "48px",
    marginBottom: "16px",
  },

  heroText: {
    fontSize: "18px",
    marginBottom: "32px",
    opacity: 0.9,
  },

  primaryBtnLarge: {
    background: "#572626ff",
    padding: "14px 28px",
    borderRadius: "8px",
    color: "#fff",
    textDecoration: "none",
    marginRight: "16px",
    fontWeight: "600",
  },

  secondaryBtnLarge: {
    border: "2px solid #fff",
    padding: "14px 28px",
    borderRadius: "8px",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "600",
  },

  /* Sections */
  section: {
  padding: "30px 20px 20px",

    textAlign: "center",
    background: "linear-gradient(90deg, #281818ff, #4d2b2bff, #281818ff)",
  },

  darkSection: {
    padding: "10px 20px",
    textAlign: "center",
    background: "linear-gradient(90deg, #281818ff, #4d2b2bff, #281818ff)",
  },

  sectionTitle: {
    fontSize: "32px",
    marginBottom: "48px",
    color: "#fff",
  },

  sectionTitleLight: {
    fontSize: "32px",
    marginBottom: "48px",
    color: "#fff",
  },

  features: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  card: {
    background: "#1c0707ff",
    padding: "32px",
    borderRadius: "12px",
    width: "280px",
  },

  reviews: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  reviewCard: {
    background: "#1c0707ff",
    padding: "32px",
    borderRadius: "12px",
    width: "280px",
    fontStyle: "italic",
  },

  footer: {
    background: "#000",
    padding: "10px 10px",
    textAlign: "center",
  },

  footerLink: {
    color: "#3a1515ff",
    margin: "0 10px",
    textDecoration: "none",
  },
};

export default Landing;
