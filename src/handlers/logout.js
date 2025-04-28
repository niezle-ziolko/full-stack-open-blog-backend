import { run } from "../utils/database.js";

export async function handleLogout(request, env) {
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid Authorization header" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  };

  const token = authHeader.replace("Bearer ", "");

  await run(env, "DELETE FROM sessions WHERE id = ?", [token]);

  return new Response(
    JSON.stringify({ message: "Logged out successfully" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};