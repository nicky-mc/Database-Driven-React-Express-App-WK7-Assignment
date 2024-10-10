// Hard-code the API URL directly
const BASE_URL = "http://localhost:5001"; // Replace with your actual API URL in production

async function fetchWithErrorHandling(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "An error occurred");
  }
  return response.json();
}

// User Registration
export const registerUser = async (username, email) => {
  return fetchWithErrorHandling(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email }),
  });
};

// User Login
export const loginUser = async (email) => {
  return fetchWithErrorHandling(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
};

// Create Post
export const createPost = async (postData) => {
  const formData = new FormData();
  formData.append("title", postData.title);
  formData.append("content", postData.content);
  if (postData.image) {
    formData.append("image", postData.image);
  }
  formData.append("user_id", postData.user_id);

  return fetchWithErrorHandling(`${BASE_URL}/api/posts`, {
    method: "POST",
    body: formData,
  });
};

// Get All Posts
export const fetchPosts = async () => {
  return fetchWithErrorHandling(`${BASE_URL}/api/posts`);
};

// Get Post by ID
export const fetchPostById = async (id) => {
  return fetchWithErrorHandling(`${BASE_URL}/api/posts/${id}`);
};

// Delete Post
export const deletePost = async (id) => {
  return fetchWithErrorHandling(`${BASE_URL}/api/posts/${id}`, {
    method: "DELETE",
  });
};
