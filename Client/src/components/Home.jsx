import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./Home.css";

function Home({ theme }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${baseURL}/api/posts`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError(error.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchPosts();
  }, [baseURL]);

  if (loading) {
    return <div>Loading posts...</div>; // Show loading message
  }

  if (error) {
    return <div>Error loading posts: {error}</div>; // Show error message
  }

  return (
    <div className={`home-container ${theme}-mode`}>
      {posts.length === 0 ? (
        <div>No posts available.</div> // Message when no posts are found
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-card">
            {post.image_url && (
              <img src={`${baseURL}${post.image_url}`} alt={post.title} />
            )}
            <div className="post-card-content">
              <h2>{post.title}</h2>
              <p>{post.content.substring(0, 100)}...</p>
              <Link to={`/post/${post.id}`}>Read more</Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

Home.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default Home;
