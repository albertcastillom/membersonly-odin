// lib/passwordUtils.js
const bcrypt = require("bcrypt");

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 12);

async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

async function validatePassword(plain, hashed) {
  if (!hashed) return false;
  return bcrypt.compare(plain, hashed);
}

module.exports = { hashPassword, validatePassword };
