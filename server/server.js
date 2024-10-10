import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg"; // Default import for pg
import multer from "multer";
import path from "path";

dotenv.config();

const app = express();
const port = 5001; // Set the port directly here

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Hardcoded frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// PostgreSQL connection using DB_URL
const { Pool } = pg; // Destructure Pool from pg
const pool = new Pool({
  connectionString: process.env.DB_URL, // Using DB_URL from the .env file
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
  },
});

const upload = multer({ storage: storage });

// Routes

// User Registration
app.post("/api/register", async (req, res) => {
  const { username, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id",
      [username, email]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// User Login
app.post("/api/login", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      res.json({ id: result.rows[0].id });
    } else {
      res.status(401).json({ error: "Invalid email" });
    }
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Create Post
app.post("/api/posts", upload.single("image"), async (req, res) => {
  const { title, content, user_id } = req.body;
  const imageUrl = req.file ? path.join("/uploads", req.file.filename) : null;

  try {
    const result = await pool.query(
      "INSERT INTO posts (title, content, user_id, image_url) VALUES ($1, $2, $3, $4) RETURNING id",
      [title, content, user_id, imageUrl]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: "Post creation failed" });
  }
});

// Get All Posts
app.get("/api/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Get Post by ID
app.get("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// Delete Post
app.delete("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM posts WHERE id = $1", [id]);
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
