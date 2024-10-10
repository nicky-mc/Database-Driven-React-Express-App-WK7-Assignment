import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPostById, deletePost } from "../api"; // Import fetchPostById and deletePost functions
import "./PostDetail.css";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const getPost = async () => {
      try {
        const data = await fetchPostById(id);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    getPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(id);
      window.location.href = "/";
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="post-detail">
      <h1>{post.title}</h1>
      {post.image_url && (
        <img
          src={`${process.env.REACT_APP_API_URL}${post.image_url}`}
          alt={post.title}
        />
      )}
      <p>{post.content}</p>
      <button onClick={handleDelete} className="button">
        Delete Post
      </button>
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default PostDetail;
