import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import "./PostDetail.css";

function PostDetail({ theme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  useEffect(() => {
    const fetchPostAndComments = async () => {
      setIsLoading(true);
      try {
        const [postResponse, commentsResponse] = await Promise.all([
          fetch(`${baseURL}/api/posts/${id}`),
          fetch(`${baseURL}/api/posts/${id}/comments`),
        ]);

        if (!postResponse.ok) throw new Error("Failed to fetch post");
        if (!commentsResponse.ok) throw new Error("Failed to fetch comments");

        const postData = await postResponse.json();
        const commentsData = await commentsResponse.json();

        setPost(postData);
        setComments(commentsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id, baseURL]);

  const handleLike = async () => {
    try {
      const response = await fetch(`${baseURL}/api/posts/${id}/like`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to like post");
      const data = await response.json();
      setPost((prevPost) => ({ ...prevPost, likes: data.likes }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${baseURL}/api/posts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete post");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseURL}/api/posts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });
      if (!response.ok) throw new Error("Failed to add comment");
      const data = await response.json();
      setComments((prevComments) => [data, ...prevComments]);
      setNewComment("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const response = await fetch(`${baseURL}/api/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete comment");
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      const response = await fetch(
        `${baseURL}/api/comments/${commentId}/like`,
        {
          method: "POST",
        }
      );
      if (!response.ok) throw new Error("Failed to like comment");
      const data = await response.json();
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId ? { ...comment, likes: data.likes } : comment
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (isLoading)
    return <div className={`loading ${theme}-mode`}>Loading...</div>;
  if (error) return <div className={`error ${theme}-mode`}>Error: {error}</div>;
  if (!post)
    return <div className={`not-found ${theme}-mode`}>Post not found</div>;

  return (
    <div className={`post-detail-container ${theme}-mode`}>
      <div className="post-content">
        {post.image_url && (
          <img
            src={`${baseURL}${post.image_url}`}
            alt={post.title}
            onClick={openModal} // Open modal on click
          />
        )}
        <div className="post-text">
          <h1>{post.title}</h1>
          <p>{post.content}</p>
        </div>
      </div>
      <div className="post-actions">
        <button onClick={handleLike}>
          <FontAwesomeIcon icon="thumbs-up" /> Like ({post.likes})
        </button>
        <button onClick={handleDelete}>
          <FontAwesomeIcon icon="trash" /> Delete
        </button>
      </div>

      <div className="comments-section">
        <h2>Comments</h2>
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            required
          />
          <button type="submit">Add Comment</button>
        </form>
        <TransitionGroup>
          {comments.map((comment) => (
            <CSSTransition key={comment.id} timeout={500} classNames="comment">
              <div className="comment">
                <p>{comment.content}</p>
                <div className="comment-actions">
                  <button onClick={() => handleCommentLike(comment.id)}>
                    <FontAwesomeIcon icon="thumbs-up" /> Like ({comment.likes})
                  </button>
                  <button onClick={() => handleCommentDelete(comment.id)}>
                    <FontAwesomeIcon icon="trash" /> Delete
                  </button>
                </div>
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>

      {/* Modal for the image */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              &times; {/* Close button */}
            </button>
            <img
              src={`${baseURL}${post.image_url}`}
              alt={post.title}
              className="modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
}

PostDetail.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default PostDetail;
