import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/posts`)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  return (
    <div className="container home-container">
      <h1>Blog Posts</h1>
      <Link to="/create" className="button">
        Create New Post
      </Link>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>
              <h2>{post.title}</h2>
            </Link>
            {post.image_url && (
              <img
                src={`${process.env.REACT_APP_API_URL}${post.image_url}`}
                alt={post.title}
              />
            )}
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Home;
