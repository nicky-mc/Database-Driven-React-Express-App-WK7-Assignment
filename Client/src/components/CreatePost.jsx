import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
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

    fetchCategories();
    fetchTags();
  }, [baseURL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (image) {
      formData.append("image", image);
    }
    selectedTags.forEach((tag) => formData.append("tags[]", tag));

    try {
      const response = await fetch(`${baseURL}/api/posts`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Post created:", result);
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleCreateCategory = async () => {
    try {
      const response = await fetch(`${baseURL}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setCategories([...categories, result]);
      setCategory(result.id);
      setNewCategory("");
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleCreateTag = async () => {
    try {
      const response = await fetch(`${baseURL}/api/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newTag }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setTags([...tags, result]);
      setSelectedTags([...selectedTags, result.id]);
      setNewTag("");
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };

  return (
    <div className="create-post-container">
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New Category"
        />
        <button type="button" onClick={handleCreateCategory}>
          Create Category
        </button>
        <select
          multiple
          value={selectedTags}
          onChange={(e) =>
            setSelectedTags(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
        >
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="New Tag"
        />
        <button type="button" onClick={handleCreateTag}>
          Create Tag
        </button>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
