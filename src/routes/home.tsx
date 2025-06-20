// src/routes/home.tsx
import { Link } from "react-router-dom";
import styles from "../styles/home.module.css";

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <header className={styles.heroSection}>
        <h1 className={styles.mainHeading}>
          Welcome to <span className={styles.appName}>Insight Nexus</span>
        </h1>
        <p className={styles.tagline}>
          Your collaborative space for groundbreaking ideas and shared wisdom.
        </p>
        <p className={styles.description}>
          Dive into the <strong>latest AI news</strong>, discover cutting-edge <strong>tools</strong>, and share your valuable <strong>clinical insights</strong> or <strong>heartfelt stories</strong>. Connect with a community of innovators and thought leaders.
        </p>
        <div className={styles.ctaButtons}>
          <Link to="/ideas" className={styles.exploreButton}>
            Explore Ideas
          </Link>
          <Link to="/create-account" className={styles.getStartedButton}>
            Get Started
          </Link>
        </div>
      </header>
    </div>
  );
}

{/* You can add more sections below for features, testimonials, etc. */}
      {/* <section className={styles.featuresSection}>
        <h2>What You'll Find Here:</h2>
        <ul>
          <li>Curated AI News & Research</li>
          <li>Innovative Tool Spotlights</li>
          <li>Real-world Clinical Narratives</li>
          <li>Inspiring Personal Accounts</li>
        </ul>
      </section> */}

      {/* Another section for a brief "About Us" or mission statement */}