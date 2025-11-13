import React from "react";
import "../styles/homehero.css";
import member1 from "../assets/test1.png";
import member2 from "../assets/test2.jpeg";
import member3 from "../assets/test3.jpeg";
import ActionButtons from "./ActionButtons";

const HomeHero: React.FC = () => {
  const members = [
    { src: member1, alt: "Member 1" },
    { src: member2, alt: "Member 2" },
    { src: member3, alt: "Member 3" },
  ];

  return (
    <section className="home-hero">
      {/* Left Text Section */}
      <div className="hero-left">
        <h1 className="hero-title">Your Financial Solutions, Simplified</h1>
        <p className="hero-subtitle">
          Advizee helps you get unbiased loan & credit recommendations,
          tailored to your needs — smarter, faster, and stress-free.
        </p>
        <ActionButtons className="hero-buttons" />
      </div>

      {/* Right Images Section */}
      <div className="hero-right">
        {members.map((member, index) => (
          <img
            key={index}
            src={member.src}
            alt={member.alt}
            className={`float-img img${index + 1}`}
            style={{ animationDelay: `${index * 0.5}s` }}
          />
        ))}
      </div>
    </section>
  );
};

export default HomeHero;
