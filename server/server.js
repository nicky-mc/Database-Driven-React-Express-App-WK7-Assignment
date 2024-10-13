import express from "express";
import cors from "cors";
import pg from "pg";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve Font Awesome files
app.use(
  "/webfonts",
  express.static(
    path.join(__dirname, "node_modules/@fortawesome/fontawesome-free/webfonts")
  )
);

// Fetch all posts
app.get("/api/posts", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT posts.*, categories.name as category_name, 
      ARRAY_AGG(DISTINCT tags.name) as tags
      FROM posts 
      JOIN categories ON posts.category_id = categories.id
      LEFT JOIN post_tags ON posts.id = post_tags.post_id
      LEFT JOIN tags ON post_tags.tag_id = tags.id
      GROUP BY posts.id, categories.name
      ORDER BY posts.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ error: "Error fetching posts" });
  }
});

// Fetch single post
app.get("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT posts.*, categories.name as category_name, 
      ARRAY_AGG(DISTINCT tags.name) as tags
      FROM posts 
      JOIN categories ON posts.category_id = categories.id
      LEFT JOIN post_tags ON posts.id = post_tags.post_id
      LEFT JOIN tags ON post_tags.tag_id = tags.id
      WHERE posts.id = $1
      GROUP BY posts.id, categories.name`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching post:", error.message);
    res.status(500).json({ error: "Error fetching post" });
  }
});

// Create a new post
app.post("/api/posts", upload.single("image"), async (req, res) => {
  const { title, content, categoryId, tags } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  // Handle tags parsing
  let parsedTags = [];
  if (tags) {
    try {
      parsedTags = JSON.parse(tags); // Parse tags if they are a string
    } catch (e) {
      console.error("Failed to parse tags:", e);
      return res.status(400).json({ error: "Invalid tags format" });
    }
  }

  console.log("Parsed tags:", parsedTags); // Log parsed tags

  try {
    // Start a transaction
    await pool.query("BEGIN");

    // Insert the post
    const postResult = await pool.query(
      "INSERT INTO posts (title, content, category_id, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, content, categoryId, imageUrl]
    );
    const newPost = postResult.rows[0];

    // Check if parsedTags is an array and has elements
    if (Array.isArray(parsedTags) && parsedTags.length > 0) {
      const tagValues = parsedTags.map((tag) => `('${tag}')`).join(",");
      await pool.query(`
        INSERT INTO tags (name)
        VALUES ${tagValues}
        ON CONFLICT (name) DO NOTHING
      `);

      // Get tag IDs
      const tagResult = await pool.query(
        "SELECT id FROM tags WHERE name = ANY($1)",
        [parsedTags]
      );
      const tagIds = tagResult.rows.map((row) => row.id);

      // Insert post_tags
      const postTagValues = tagIds
        .map((tagId) => `(${newPost.id}, ${tagId})`)
        .join(",");
      await pool.query(`
        INSERT INTO post_tags (post_id, tag_id)
        VALUES ${postTagValues}
      `);
    }

    // Commit the transaction
    await pool.query("COMMIT");

    res.status(201).json(newPost);
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error creating post:", error.message);
    res.status(500).json({ error: "Error creating post" });
  }
});

// Delete a post
app.delete("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Start a transaction
    await pool.query("BEGIN");

    // Delete associated comments and post_tags
    await pool.query("DELETE FROM comments WHERE post_id = $1", [id]);
    await pool.query("DELETE FROM post_tags WHERE post_id = $1", [id]);

    // Delete the post
    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ error: "Post not found" });
    }

    // Commit the transaction
    await pool.query("COMMIT");

    res
      .status(200)
      .json({ message: "Post and associated data deleted successfully" });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error deleting post:", error.message);
    res.status(500).json({ error: "Error deleting post" });
  }
});

// Fetch categories
app.get("/api/categories", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categories ORDER BY name ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({ error: "Error fetching categories" });
  }
});

// Fetch tags
app.get("/api/tags", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tags ORDER BY name ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching tags:", error.message);
    res.status(500).json({ error: "Error fetching tags" });
  }
});

// Search posts
app.get("/api/search", async (req, res) => {
  const { query, category, tag } = req.query;
  try {
    let sqlQuery = `
      SELECT DISTINCT posts.*, categories.name as category_name,
      ARRAY_AGG(DISTINCT tags.name) as tags
      FROM posts 
      JOIN categories ON posts.category_id = categories.id
      LEFT JOIN post_tags ON posts.id = post_tags.post_id
      LEFT JOIN tags ON post_tags.tag_id = tags.id
      WHERE 1=1
    `;
    const queryParams = [];

    if (query) {
      queryParams.push(`%${query}%`);
      sqlQuery += ` AND (posts.title ILIKE $${queryParams.length} OR posts.content ILIKE $${queryParams.length})`;
    }

    if (category) {
      queryParams.push(category);
      sqlQuery += ` AND categories.name = $${queryParams.length}`;
    }

    if (tag) {
      queryParams.push(tag);
      sqlQuery += ` AND tags.name = $${queryParams.length}`;
    }

    sqlQuery +=
      " GROUP BY posts.id, categories.name ORDER BY posts.created_at DESC";

    const result = await pool.query(sqlQuery, queryParams);

    // Map results to include full image URL
    const posts = result.rows.map((post) => ({
      ...post,
      image_url: post.image_url ? `${baseURL}${post.image_url}` : null,
    }));

    res.json(posts);
  } catch (error) {
    console.error("Error searching posts:", error.message);
    res.status(500).json({ error: "Error searching posts" });
  }
});

// Like a post
app.post("/api/posts/:id/like", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING likes",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ likes: result.rows[0].likes });
  } catch (error) {
    console.error("Error liking post:", error.message);
    res.status(500).json({ error: "Error liking post" });
  }
});

// Add a comment
app.post("/api/posts/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO comments (content, post_id) VALUES ($1, $2) RETURNING *",
      [content, id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding comment:", error.message);
    res.status(500).json({ error: "Error adding comment" });
  }
});

// Get comments for a post
app.get("/api/posts/:id/comments", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC",
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    res.status(500).json({ error: "Error fetching comments" });
  }
});

// Delete a comment
app.delete("/api/comments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM comments WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    res.status(500).json({ error: "Error deleting comment" });
  }
});

// Like a comment
app.post("/api/comments/:id/like", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE comments SET likes = likes + 1 WHERE id = $1 RETURNING likes",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.status(200).json({ likes: result.rows[0].likes });
  } catch (error) {
    console.error("Error liking comment:", error.message);
    res.status(500).json({ error: "Error liking comment" });
  }
});

// Dislike a comment
app.post("/api/comments/:id/dislike", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE comments SET dislikes = dislikes + 1 WHERE id = $1 RETURNING dislikes",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.status(200).json({ dislikes: result.rows[0].dislikes });
  } catch (error) {
    console.error("Error disliking comment:", error.message);
    res.status(500).json({ error: "Error disliking comment" });
  }
});

// Create a new category
app.post("/api/categories", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating category:", error.message);
    res.status(500).json({ error: "Error creating category" });
  }
});

// Create a new tag
app.post("/api/tags", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tags (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating tag:", error.message);
    res.status(500).json({ error: "Error creating tag" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
