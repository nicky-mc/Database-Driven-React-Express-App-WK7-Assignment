import { useState } from "react";
import { createPost } from "../services/api";
import "./CreatePost.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!image) {
      setError("Please select an image");
      setIsLoading(false);
      return;
    }

    if (!["image/jpeg", "image/png", "image/gif"].includes(image.type)) {
      setError("Please select a valid image file (JPEG, PNG, or GIF)");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);
    formData.append("user_id", 1); // Replace with actual user ID

    console.log("Submitting form data:", {
      title,
      content,
      imageFileName: image ? image.name : "No image",
      user_id: 1,
    });

    try {
      const response = await createPost(formData);
      console.log("Post created successfully:", response);
      // Handle successful post creation (e.g., redirect to posts page)
      setIsLoading(false);
      // You might want to add code here to reset the form or redirect the user
    } catch (error) {
      console.error("Error creating post:", error);
      setError(`Failed to create post: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="create-post-form">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="create-post-form-input"
        />{" "}
        <br />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="create-post-form-textarea"
        />{" "}
        <br />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/jpeg,image/png,image/gif"
          className="create-post-form-file-input"
        />
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="create-post-form-image-preview"
          />
        )}{" "}
        <br />
        <button
          type="submit"
          disabled={isLoading}
          className="create-post-form-submit-button"
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default CreatePost;
