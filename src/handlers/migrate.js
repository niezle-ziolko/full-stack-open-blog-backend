import { run } from "../utils/database.js";

export const handleMigrate = async (request, env) => {
  try {
    await run(env, `DROP TABLE IF EXISTS blogs`);
    await run(env, `DROP TABLE IF EXISTS users`);

    await run(env, `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await run(env, `
      CREATE TABLE blogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author TEXT,
        url TEXT NOT NULL,
        title TEXT NOT NULL,
        likes INTEGER DEFAULT 0,
        year INTEGER NOT NULL CHECK (year >= 1991 AND year <= ${new Date().getFullYear()}),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);    

    return new Response(
      JSON.stringify({ message: "Migrations successfully applied" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Migration error:", error);
    return new Response(
      JSON.stringify({ error: "Migration failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  };
};