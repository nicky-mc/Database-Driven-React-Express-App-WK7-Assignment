import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PostDetail.css";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${baseURL}/api/posts/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`${baseURL}/api/posts/${id}/comments`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchPost();
    fetchComments();
  }, [id, baseURL]);

  const handleLike = async () => {
    try {
      const response = await fetch(`${baseURL}/api/posts/${id}/like`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPost({ ...post, likes: data.likes });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${baseURL}/api/posts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseURL}/api/posts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setComments([data, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const response = await fetch(`${baseURL}/api/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
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
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? { ...comment, likes: data.likes } : comment
        )
      );
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleCommentDislike = async (commentId) => {
    try {
      const response = await fetch(
        `${baseURL}/api/comments/${commentId}/dislike`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, dislikes: data.dislikes }
            : comment
        )
      );
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="post-detail-container">
      <h1>{post.title}</h1>
      {post.image_url && (
        <img
          src={`${baseURL}${post.image_url}`}
          alt={post.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/path_to_default_image.jpg";
          }}
        />
      )}
      <p>{post.content}</p>
      <p>Category: {post.category_name}</p>
      {post.tags && post.tags.length > 0 && (
        <div>
          <h3>Tags:</h3>
          <ul>
            {post.tags.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="post-actions">
        <button onClick={handleLike}>Like ({post.likes})</button>
        <button onClick={handleDelete}>Delete Post</button>
      </div>

      <div className="comments-section">
        <h2>Comments</h2>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            required
          />
          <button type="submit">Add Comment</button>
        </form>
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p>{comment.content}</p>
            <div className="comment-actions">
              <button
                className="like-button"
                onClick={() => handleCommentLike(comment.id)}
              >
                👍 <span className="like-count">{comment.likes}</span>
              </button>
              <button
                className="dislike-button"
                onClick={() => handleCommentDislike(comment.id)}
              >
                👎 <span className="dislike-count">{comment.dislikes}</span>
              </button>
              <button onClick={() => handleCommentDelete(comment.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostDetail;
