require("dotenv").config();
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || "";
/** Cloud Postgres (Neon/Railway/…) suele usar SSL; local sin SSL típico. */
const looksLocalDb =
  /localhost|127\.0\.0\.1/i.test(connectionString) ||
  /sslmode=(disable|prefer)/i.test(connectionString);
const useSslRemote = connectionString && !looksLocalDb;

const pool = new Pool({
  connectionString: connectionString || undefined,
  ...(useSslRemote ? { ssl: { rejectUnauthorized: false } } : {}),
});

module.exports = pool;
