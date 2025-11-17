import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../assets/logo.png";
import { ChevronDown } from "lucide-react";

const Navbar: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      setHidden(window.scrollY > lastScrollY.current);
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = (name: string) => setOpenDropdown(openDropdown === name ? null : name);

  const handleMouseEnter = (name: string) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpenDropdown(name);
  };

  const handleMouseLeave = (name: string) => {
    if (openDropdown === name) closeTimeout.current = setTimeout(() => setOpenDropdown(null), 200);
  };

  return (
    <nav className={`navbar ${hidden ? "navbar-hidden" : ""}`}>
      <div className="logo"><Link to="/"><img src={logo} alt="Advizee Logo" /></Link></div>

      <div className="nav-right">
        <ul className="nav-links">
          <li className={`dropdown ${openDropdown === "loans" ? "active" : ""}`}
              onMouseEnter={() => handleMouseEnter("loans")}
              onMouseLeave={() => handleMouseLeave("loans")}>
            <button className="dropdown-btn" onClick={e => { e.stopPropagation(); toggleDropdown("loans"); }}>
              Loans <ChevronDown size={14} className="chevron" />
            </button>
            {openDropdown === "loans" && (
              <ul className="dropdown-menu">
                <li><Link to="/loans">Personal Loan</Link></li>
                <li><Link to="/loans">Home Loan</Link></li>
                <li><Link to="/loans">Business Loan</Link></li>
                <li><Link to="/loans">Property Loan</Link></li>
                <li><Link to="/loans">Education Loan</Link></li>
                <li><Link to="/loans">MSME Loan</Link></li>
              </ul>
            )}
          </li>

          <li className={`dropdown ${openDropdown === "cards" ? "active" : ""}`}
              onMouseEnter={() => handleMouseEnter("cards")}
              onMouseLeave={() => handleMouseLeave("cards")}>
            <button className="dropdown-btn" onClick={e => { e.stopPropagation(); toggleDropdown("cards"); }}>
              Credit Card <ChevronDown size={14} className="chevron" />
            </button>
            {openDropdown === "cards" && (
              <ul className="dropdown-menu">
                <li><Link to="/credit-card">Lifetime Free Credit Card</Link></li>
                <li><Link to="/credit-card">CashBack Credit Card</Link></li>
                <li><Link to="/credit-card">Travel Credit Card</Link></li>
                <li><Link to="/credit-card">Fuel Credit Card</Link></li>
                <li><Link to="/credit-card">Rewards Credit Card</Link></li>
              </ul>
            )}
          </li>

          <li><Link className="nav-btn" to="/blog">Blog</Link></li>
          <li><Link className="nav-btn" to="/about">About</Link></li>
        </ul>

        <Link to="https://advizee.github.io/subpage/">
          <button className="login-btn">Contact Us</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
