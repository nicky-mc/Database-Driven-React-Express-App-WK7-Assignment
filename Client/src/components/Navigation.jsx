import "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  return (
    <nav className="navigation">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/create">Create Post</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
