const db = require("../db/pool");

async function getUserByUsername(username) {
  const { rows } = await db.query(
    "SELECT id, username, password_hash, role FROM users WHERE username = $1 LIMIT 1",
    [username]
  );
  return rows[0] || null;
}

async function getUserById(id) {
  const { rows } = await db.query(
    "SELECT id, username, password_hash, role FROM users WHERE id = $1 LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

async function createUser({ username, passwordHash, role = "member" }) {
  const { rows } = await db.query(
    `INSERT INTO users (username, password_hash, role)
     VALUES ($1, $2, $3)
     RETURNING id, username, role`,
    [username, passwordHash, role]
  );
  return rows[0];
}

async function getAllMessages() {
  const { rows } = await db.query(
    `SELECT p.id,
            u.username,
            p.body,
            p.is_private,
            p.created_at
     FROM posts p
     JOIN users u ON u.id = p.user_id
     ORDER BY p.created_at DESC`
  );
  return rows;
}

async function getMessageById(id) {
  const { rows } = await db.query(
    `SELECT p.id,
            u.username,
            p.body,
            p.is_private,
            p.created_at
     FROM posts p
     JOIN users u ON u.id = p.user_id
     WHERE p.id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function addMessage(userId, body, isPrivate = true) {
  const { rows } = await db.query(
    `INSERT INTO posts (user_id, body, is_private)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, body, is_private, created_at`,
    [userId, body, isPrivate]
  );
  return rows[0];
}

module.exports = {
  getUserByUsername,
  getUserById,
  createUser,
  getAllMessages,
  getMessageById,
  addMessage,
};
