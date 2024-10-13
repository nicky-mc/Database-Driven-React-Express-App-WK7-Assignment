import "react";
import { useState, useEffect } from "react"; // Corrected import statement
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import PostDetail from "./components/PostDetail";
import CreatePost from "./components/CreatePost";
import SearchResults from "./components/SearchResults";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
  faSun,
  faMoon,
  faSearch,
  faThumbsUp,
  faThumbsDown,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";

library.add(fab, faSun, faMoon, faSearch, faThumbsUp, faThumbsDown, faTrash);

function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.className = theme + "-mode";
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      <div className="App">
        <Navigation theme={theme} toggleTheme={toggleTheme} />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home theme={theme} />} />
            <Route path="/post/:id" element={<PostDetail theme={theme} />} />
            <Route path="/create" element={<CreatePost theme={theme} />} />
            <Route
              path="/search"
              element={<SearchResults theme={theme} />}
            />{" "}
            {/* Added search route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
