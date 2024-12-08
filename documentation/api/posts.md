
# Post API Endpoints

## Base URL: `/api/posts`

### 1. **Create Post**
- **URL**: `/create`
- **Method**: `POST`
- **Description**: Allows a logged-in user to create a new post.
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Request Body**:
  ```json
  {
      "title": "string",
      "description": "string",
      "setup": "string"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
        "message": "Post created successfully.",
        "post": { "id": "string", "title": "string", "description": "string", "setup": "string", "upvoteCount": 0, "createdAt": "string" }
    }
    ```
  - **400 Bad Request**: Missing required fields.
  - **401 Unauthorized**: User not logged in.

---

### 2. **Get Post**
- **URL**: `/:postId`
- **Method**: `GET`
- **Description**: Retrieves a specific post by its ID.
- **Response**:
  - **200 OK**:
    ```json
    {
        "message": "Post retrieved successfully.",
        "post": { "id": "string", "title": "string", "description": "string", "setup": "string", "upvoteCount": 0, "createdAt": "string" }
    }
    ```
  - **400 Bad Request**: Missing post ID.
  - **404 Not Found**: Post not found.

---

### 3. **Get Posts**
- **URL**: `/`
- **Method**: `GET`
- **Description**: Retrieves all posts with pagination, sorted by most recent.
- **Query Parameters**:
  - `page`: Page number (optional, defaults to `1`).
- **Response**:
  - **200 OK**:
    ```json
    {
        "message": "Posts retrieved successfully.",
        "currentPage": 1,
        "totalPages": 5,
        "posts": [
            { "id": "string", "title": "string", "description": "string", "setup": "string", "upvoteCount": 0, "createdAt": "string" }
        ]
    }
    ```

---

### 4. **Update Post**
- **URL**: `/:postId`
- **Method**: `PUT`
- **Description**: Allows a logged-in user to update their post. (Pending Implementation)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Request Body**:
  ```json
  {
      "title": "string (optional)",
      "description": "string (optional)",
      "setup": "string (optional)"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
        "message": "Post updated successfully."
    }
    ```
  - **400 Bad Request**: Invalid input.
  - **401 Unauthorized**: User not logged in.
  - **403 Forbidden**: Not authorized to update this post.
  - **404 Not Found**: Post not found.

---

### 5. **Delete Post**
- **URL**: `/:postId`
- **Method**: `DELETE`
- **Description**: Allows a logged-in user to delete their post or allows an admin to delete any post.
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
        "message": "Post deleted successfully."
    }
    ```
  - **400 Bad Request**: Missing post ID.
  - **401 Unauthorized**: User not logged in.
  - **403 Forbidden**: Not authorized to delete this post.
  - **404 Not Found**: Post not found.

---

### 6. **Upvote Post**
- **URL**: `/:postId/upvote`
- **Method**: `POST`
- **Description**: Allows a logged-in user to upvote a post.
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
        "message": "Post upvoted successfully."
    }
    ```
  - **400 Bad Request**: Missing post ID.
  - **401 Unauthorized**: User not logged in.
  - **404 Not Found**: Post not found.
