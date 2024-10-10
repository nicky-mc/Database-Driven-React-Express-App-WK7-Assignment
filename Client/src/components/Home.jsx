import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPosts } from "../services/api";
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        const data = await fetchPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container home-container">
      <h1>The Mind Scape of Nicky</h1>
      <nav>
        <ul>
          <li>
            <Link to="/register" className="button">
              Register
            </Link>
          </li>
          <li>
            <Link to="/login" className="button">
              Login
            </Link>
          </li>
          <li>
            <Link to="/create" className="button">
              Create New Post
            </Link>
          </li>
        </ul>
      </nav>
      {posts.length === 0 ? (
        <p>No posts available. Be the first to create a post!</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Link to={`/posts/${post.id}`}>
                <h2>{post.title}</h2>
              </Link>
              {post.image_url && (
                <img
                  src={
                    post.image_url.startsWith("http")
                      ? post.image_url
                      : `${import.meta.env.VITE_API_URL}${post.image_url}`
                  }
                  alt={post.title}
                />
              )}
              <p>{post.content.substring(0, 100)}...</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
