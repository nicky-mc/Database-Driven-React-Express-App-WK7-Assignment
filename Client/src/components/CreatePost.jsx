import { useState } from "react";
import { createPost } from "../api"; // Import createPost function
import { useNavigate } from "react-router-dom";
import "./CreatePost.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user_id = localStorage.getItem("user_id");

    try {
      await createPost({ title, content, image, user_id });
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the post. Please try again.");
    }
  };

  return (
    <form className="create-post-form" onSubmit={handleSubmit}>
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
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      {image && <img src={URL.createObjectURL(image)} alt="Preview" />}
      <button type="submit" className="button">
        Create Post
      </button>
    </form>
  );
};

export default CreatePost;
