import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  useEffect(() => {
    fetchPosts();
    fetchCategories();
    fetchTags();
  }, [baseURL]);

  const fetchPosts = async (query = "", category = "", tag = "") => {
    try {
      let url = `${baseURL}/api/search?`;
      if (query) url += `query=${encodeURIComponent(query)}&`;
      if (category) url += `category=${encodeURIComponent(category)}&`;
      if (tag) url += `tag=${encodeURIComponent(tag)}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${baseURL}/api/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch(`${baseURL}/api/tags`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(searchQuery, selectedCategory, selectedTag);
  };

  return (
    <div className="home-container">
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </select>
          <button type="submit">Search</button>
        </form>
      </div>
      <div className="posts-container">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <Link to={`/post/${post.id}`}>
              <h2>{post.title}</h2>
              {post.image_url && (
                <img
                  src={`${baseURL}${post.image_url}`}
                  alt={post.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/path_to_default_image.jpg"; // Replace with your default image path
                  }}
                />
              )}
              <p>{post.content.substring(0, 100)}...</p>
              <p>Category: {post.category_name}</p>
              {post.tags && <p>Tags: {post.tags.join(", ")}</p>}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
