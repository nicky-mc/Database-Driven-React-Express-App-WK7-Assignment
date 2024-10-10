// Register.jsx
import { useState } from "react";
import { register } from "../services/api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ username, email });
      // Handle successful registration (e.g., redirect to login page)
    } catch (error) {
      console.error("Error registering:", error);
      setError("Failed to register. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Register</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Register;
