const path = require('path');
const db = require('../db.js');
const config = require('../config');
const { remote_server_api } = config;

// Helper to build full cover URL
const buildCoverUrl = (filename) => {
  const isLocal = process.env.NODE_ENV !== 'production';
  return isLocal
    ? `/upload/images/${filename}`
    : `${remote_server_api}/uploads/images/${filename}`;
};

// GET all posts
const getPosts = async (req, res) => {
  try {
    const [data] = await db.query("SELECT id, cover, title, shares, timestamp FROM posts");
    const posts = data.map(post => ({
      ...post,
      coverUrl: buildCoverUrl(post.cover)
    }));
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single post
const getPost = async (req, res) => {
  try {
    const [data] = await db.query(
      "SELECT id, cover, title, content, shares, timestamp FROM posts WHERE id = ?",
      [req.params.id]
    );
    if (!data.length) return res.status(404).json({ message: "Post not found" });

    const post = data[0];
    post.coverUrl = buildCoverUrl(post.cover);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD a new post
const addPost = async (req, res) => {
  const { cover, title, content } = req.body;
  if (!cover || !title || content.trim() === "") {
    return res.status(400).json({ error: "Cover, title and content are required." });
  }

  const filename = path.basename(cover);
  const q = "INSERT INTO posts (`cover`, `title`, `content`, `shares`) VALUES (?)";
  const values = [filename, title, content, 0];

  try {
    const [result] = await db.query(q, [values]);
    res.status(201).json({
      message: "Post created successfully",
      postId: result.insertId,
      coverUrl: buildCoverUrl(filename)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE a post
const deletePost = async (req, res) => {
  try {
    await db.query("DELETE FROM posts WHERE id = ?", [req.params.id]);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE a post
const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { cover, title, content } = req.body;

  if (!title || content.trim() === "") {
    return res.status(400).json({ error: "Title and content cannot be empty." });
  }

  const filename = path.basename(cover);
  const q = "UPDATE posts SET cover = ?, title = ?, content = ? WHERE id = ?";
  const values = [filename, title, content, postId];

  try {
    await db.query(q, values);
    res.status(200).json({
      message: "Post updated successfully",
      coverUrl: buildCoverUrl(filename)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getPosts,
  getPost,
  addPost,
  deletePost,
  updatePost
};
