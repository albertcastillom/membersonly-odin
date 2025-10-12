// db/pool.js
require("dotenv").config(); // safe even if also called in app.js
const { Pool } = require("pg");

const isProd = process.env.NODE_ENV === "production";

// Prefer a single DATABASE_URL; pg also respects PGHOST/PGUSER/etc. if not provided
const connectionString = process.env.DATABASE_URL;

// Some hosts require TLS. For local dev, keep ssl disabled.
// Only turn on SSL if explicitly requested
const forceSSL = process.env.PGSSL === "require";
const ssl = forceSSL ? { rejectUnauthorized: false } : false;

const pool = new Pool({
  connectionString,
  ssl,
  // optional tuning:
  max: Number(process.env.PG_POOL_MAX || 10),
  idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT || 30_000),
  connectionTimeoutMillis: Number(process.env.PG_CONN_TIMEOUT || 2_000),
});

// Optional: tiny logger for debugging SQL when DEBUG_SQL=1
async function query(text, params) {
  if (process.env.DEBUG_SQL === "1") {
    console.log("[sql]", text, params || []);
  }
  return pool.query(text, params);
}

// Simple transaction helper:
// usage: await withTransaction(async (client) => { await client.query(...); return result; });
async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// Graceful shutdown (CTRL+C / platform stop)
let shuttingDown = false;
function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  pool.end(() => {
    console.log("PostgreSQL pool has ended");
    process.exit(0); // ensure the process exits
  });
}
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

module.exports = { pool, query, withTransaction };
