import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes
import "./SearchResults.css"; // Import the CSS file

const SearchResults = ({ theme }) => {
  // Accept theme as prop
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(
          `https://nickys-space-server.onrender.com/api/search?query=${query}`
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <div className={`search-results ${theme === "dark" ? "dark-mode" : ""}`}>
      <h1>Search Results for: {query}</h1>
      {results.length > 0 ? (
        <ul>
          {results.map((result) => (
            <li key={result.id}>{result.title}</li> // Adjust as needed for your data structure
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

// Add PropTypes validation
SearchResults.propTypes = {
  theme: PropTypes.string.isRequired, // Validate that theme is a required string
};

export default SearchResults;
