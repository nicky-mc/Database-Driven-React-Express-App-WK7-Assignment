import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  fetchPost,
  deletePost,
  fetchComments,
  addComment,
} from "../services/api";
import "./PostDetail.css";

const PostDetail = ({ currentUser }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getPost = async () => {
      try {
        const data = await fetchPost(id);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to fetch post. Please try again later.");
      }
    };

    const getComments = async () => {
      try {
        const data = await fetchComments(id);
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError("Failed to fetch comments. Please try again later.");
      }
    };

    getPost();
    getComments();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deletePost(id);
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("Failed to delete post. Please try again later.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await addComment(id, { content: newComment });
      setNewComment("");
      const updatedComments = await fetchComments(id);
      setComments(updatedComments);
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Please try again later.");
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!post) return <div>Loading post...</div>;

  return (
    <div className="post-detail">
      <h1>{post.title}</h1>
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
      <p>{post.content}</p>
      {currentUser && currentUser.id === post.author_id && (
        <button onClick={handleDelete}>Delete Post</button>
      )}
      <div className="comments-section">
        <h2>Comments</h2>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <p>{comment.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

PostDetail.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};

export default PostDetail;
