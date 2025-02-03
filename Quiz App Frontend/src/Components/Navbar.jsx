import React from "react";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>Quiz App</div>
      <ul style={styles.navLinks}>
        <li style={styles.navItem}>
          <a href="/login" style={styles.link}>Login</a>
        </li>
        <li style={styles.navItem}>
          <a href="/register" style={styles.link}>Register</a>
        </li>
      </ul>
    </nav>
  );
};

// Inline CSS
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "#fff",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  navLinks: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  navItem: {
    margin: "0 10px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
    transition: "color 0.3s",
  },
};

export default Navbar;
