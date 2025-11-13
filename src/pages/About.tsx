import React, { useState } from "react";
import { FaRocket, FaEye, FaUsers, FaBalanceScale, FaHandshake, FaLightbulb } from "react-icons/fa";
import "../styles/about.css";
import Schedule from "./Schedule"; // Import the meeting popup

const About: React.FC = () => {
  const [showSchedule, setShowSchedule] = useState(false);

  return (
    <section className="about-page">
      {/* Header */}
      <div className="about-header">
        <h1 className="about-title">About Advizee</h1>
        <p className="about-subtitle">
          Advizee is dedicated to providing unbiased financial guidance and
          recommendations. We believe finance should be simple, transparent, 
          and accessible to everyone.
        </p>
      </div>

      {/* Mission, Vision, Team */}
      <div className="about-content">
        <div className="about-card">
          <FaRocket className="about-icon" />
          <h2>Our Mission</h2>
          <p>
            To simplify financial decisions and help everyone achieve their
            goals with clarity and confidence.
          </p>
        </div>

        <div className="about-card">
          <FaEye className="about-icon" />
          <h2>Our Vision</h2>
          <p>
            Empower people with knowledge and tools to manage their finances
            smarter and stress-free.
          </p>
        </div>

        <div className="about-card">
          <FaUsers className="about-icon" />
          <h2>Our Team</h2>
          <p>
            A group of passionate financial experts committed to transparency,
            innovation, and excellence.
          </p>
        </div>
      </div>

      {/* Who We Are */}
      <div className="about-extra">
        <h2>Who We Are</h2>
        <p>
          At Advizee, we are more than just financial advisors—we are your
          partners in making smart money choices. With years of experience and
          a people-first approach, we focus on what truly matters: your
          financial well-being.
        </p>
      </div>

      {/* Core Values */}
      <div className="about-values">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <FaBalanceScale className="about-icon" />
            <h3>Integrity</h3>
            <p>Always offering unbiased, transparent, and honest guidance.</p>
          </div>
          <div className="value-card">
            <FaHandshake className="about-icon" />
            <h3>Trust</h3>
            <p>Building long-term relationships through reliability and respect.</p>
          </div>
          <div className="value-card">
            <FaLightbulb className="about-icon" />
            <h3>Innovation</h3>
            <p>Leveraging new ideas and technology to simplify financial planning.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="about-cta">
        <h2>Let’s Build Your Financial Future Together</h2>
        <p>
          Whether you’re planning your first investment, buying a home, or
          securing retirement, Advizee is here to guide you with expertise and
          care.
        </p>
        <button 
          className="about-btn"
          onClick={() => setShowSchedule(true)} // Show meeting popup
        >
          Get in Touch
        </button>
      </div>

      {/* Show Schedule Popup */}
      {showSchedule && <Schedule onClose={() => setShowSchedule(false)} />}
    </section>
  );
};

export default About;
