# Full Stack Open 2024 - Using relational databases

This project is a full-featured blogging application built with Node.js, Express, and PostgreSQL. Due to the fact that the Render service and Fly.io are paid, the application was made using Cloudflare Workers. In addition, the application uses PostgreSQL, but with the help of Cloudflare D1 service. It allows users to:
  - Create, read, update, and delete blog posts.
  - Register and manage user accounts with email-based usernames.
  - Authenticate via tokens and manage sessions on the server side.
  - Add blogs to a personal reading list and mark them as read or unread.
  - View aggregated blog statistics and search for posts.
  - Ensure proper data validation, error handling, and secure authorization.

The production version of the application is available at the link: [View Here](https://full-stack-open-blog-backend.niezle-ziolko.workers.dev/)

## 📜 Certificate of Completion
With the successful completion of assignments 13.1. through 13.24. of the tenth part of the Full Stack Open course, I received the following certificate from the University of Helsinki:

Using relational databases Module Certificate: [View Certificate](https://studies.cs.helsinki.fi/stats/api/certificate/fs-psql/en/6f1007beeb074607d2f881b100e0143b)

## 🗂️ Project Structure

The project is organized following the recommended structure for Full Stack Open submissions:

```
full-stack-open-blog-backend/
├── .vscode/
│   └── settings.json
├── database/
│   ├── blogs.sql
│   ├── migrations.sql
│   ├── readin_lists.sql
│   ├── sessions.sql
│   ├── updated_at.sql
│   └── users.sql
├── src/
│   ├── handlers/
│   │   ├── authors.js
│   │   ├── blogs.js
│   │   ├── cli.js
│   │   ├── login.js
│   │   ├── logout.js
│   │   ├── migrate.js
│   │   ├── readingLists.js
│   │   └── users.js
│   ├── utils/
│   │   ├── database.js
│   │   ├── errors.js
│   │   ├── password.js
│   │   └── token.js
│   └── index.js
├── test/
│   └── index.spec.js
├── .editorconfig
├── .gitignore
├── prettierrc
├── LICENSE
├── package-lock.json
├── package.json
├── README.md
├── vistest.config.js
└── wrangler.jsonc
```

All course materials for "BMI Calculator" exercises **13.1.–13.24.** are located inside the `full-stack-open-blog-backend` folder.

## ✅ Exercises Overview

### 13.1.

A new GitHub repository has been created for a blog application. The application was deployed in Cloudflare Workers along with a PostgreSQL database using Cloudflare D1.
Verified that the application successfully connects to a remote database via the platform's integrated PostgreSQL service or a third-party database provider.

### 13.2.

Using the command line, a `blogs` table was manually created in the PostgreSQL database with the following schema:
  - `id` – auto-incrementing primary key
  - `author` – string
  - `url` – non-empty string
  - `title` – non-empty string
  - `likes` – integer with a default value of 0

At least two blog entries were inserted into the table to verify functionality.
All SQL commands used for this task are stored in a file named `commands.sql`, located in the root directory of the repository.

### 13.3.

A command-line utility named `cli.js` was implemented to print all blog entries from the database. When executed, the script performs a SQL query to retrieve all records from the `blogs` table and outputs the results in a human-readable format, for example:
  ```sql
  $ node cli.js
  Executing (default): SELECT * FROM blogs
  Dan Abramov: 'On let vs const', 0 likes  
  Laurenz Albe: 'Gaps in sequences in PostgreSQL', 0 likes
  ```

This functionality verifies that the application is correctly connected to the database and can retrieve blog data programmatically outside of the web API.

### 13.4.

The application was transformed into a web-based RESTful API using **Express**. Three endpoints were implemented to manage blog entries stored in the PostgreSQL database:
  - **GET** `/api/blogs`
    Returns a JSON array of all blogs in the database.
  - **POST** `/api/blogs`
  Accepts a JSON payload to create a new blog. Required fields include `author`, `title`, and `url`. The `likes` field is optional and defaults to 0 if not provided.
  - **DELETE** `/api/blogs/:id`
  Deletes the blog entry with the specified `id`. If no blog is found with the given `id`, a 404 response is returned.

These routes form the initial foundation of the blog API, allowing external clients to interact with blog data over HTTP.

### 13.5.

The project structure was refactored to follow a clear and maintainable architectural convention, inspired by widely accepted best practices in Node.js applications.

The updated structure includes:
  - `models/` – Sequelize models defining database schemas (e.g., `blog.js`, `user.js`).
  - `controllers/` – Request handlers for API routes (e.g., `blogs.js`, `users.js`).
  - `routes/` – Express router modules mapping endpoints to controllers.
  - `utils/` – Utility functions and middleware (e.g., error handler, token extractor).
  - `cli.js` – Script for command-line interaction with the database.
  - `app.js` – Express app setup.
  - `index.js` – Entry point of the application.
  - `wrangler.jsonc` – Environment configuration for database and app variables.

This reorganization improves code clarity, facilitates scalability, and separates concerns within the application logic.

### 13.6.

A new endpoint was implemented to allow modifying the number of likes on an existing blog post:
  - **PUT** `/api/blogs/:id` – Updates the `likes` field of the specified blog.

The endpoint expects a JSON payload containing the updated like count. Example request:
  ```json
  {
    "likes": 3
  }
  ```

Upon success, the updated blog entry is returned as a JSON response. If the blog with the given ID does not exist, a 404 status is returned.

### 13.7.

Application-wide error handling was centralized using middleware to improve maintainability and consistency. The following improvements were made:
  - An error-handling middleware was added to capture and respond to errors related to invalid blog creation or update operations.
  - The `express-async-errors` package was enabled to support error propagation from asynchronous route handlers without manual try/catch blocks.

This ensures that unexpected runtime errors and validation failures are caught and returned in a structured manner, improving the developer and user experience.

### 13.8.

**Steps Completed**:
  1. User support was added to the application using Sequelize. Each user contains the following fields:
    - `id`: auto-generated
    - `name`: non-empty string
    - `username`: non-empty string (must be unique)
    - `created_at` and `updated_at`: automatic Sequelize timestamps

  2. The following routes were implemented:
    - **POST** `/api/users` – Create a new user
    - **GET** `/api/users` – List all users
    - **PUT** `/api/users/:username` – Update the `username` of a user

Password handling is basic or identical for all users unless explicitly implemented using hashing (as in Part 4). Sequelize timestamps are enabled and verified to work correctly for user creation and updates.

### 13.9.

Sequelize model validation was added to ensure that the `username` is a valid email address. This was done using Sequelize's built-in `isEmail` validator.

The centralized error handler was modified to return detailed Sequelize validation errors in a structured format, for example:
  ```json
  {
    "error": [
      "Validation isEmail on username failed"
    ]
  }
  ```

### 13.10.

The application was extended to associate each blog with the currently logged-in user. This was implemented by introducing token-based authentication using JSON Web Tokens (JWT).

**Steps Completed**
  1. A new endpoint was added:
    - **POST** `/api/login` – Authenticates a user using a provided username and password. If successful, it returns a signed JWT that includes the user’s ID and username.

    **Example request**:
    ```json
    {
      "username": "user@example.com",
      "password": "secret"
    }
    ```

    **Example response**:
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "username": "user@example.com",
      "name": "User Name"
    }
    ```

  2. Associating Blogs with Users
    - When creating a blog via **POST** `/api/blogs`, the user must provide a valid JWT in the Authorization header:
    ```makefile
    Authorization: Bearer <token>
    ```
    - The blog is then linked to the user whose ID is extracted from the token. This is achieved by setting the `userId` field in the blog to the authenticated user's ID.
    - The application verifies the token and rejects unauthenticated or invalid requests with a 401 error.

### 13.11.

The application was updated to enforce authorization rules for deleting blogs. Only the user who originally added a blog is allowed to delete it.

**Steps Completed**
  1. When a client sends a DELETE request to: **DELETE** `/api/blogs/:id`
  2. The server performs the following steps:
    - Extracts and verifies the JWT token from the Authorization header.
    - Retrieves the blog corresponding to the :id parameter from the database.
    - Compares the userId field of the blog with the ID of the authenticated user from the token.
    - If the IDs match, the blog is deleted. If not, a 403 Forbidden error is returned.

    **Example Response on Unauthorized Deletion**
    ```json
    {
      "error": "unauthorized deletion: you can only delete your own blogs"
    }
    ```

This ensures that users cannot delete blogs added by other users, improving the application's integrity and data security.

### 13.12.

**Steps Completed**
  1. The API was extended to include related data in its responses:
    - **GET** `/api/blogs` – Now includes the user (name and username) who added each blog.
    - **GET** `/api/users` – Now includes an array of blog objects each user has created.
  2. These relationships were implemented using Sequelize associations (`User.hasMany(Blog)` and `Blog.belongsTo(User)`) and included using `Sequelize.include`.

### 13.13.

The application was extended to support filtering blog posts by a search keyword provided as a query parameter. The filtering is performed on the blog titles and is case-insensitive.

**Steps Completed**
  1. Add **GET** request to: **GET** `/api/blogs?search=react`
    - returns all blogs that contain the word "react" (in any case) in their `title` field.
  2. A request without the `search` parameter: **GET** `/api/blogs`
    - returns all blogs without any filtering.
  3. Implementation Notes:
    - The filtering is performed at the database level using a case-insensitive `LIKE` query.
    - This approach improves performance for large datasets and avoids loading unnecessary data into memory.
    - If no blogs match the search term, an empty array is returned.

This filtering functionality improves the usability of the application and prepares the backend for advanced features such as search-based sorting or pagination.

### 13.14.

The blog filtering functionality was extended to support keyword searches not only in the `title` field but also in the `author` field. This allows users to retrieve relevant blogs based on either the blog’s title or the name of its author.

**Steps Completed**
  1. A **GET** request such as: **GET** `/api/blogs?search=jami`
    - will now return all blogs where the keyword `jami` (case-insensitive) appears in either the `title` or the `author` field.
  2. Implementation Details:
    - The filtering uses SQL `ILIKE` conditions with wildcards for case-insensitive partial matching.
    - Both fields are included in the `WHERE` clause joined with an `OR` operator.
    - If the `search` parameter is omitted, all blogs are returned as before.
    - If no matches are found, an empty array is returned.

This enhancement improves search usability by enabling users to find blogs based on either content or authorship.

### 13.15.

The blog retrieval functionality has been modified to return blogs ordered by the number of likes in descending order. This change improves the user experience by showing the most-liked blogs first.

**Steps Completed**
  1. A **GET** request to the `api/blogs` route now returns the blogs sorted based on the `likes` field in descending order. For example: **GET** `/api/blogs`
    - will return blogs ordered from the most liked to the least liked.
  2. Implementation Details
    - The `ORDER BY` clause is used in the SQL query to sort the results based on the `likes` column in descending order.
    - Sequelize's built-in `order` functionality was utilized to apply sorting.
    
    **Example of the query structure**:
    ```js
    Blog.findAll({
      order: [['likes', 'DESC']]
    })
    ```

This change ensures that blogs with the most likes are displayed first, improving visibility for popular content.

### 13.16.

A new API route `/api/authors` was added to the application to provide aggregated statistics about authors. The route returns the number of blog posts (articles) and the total number of likes for each author. The aggregation is performed directly at the database level using SQL's `GROUP BY` clause, and Sequelize’s `fn` and `col` utilities for performing aggregation operations.

**Route Functionality**
  1. The route: **GET** `/api/authors`
    - returns data in the following format:
    ```json
    [
      {
        "author": "Jami Kousa",
        "articles": "3",
        "likes": "10"
      },
      {
        "author": "Kalle Ilves",
        "articles": "1",
        "likes": "2"
      },
      {
        "author": "Dan Abramov",
        "articles": "1",
        "likes": "4"
      }
    ]
    ```
    - Each object in the array represents an author, the number of blogs they have written (`articles`), and the total number of likes across all their blogs (`likes`).
  2. Aggregation is implemented using Sequelize's `findAll` method with:
    - `attributes` including `author`, `COUNT(*)`, and `SUM(likes)`
    - `group` by `author`
    - `order` by the number of likes in descending order (bonus requirement)

    **Example Sequelize query**:
    ```js
    Blog.findAll({
      attributes: [
        'author',
        [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
        [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
      ],
      group: ['author'],
      order: [[sequelize.fn('SUM', sequelize.col('likes')), 'DESC']]
    })
    ```

This implementation ensures that the data is efficiently aggregated and sorted in the database, optimizing performance and scalability.

### 13.17.

In this exercise, the database schema was reset and re-initialized using Sequelize migrations. All existing tables were deleted from the application's PostgreSQL database, and a new migration was created to properly define the structure of the database, including automatic timestamp fields.

**Steps Completed**
  1. Database Cleanup:
    - All tables were deleted from the PostgreSQL database. This was done either by undoing previous migrations or by manually dropping tables from the command line.
      ⚠️ When tables were manually deleted, the `SequelizeMeta` table (which tracks migrations) was also cleared to allow the migrations to re-run from scratch.
  2. Migration Creation:
    A new Sequelize migration was generated to initialize the database schema. This migration defined the structure for both `Users` and `Blogs` tables and included the following:
    - Column definitions (`id`, `title`, `author`, `url`, `likes`, `username`, `name`, etc.)
    - Manual addition of Sequelize timestamp columns:
      - `created_at` (type: `DATE`, `allowNull: false`)
      - `updated_at` (type: `DATE`, `allowNull: false`)
  3. Code Refactoring:
    - The calls to `User.sync()` and `Blog.sync()` were removed from the codebase. These methods automatically synchronize the database with the model definitions, which conflicts with migration-based schema management and causes errors.
    ❗ This step was crucial to ensure Sequelize only applies schema changes through migrations and not through model synchronization at runtime.

    **Migration File Example**
    Example of timestamp fields added in the migration file:
    ```js
    created_at: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE
    }
    ```

This migration provides a consistent and versioned way of managing the database schema, which is necessary for future scalability and collaboration.

### 13.18.

In this exercise, the application was extended to include a `year` field in the `Blogs` table to represent the year a blog was written. This change was implemented via a Sequelize migration and includes validation logic to ensure the year falls within an acceptable range.

**Steps Completed**
  1. Migration Creation:
    - A new Sequelize migration was created to add the `year` column to the `Blogs` table. The column was defined as an integer and included in the schema via:
    ```js
    year: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
    ```
  2. Model Update:
    - The `Blog` model was updated to include the `year` attribute and associated validation rules. The validations ensure that:
      - The year must be greater than or equal to 1991
      - The year must not exceed the current year
    - This was achieved using Sequelize's built-in `validate` option:
    ```js
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1991,
        max: new Date().getFullYear()
      }
    }
    ```
  3. Error Handling:
    - Validation errors related to the `year` field were integrated with the application's centralized error handling middleware. When an invalid year is provided during blog creation or update, the client receives a clear error message, such as:
    ```json
    {
      "error": [
        "Validation min on year failed"
      ]
    }
    ```

**Summary**
  This task improved the semantic completeness of the blog data by including a publication year, while maintaining data integrity through strict server-side validation. The validation rules also help prevent accidental insertion of incorrect or nonsensical years.

### 13.19.

This exercise introduced a reading list feature to the application, allowing users to bookmark blogs they intend to read. Each blog on the list is initially marked as unread, and users can later mark it as read. The implementation is based on a join (association) table between `Users` and `Blogs`.

**Steps Completed**
  1. Join Table Creation via Migration:
    - A new migration was created to introduce a `ReadingLists` table, which connects `Users` and `Blogs` in a many-to-many relationship. The table includes:
      - A foreign key to the `Users` table
      - A foreign key to the `Blogs` table
      - A boolean field `read`, which defaults to `false`
    
    **Example definition in the migration file**:
    ```js
    await queryInterface.createTable('reading_lists', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
      },
      blog_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'blogs', key: 'id' }
      },
      read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    ```
  2. Model Associations:
    Sequelize associations were defined using `belongsToMany()` to establish the many-to-many relationship. This allows querying which blogs are in a user's reading list and their read status.
  3. Direct Database Testing:
    As required by the exercise, the reading list functionality was verified using **direct database manipulation** (e.g., via raw SQL or a DB GUI). No API or UI-level routes were implemented for listing or updating reading list entries at this stage.

**Summary**
This task laid the groundwork for a reading list system by introducing a well-structured join table with additional metadata (read state). It enables efficient tracking of user–blog relationships and supports future enhancements like personalized reading lists and progress tracking.

### 13.20.

This task expands on the reading list feature introduced previously by implementing full API support for managing and accessing reading list entries.

**Implemented Features**
  1. **POST** `/api/readinglists`
    - A new route was created to allow adding blogs to a user's reading list. The route expects a JSON body containing the `userId` and `blogId`. Upon receiving a valid request, a new entry is added to the `reading_lists` join table.

    **Example request**:
    ```json
    {
      "blogId": 10,
      "userId": 3
    }
    ```
  2. **GET** `/api/users/:id`
    - The existing endpoint for retrieving a single user was enhanced to also return their reading list. The returned `readings` field is an array of blog objects associated with the user via the reading list.

    **Example response**:
    ```json
    {
      "name": "Matti Luukkainen",
      "username": "mluukkai@iki.fi",
      "readings": [
        {
          "id": 3,
          "url": "https://google.com",
          "title": "Clean React",
          "author": "Dan Abramov",
          "likes": 34,
          "year": null
        },
        {
          "id": 4,
          "url": "https://google.com",
          "title": "Clean Code",
          "author": "Bob Martin",
          "likes": 5,
          "year": null
        }
      ]
    }
    ```
    - At this stage, the `read` status of each blog in the reading list is not included in the response.

**Technical Notes**
  - Sequelize associations were used to enable querying a user's reading list with blog details.
  - Validation was added to ensure the blog and user exist before creating a reading list entry.
  - The solution lays the foundation for further reading list management features such as toggling the read status.

**Summary**
  This implementation allows users to bookmark blogs for later reading via an API, and enables clients to retrieve the list of bookmarked blogs per user. It integrates user–blog relations through a dedicated reading list model using Sequelize's association capabilities.

### 13.21.

This task builds upon the previous reading list implementation by expanding the single-user endpoint to include metadata from the join table that connects users and blogs.

**Steps Completed**
  1. Extended **GET** `/api/users/:id`
    - The route for retrieving a single user now returns not only the basic blog information in the reading list but also the status of each entry as defined in the `reading_lists` join table.
    - Each blog object in the `readings` array now includes an embedded `readinglists` field, which contains:
      - `read`: a boolean indicating whether the blog has been read.
      - `id`: the ID of the join table row that links the blog to the user.

  **Example response**:
  ```json
  {
    "name": "Matti Luukkainen",
    "username": "mluukkai@iki.fi",
    "readings": [
      {
        "id": 3,
        "url": "https://google.com",
        "title": "Clean React",
        "author": "Dan Abramov",
        "likes": 34,
        "year": null,
        "readinglists": [
          {
            "read": false,
            "id": 2
          }
        ]
      },
      {
        "id": 4,
        "url": "https://google.com",
        "title": "Clean Code",
        "author": "Bob Martin",
        "likes": 5,
        "year": null,
        "readinglists": [
          {
            "read": false,
            "id": 3
          }
        ]
      }
    ]
  }
  ```
  - ⚠️ Although the `readinglists` field is an array, it always contains exactly one object for the specific user–blog connection.

**Technical Notes**
  - A many-to-many association was implemented using Sequelize, with `through` configuration allowing access to attributes (`read`, `id`) from the join table.
  - The enhanced query leverages Sequelize's `include` functionality with nested `through` attributes.
  - Care was taken to ensure consistent and descriptive data structure for client-side consumption.

**Summary**
  This enhancement allows clients to access additional metadata from the reading list connection, such as whether a blog has been read and the unique identifier of the reading list entry. It provides essential groundwork for future operations, such as updating the read status.

### 13.22.

This task adds functionality for users to update the `read` status of a blog in their personal reading list.

**Implemented Features**
  1. **PUT** `/api/readinglists/:id`
    - Allows a user to mark a blog in their reading list as read or unread by updating the `read` field in the join table.

  **Example request body**:
  ```json
  {
    "read": true
  }
  ```
  2. Authorization Check
    - The user making the request must be authenticated via token.
    - The user is only permitted to update entries in their own reading list. Unauthorized modification attempts are rejected with an appropriate error message.

**Technical Notes**
  - Token-based user identification is implemented for access control.
  - The `PUT` handler verifies ownership by comparing the `userId` in the join table with the ID from the token.
  - The Sequelize `update` method is used to modify the `read` field in the `reading_lists` table.

### 13.23.

This task enhances the user detail route by enabling optional filtering of the reading list based on whether blogs have been read.

**Implemented Features**
  1. Enhanced **GET** `/api/users/:id`
    - Now supports an optional query parameter `read`:
      - `/api/users/:id` returns the full reading list.
      - `/api/users/:id?read=true` returns only blogs marked as read.
      - `/api/users/:id?read=false` returns only unread blogs.
  2. Dynamic Filtering
    - The filtering logic is applied using Sequelize `where` clauses within the join table’s `through` configuration, allowing for efficient database-level filtering.

**Technical Notes**
  - The read status filtering is handled directly within the database query to avoid unnecessary post-processing.
  - The system safely parses the query parameter and coerces it to a boolean.
  - The response format remains consistent with previous exercises, including all relevant blog and reading list metadata.

**Summary**
  Together, these tasks enable users to manage their reading list more effectively: marking items as read and retrieving filtered views of their reading progress. This enhances usability and prepares the backend for more advanced reading-tracking features.

### 13.24.

This task enhances the application's security by addressing the token invalidation problem, which arises when a previously issued token remains usable even after a user's access should be revoked.

**Implemented Features**
  1. User Disabling Mechanism
    - A new `disabled` column (`boolean`) is added to the `users` table via migration.
    - When set to `true`, the user is considered blocked and can no longer perform any actions requiring authentication.
    - Disabling/enabling users is done manually via direct database changes.
  2. Session Table
    - A new `sessions` table is introduced (also via migration) to store active JWT tokens issued on login.
    - Each session contains at least:
      - Token (or its signature/identifier)
      - Associated `userId`
      - Timestamp (e.g., `createdAt`)
    - When a user logs in via `POST /api/login`, a session is created and stored in the table.
  3. Token Validation Middleware
    - Every route requiring authentication checks:
      - Whether the token is valid.
      - Whether it exists in the `sessions` table.
      - Whether the associated user is not disabled.
    - If any of these checks fail, the request is rejected with an appropriate error message (e.g., `401 Unauthorized` or `403 Forbidden`).
  4. Logout Endpoint: **DELETE** `/api/logout`
    - Removes the token’s session entry from the `sessions` table.
    - After logout, the token becomes immediately unusable, even if it is still technically valid (i.e., not expired).

**Security Considerations**
  - This solution simulates server-side session management while still using JWT for stateless authentication.
  - By validating tokens against a centralized session table, the application gains full control over issued tokens.
  - Logging out or disabling a user results in immediate invalidation of active sessions.

**Technical Notes**
  - Sequelize is used to manage the session model and migrations.
  - Token information stored in sessions can either be the full token, a hash, or a signature (e.g., `jti` claim) for privacy and performance.
  - All authentication middleware was modified to query the `sessions` table on each request.

**Summary**
  This final task adds robust token management to the application by introducing server-side session tracking. It ensures that users who are logged out or disabled lose access immediately, solving a critical security flaw of traditional JWT-only systems.

## 💻 Installation and Running

Follow these steps to run the project locally:

1. Clone the repository:

```bash
git clone https://github.com/niezle-ziolko/full-stack-open-blog-backend
```

2. Navigate to the project directory:

```bash
cd full-stack-open-blog-backend
```

3. Install the dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Deploy application:

```bash
npm run deploy
```

The server is available at [http://localhost:3000](http://localhost:3000).

## 🧠 Notes

- Use `POST /api/blogs` for creating blogs, `PUT /api/blogs/:id` for updating likes.
- Usernames can be updated via `PUT /api/users/:username`.
- Use `GET /api/authors` for blog count and total likes per author.
- Blog search supports `GET /api/blogs?search=keyword` for title/author.
- Reading lists are many-to-many relationships, marked read with `PUT /api/readinglists/:id`.
- `GET /api/users/:id` shows the reading list, supports ?read=true/false filter.
- Logout via `DELETE /api/logout` to remove session and invalidate token.