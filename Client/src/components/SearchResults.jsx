import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./SearchResults.css";

const SearchResults = ({ theme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("q");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(
          `https://nickys-space-server.onrender.com/api/search?query=${encodeURIComponent(
            query
          )}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
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

  const handleResultClick = (id) => {
    navigate(`/post/${id}`);
  };

  return (
    <div className={`search-results ${theme === "dark" ? "dark-mode" : ""}`}>
      <h1>Search Results for: {query}</h1>
      {results.length > 0 ? (
        <ul>
          {results.map((result) => (
            <li key={result.id} onClick={() => handleResultClick(result.id)}>
              {result.title}
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

SearchResults.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default SearchResults;
