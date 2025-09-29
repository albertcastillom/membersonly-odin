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

module.exports = { getUserByUsername, getUserById, createUser };
