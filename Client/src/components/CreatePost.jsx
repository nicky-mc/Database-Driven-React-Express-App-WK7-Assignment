import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/api"; // Ensure this function is correctly implemented in the api file
import "../components/CreatePost.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) {
        const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!validImageTypes.includes(image.type)) {
          setError(
            "Invalid image type. Please upload a JPEG, PNG, or GIF file."
          );
          return;
        }
        formData.append("image", image);
      }

      await createPost(formData);
      setTitle("");
      setContent("");
      setImage(null);
      setError(null);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError(`Failed to create post. Error: ${err.message}`);
    }
  };

  return (
    <div className="create-post-form">
      <h2>Create New Post</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        {image && <img src={URL.createObjectURL(image)} alt="Preview" />}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreatePost;
