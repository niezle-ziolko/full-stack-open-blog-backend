import { query } from "../utils/database.js";

export async function handleAuthors(request, env) {
  const method = request.method;

  if (method === "GET") {
    const sql = `
      SELECT COALESCE(users.name, blogs.author) AS author,
             COUNT(blogs.id) AS articles,
             SUM(blogs.likes) AS likes
      FROM blogs
      LEFT JOIN users ON blogs.author = users.username
      GROUP BY COALESCE(users.name, blogs.author)
      ORDER BY SUM(blogs.likes) DESC
    `;
    const { results } = await query(env, sql);

    return Response.json(results);
  };

  throw new Error("Method Not Allowed");
};