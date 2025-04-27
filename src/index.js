import { handleCli } from "./handlers/cli.js";
import { handleBlogs } from "./handlers/blogs.js";
import { handleUsers } from "./handlers/users.js";
import { handleLogin } from "./handlers/login.js";
import { handleAuthors } from "./handlers/authors.js";
import { handleMigrate } from "./handlers/migrate.js";

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      if (pathname.startsWith("/api/blogs")) {
        return await handleBlogs(request, env, pathname);
      };

      if (pathname.startsWith("/api/users")) {
        return await handleUsers(request, env, pathname);
      };

      if (pathname === "/cli") {
        return await handleCli(env);
      };

      if (pathname === "/api/login" && request.method === "POST") {
        return await handleLogin(request, env);
      };

      if (pathname === "/api/authors") {
        return await handleAuthors(request, env);
      };

      if (pathname === "/api/migrate") {
        return await handleMigrate(request, env);
      };

      return new Response("Not Found", { status: 404 });
    } catch (error) {
      console.error("Error occurred:", error);

      if (error.name === "ValidationError") {
        return new Response(
          JSON.stringify({ error: error.messages }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
};