import { useState } from "react";
import { registerUser } from "../api"; // Import registerUser function
import "./Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await registerUser(username, email);
      alert("Registration successful! User ID: " + result.id);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <button type="submit" className="button">
        Register
      </button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default Register;
