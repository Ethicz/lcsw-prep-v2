// POST /api/auth — { action: "register" | "login", email, password }
// Returns { token, email }. Passwords stored as bcrypt hashes; sessions are 30-day JWTs.
import { neon } from "@netlify/neon";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

// The Netlify DB extension sets NETLIFY_DATABASE_URL; accept DATABASE_URL too
// so a manually-added connection string also works.
//
// Built lazily on purpose. neon() THROWS when no connection string is set, and a
// throw at module scope means the function never loads — Netlify answers that with
// a bare 502 that says nothing about the missing database. Deferring it keeps the
// module importable so a missing/broken DB comes back as a readable JSON error.
let _sql = null;
function getSql() {
  if (!_sql) _sql = neon(process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL);
  return _sql;
}

async function ensureSchema() {
  const sql = getSql();
  await sql`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS progress (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
  )`;
}

function json(status, body) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

async function makeToken(user) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  return await new SignJWT({ uid: user.id, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

const DB_MISSING = "The database isn't connected yet. In Netlify: Extensions → Netlify DB → Add database, then redeploy. Check /api/health for details.";

export default async (req) => {
  try {
    return await handle(req);
  } catch (e) {
    // Last line of defence: anything that escapes here would otherwise surface as
    // an opaque 502 from the platform instead of a message the user can act on.
    console.error("auth: unhandled error", e);
    return json(500, { error: "Server error — see /api/health" });
  }
};

async function handle(req) {
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });
  if (!process.env.JWT_SECRET) return json(500, { error: "Server not configured (JWT_SECRET missing)" });
  if (!(process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL)) return json(503, { error: DB_MISSING });
  let body;
  try { body = await req.json(); } catch { return json(400, { error: "Invalid JSON" }); }
  const action = body.action;
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 254) return json(400, { error: "Invalid email" });
  if (password.length < 8 || password.length > 200) return json(400, { error: "Password must be 8–200 characters" });

  const sql = getSql();
  try {
    await ensureSchema();
  } catch (e) {
    console.error("auth: schema/connection failure", e);
    return json(503, { error: "Can't reach the database. If it was never claimed in Netlify it may have expired — check /api/health." });
  }

  if (action === "register") {
    const hash = await bcrypt.hash(password, 10);
    try {
      const rows = await sql`INSERT INTO users (email, password_hash) VALUES (${email}, ${hash}) RETURNING id, email`;
      const token = await makeToken(rows[0]);
      return json(200, { token, email: rows[0].email });
    } catch (e) {
      if (String(e.message || "").includes("duplicate") || String(e.code) === "23505") {
        return json(409, { error: "An account with that email already exists — try signing in" });
      }
      return json(500, { error: "Could not create account" });
    }
  }

  if (action === "login") {
    let rows;
    try {
      rows = await sql`SELECT id, email, password_hash FROM users WHERE email = ${email}`;
    } catch (e) {
      console.error("auth: login query failed", e);
      return json(503, { error: "Can't reach the database — check /api/health." });
    }
    // Constant-shape response either way; bcrypt.compare on a dummy hash when no user keeps timing similar.
    const user = rows[0];
    const ok = user ? await bcrypt.compare(password, user.password_hash)
      : await bcrypt.compare(password, "$2a$10$8K1p/a0dL1LXMIgoEDFrwOfMQnDHqQO1sVvQ1sJx1sJx1sJx1sJx2").then(() => false);
    if (!ok) return json(401, { error: "Wrong email or password" });
    const token = await makeToken(user);
    return json(200, { token, email: user.email });
  }

  return json(400, { error: "Unknown action" });
}

export const config = { path: "/api/auth" };
