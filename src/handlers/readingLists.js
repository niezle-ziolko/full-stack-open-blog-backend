import { verifyToken } from "../utils/token.js";
import { query, run } from "../utils/database.js";
import { ValidationError } from "../utils/errors.js";

export async function handleReadingLists(request, env, pathname) {
  const method = request.method;

  if (method === "GET") {
    const { results } = await query(env, `
      SELECT reading_lists.id AS id, users.username, blogs.title, blogs.url, blogs.author, blogs.year, reading_lists.read
      FROM reading_lists
      JOIN users ON reading_lists.user_id = users.id
      JOIN blogs ON reading_lists.blog_id = blogs.id
    `);

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  if (method === "POST") {
    const body = await request.json();
    const { blogId, userId } = body;

    if (!blogId || !userId) {
      return new Response(JSON.stringify({ error: "Missing 'blogId' or 'userId'" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    };

    try {
      const { results: userResults } = await query(env, `SELECT id FROM users WHERE id = ?`, [userId]);

      if (userResults.length === 0) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      };

      await run(env, `
        INSERT INTO reading_lists (user_id, blog_id) 
        VALUES (?, ?)
      `, [userId, blogId]);

      return new Response(JSON.stringify({ message: "Blog added to reading list" }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      if (error.message.includes("UNIQUE constraint failed")) {
        return new Response(JSON.stringify({ error: "Blog already in reading list" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      };

      throw error;
    };
  };

  if (method === "PUT") {
    const readingListId = pathname.split("/").pop();
    
    if (!readingListId) {
      throw new ValidationError(["Missing reading list entry ID"]);
    };

    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      throw new ValidationError(["Missing authorization token"]);
    };

    const user = verifyToken(token, env);

    if (!user) {
      throw new ValidationError(["Invalid or expired token"]);
    };

    const body = await request.json();
    const { read } = body;

    if (typeof read !== "boolean") {
      throw new ValidationError(["The 'read' field must be a boolean value"]);
    };

    const { results: existingReadingList } = await query(env, `
      SELECT * FROM reading_lists 
      WHERE id = ? AND user_id = (SELECT id FROM users WHERE username = ?)
    `, [readingListId, user.username]);

    if (existingReadingList.length === 0) {
      throw new ValidationError(["This blog is not in your reading list"]);
    };

    await run(env, `
      UPDATE reading_lists 
      SET read = ? 
      WHERE id = ?
    `, [read, readingListId]);

    return new Response(
      JSON.stringify({ message: "Reading list entry updated" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  };

  throw new Response(JSON.stringify({ error: "Method Not Allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
};