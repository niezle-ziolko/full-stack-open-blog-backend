import { query } from "../utils/database.js";

export async function handleCli(env) {
  const { results } = await query(env, "SELECT * FROM blogs");

  const formatted = results.map(blog => 
    `${blog.author}: '${blog.title}', ${blog.likes} likes`
  ).join('\n');

  return new Response(`Executing (default): SELECT * FROM blogs\n${formatted}`);
};