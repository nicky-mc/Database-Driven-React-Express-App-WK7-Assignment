import "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import PostDetail from "./components/PostDetail";
import CreatePost from "./components/CreatePost";
import Navigation from "./components/Navigation";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/posts/:categoryName" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
