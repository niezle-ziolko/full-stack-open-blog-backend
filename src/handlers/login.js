import { createToken } from "../utils/token.js";
import { query, run } from "../utils/database.js";
import { verifyPassword } from "../utils/password.js";

export async function handleLogin(request, env) {
  const body = await request.json();
  const { username, password } = body;
  const result = await query(env, "SELECT * FROM users WHERE username = ?", [username]);

  if (result.results.length === 0) {
    return new Response(
      JSON.stringify({ error: "Invalid credentials" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  };

  const user = result.results[0];
  const passwordIsValid = await verifyPassword(password, user.password);

  if (!passwordIsValid) {
    return new Response(
      JSON.stringify({ error: "Invalid credentials" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  };

  if (user.disabled) {
    return new Response(
      JSON.stringify({ error: "User account disabled" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  };

  const token = createToken(username, env);

  await run(env, `
    INSERT INTO sessions (id, user_id) VALUES (?, ?)
  `, [token, user.id]);

  return new Response(
    JSON.stringify({ token }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};