// GET /api/health — connection check. Visit this URL after deploying to confirm
// the functions are running and the database is reachable, without having to
// create an account first. Returns no secrets.
import { neon } from "@netlify/neon";

export default async () => {
  const out = {
    functions: "ok",
    databaseUrlPresent: !!(process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL),
    jwtSecretPresent: !!process.env.JWT_SECRET,
    database: "not tested",
    tables: [],
    ready: false
  };

  if (!out.databaseUrlPresent) {
    out.hint = "No database URL. In Netlify: Extensions → Netlify DB → Add database (then Claim it).";
    return json(out);
  }
  if (!out.jwtSecretPresent) {
    out.hint = "Add a JWT_SECRET environment variable (a long random string), then redeploy.";
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL);
    await sql`SELECT 1`;
    out.database = "connected";
    const rows = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name IN ('users','progress')
      ORDER BY table_name`;
    out.tables = rows.map(r => r.table_name);
    if (out.tables.length < 2) {
      out.hint = "Connected, but the tables don't exist yet. They're created automatically on the first signup, or you can run schema.sql now.";
    }
    out.ready = out.database === "connected" && out.jwtSecretPresent;
    if (out.ready && out.tables.length === 2 && !out.hint) out.hint = "All set — accounts and sync are live.";
  } catch (e) {
    out.database = "error";
    out.error = String(e.message || e).slice(0, 300);
    out.hint = "Database URL is set but the connection failed. If the database was never claimed it may have expired.";
  }
  return json(out);
};

function json(body) {
  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

export const config = { path: "/api/health" };
