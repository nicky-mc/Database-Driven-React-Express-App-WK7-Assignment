import "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import CreatePost from "./components/CreatePost.jsx";
import PostDetail from "./components/PostDetail.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
