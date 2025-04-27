import { verifyToken } from "../utils/token.js";
import { query, run } from "../utils/database.js";

export async function handleBlogs(request, env, pathname) {
  const method = request.method;

  if (method === "GET") {
    const urlParams = new URLSearchParams(request.url.split('?')[1]);
    const search = urlParams.get('search');
  
    let sql = `
      SELECT blogs.id, blogs.title, blogs.url, blogs.likes, blogs.author, blogs.year
      FROM blogs 
      LEFT JOIN users ON blogs.author = users.username
    `;
    
    if (search) {
      sql += `
        WHERE LOWER(blogs.title) LIKE LOWER(?) 
        OR LOWER(blogs.author) LIKE LOWER(?)
      `;
    };
  
    sql += " ORDER BY blogs.likes DESC";
  
    const { results } = await query(env, sql, search ? [`%${search}%`, `%${search}%`] : []);
    
    return Response.json(results);
  };

  if (method === "POST") {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    };

    const user = verifyToken(token, env);

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    };

    const body = await request.json();
    const { url, title, year } = body;

    if (!url || !title || year === undefined) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: 'url', 'title', and 'year'" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    };

    const currentYear = new Date().getFullYear();
    if (typeof year !== "number" || year < 1991 || year > currentYear) {
      return new Response(
        JSON.stringify({ error: `Year must be a number between 1991 and ${currentYear}` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    };

    await run(env, "INSERT INTO blogs (author, url, title, year) VALUES (?, ?, ?, ?)", [
      user.username,
      url,
      title,
      year
    ]);

    return new Response(
      JSON.stringify({ message: "Blog created" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  };

  if (method === "DELETE") {
    const token = request.headers.get("Authorization")?.split(" ")[1];
  
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    };
  
    const user = verifyToken(token, env);
  
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    };
  
    const id = pathname.split("/").pop();
  
    const { results } = await query(env, "SELECT * FROM blogs WHERE id = ?", [id]);
    const blog = results[0];
  
    if (!blog) {
      return new Response(
        JSON.stringify({ error: "Blog not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    };
  
    if (blog.author !== user.username) {
      return new Response(
        JSON.stringify({ error: "Forbidden: You can only delete your own blogs" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    };
  
    await run(env, "DELETE FROM blogs WHERE id = ?", [id]);
  
    return new Response(
      JSON.stringify({ message: "Blog deleted" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  };

  if (method === "PUT") {
    const id = pathname.split("/").pop();
    const body = await request.json();
    const { likes } = body;

    if (typeof likes !== "number") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'likes' field" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    };

    const { success } = await run(env, "UPDATE blogs SET likes = ? WHERE id = ?", [likes, id]);

    if (success) {
      return new Response(
        JSON.stringify({ message: "Blog updated" }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Failed to update blog" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    };
  };

  throw new Response(
    JSON.stringify({ error: "Method Not Allowed" }),
    { status: 405, headers: { "Content-Type": "application/json" } }
  );
};