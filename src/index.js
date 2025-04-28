import { handleCli } from "./handlers/cli.js";
import { handleBlogs } from "./handlers/blogs.js";
import { handleUsers } from "./handlers/users.js";
import { handleLogin } from "./handlers/login.js";
import { handleLogout } from "./handlers/logout.js";
import { handleAuthors } from "./handlers/authors.js";
import { handleMigrate } from "./handlers/migrate.js";
import { handleReadingLists } from "./handlers/readingLists.js";

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      if (pathname === "/") {
        return new Response(
          JSON.stringify({ message: "Endpoint unavailable" }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      };

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

      if (pathname === "/api/logout" && request.method === "DELETE") {
        return await handleLogout(request, env);
      };

      if (pathname === "/api/authors") {
        return await handleAuthors(request, env);
      };

      if (pathname === "/api/migrate") {
        return await handleMigrate(request, env);
      };

      if (pathname.startsWith("/api/readinglists")) {
        return await handleReadingLists(request, env, pathname);
      };

      return new Response("Not Found", { status: 404 });
    } catch (error) {
      console.error("Error occurred:", error);

      if (error.name === "ValidationError") {
        return new Response(
          JSON.stringify({ error: error.messages }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      };

      return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    };
  }
};