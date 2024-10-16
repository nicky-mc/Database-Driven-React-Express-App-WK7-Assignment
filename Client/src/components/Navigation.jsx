import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import "./Navigation.css";

function Navigation({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return; // Prevent empty search
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`); // Navigate to the search route with encoded search term
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Nerd Girl Brain Dumping Zone
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/create">Create Post</Link>
        </div>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            spellCheck="true" // Enable spell check
          />
          <button type="submit">
            <FontAwesomeIcon icon="search" />
          </button>
        </form>
        <button onClick={toggleTheme} className="theme-toggle">
          <FontAwesomeIcon icon={theme === "light" ? "moon" : "sun"} />
        </button>
      </div>
    </nav>
  );
}

Navigation.propTypes = {
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Navigation;
