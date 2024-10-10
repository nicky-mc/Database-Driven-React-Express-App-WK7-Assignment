import { useState } from "react";
import { loginUser } from "../api"; // Import loginUser function
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await loginUser(email);
      localStorage.setItem("user_id", result.id);
      alert("Login successful!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <button type="submit" className="button">
        Login
      </button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default Login;
