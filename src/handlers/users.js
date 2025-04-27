import { query, run } from "../utils/database.js";
import { hashPassword } from "../utils/password.js";
import { ValidationError } from "../utils/errors.js";

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export async function handleUsers(request, env, pathname) {
  const method = request.method;

  if (method === "GET") {
    const { results: users } = await query(env, `
      SELECT id, name, username, created_at, updated_at 
      FROM users
    `);

    for (let user of users) {
      const { results: blogs } = await query(env, `
        SELECT id, title, url, likes 
        FROM blogs WHERE author = ?
      `, [user.username]);

      user.blogs = blogs;
    };
  
    return Response.json(users);
  };

  if (method === "POST") {
    const body = await request.json();
    const { name, username, password } = body;

    if (!name || !username || !password) {
      throw new ValidationError(["Missing required fields: 'name', 'username' and 'password'"]);
    };

    if (!isValidEmail(username)) {
      throw new ValidationError(["Validation isEmail on username failed"]);
    };

    if (password.length < 6) {
      throw new ValidationError(["Password must be at least 6 characters long"]);
    };

    const passwordHash = await hashPassword(password);

    await run(env, `
      INSERT INTO users (name, username, password) 
      VALUES (?, ?, ?)`, [name, username, passwordHash]
    );

    return new Response(
      JSON.stringify({ message: "User created" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  };

  if (method === "PUT") {
    const oldUsername = decodeURIComponent(pathname.split("/").pop());
    const body = await request.json();
    const { username: newUsername } = body;

    if (!newUsername) {
      throw new ValidationError(["Missing required field: 'username'"]);
    };

    if (!isValidEmail(newUsername)) {
      throw new ValidationError(["Validation isEmail on username failed"]);
    };

    await run(env, `
      UPDATE users SET username = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE username = ?`, [newUsername, oldUsername]
    );

    return new Response(
      JSON.stringify({ message: "User updated" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  };

  throw new Error("Method Not Allowed");
};