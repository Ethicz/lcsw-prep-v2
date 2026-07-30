// GET  /api/progress — returns { data, updated_at } for the signed-in user
// PUT  /api/progress — { data } upserts the user's progress blob (JSONB)
import { neon } from "@netlify/neon";
import { jwtVerify } from "jose";

const sql = neon(process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL);

function json(status, body) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

async function userFromReq(req) {
  const auth = req.headers.get("authorization") || "";
  const m = auth.match(/^Bearer (.+)$/);
  if (!m) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(m[1], secret);
    return { id: payload.uid, email: payload.email };
  } catch { return null; }
}

export default async (req) => {
  if (!process.env.JWT_SECRET) return json(500, { error: "Server not configured (JWT_SECRET missing)" });
  const user = await userFromReq(req);
  if (!user) return json(401, { error: "Not signed in" });

  if (req.method === "GET") {
    const rows = await sql`SELECT data, updated_at FROM progress WHERE user_id = ${user.id}`;
    return json(200, rows[0] || { data: null, updated_at: null });
  }

  if (req.method === "PUT") {
    let body;
    try { body = await req.json(); } catch { return json(400, { error: "Invalid JSON" }); }
    const data = body.data;
    if (!data || typeof data !== "object") return json(400, { error: "Missing data" });
    const payload = JSON.stringify(data);
    if (payload.length > 4_000_000) return json(413, { error: "Progress payload too large" });
    await sql`INSERT INTO progress (user_id, data, updated_at) VALUES (${user.id}, ${payload}::jsonb, now())
              ON CONFLICT (user_id) DO UPDATE SET data = ${payload}::jsonb, updated_at = now()`;
    return json(200, { ok: true });
  }

  return json(405, { error: "Method not allowed" });
};

export const config = { path: "/api/progress" };
