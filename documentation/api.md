
# Auth API Endpoints

## Base URL: `/api/auth`

### 1. **Register**
- **URL**: `/register`
- **Method**: `POST`
- **Description**: Creates a new user account.
- **Request Body**:
  ```json
  {
      "username": "string",
      "email": "string",
      "password": "string",
      "isAdmin": "boolean (optional)"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
        "user": { "username": "string", "email": "string", "isAdmin": "boolean" },
        "token": "string"
    }
    ```
  - **400 Bad Request**: Username or email already exists.

---

### 2. **Login**
- **URL**: `/login`
- **Method**: `POST`
- **Description**: Authenticates a user and returns a token.
- **Request Body**:
  ```json
  {
      "email": "string",
      "password": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
        "user": { "username": "string", "email": "string", "isAdmin": "boolean" },
        "token": "string"
    }
    ```
  - **401 Unauthorized**: Invalid credentials.

---

### 3. **Add Follower**
- **URL**: `/add-follower`
- **Method**: `POST`
- **Description**: Adds a user to the logged-in user's following list.
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Request Body**:
  ```json
  {
      "targetId": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
        "message": "Followed successfully.",
        "following": ["array of user IDs"]
    }
    ```
  - **400 Bad Request**: Already following the user or invalid input.
  - **403 Forbidden**: Cannot follow yourself.

---

### 4. **Remove Follower**
- **URL**: `/remove-follower`
- **Method**: `POST`
- **Description**: Removes a user from the logged-in user's following list.
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Request Body**:
  ```json
  {
      "targetId": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
        "message": "Unfollowed successfully.",
        "following": ["array of user IDs"]
    }
    ```
  - **400 Bad Request**: User is not being followed or invalid input.
  - **403 Forbidden**: Cannot unfollow yourself.

---

### 5. **Test Route**
- **URL**: `/test`
- **Method**: `GET`
- **Description**: Debug route to confirm that auth routes are working.
- **Response**:
  - **200 OK**:
    ```json
    {
        "message": "Auth routes are working"
    }
    ```


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


# Comment API Endpoints

## Base URL: `/api/comments`

### 1. **Create Comment**
- **URL**: `/:postId/create`
- **Method**: `POST`
- **Description**: Allows a logged-in user to create a new comment on a specific post.
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Request Body**:
  ```json
  {
      "content": "string"
  }
  ```
- **Response**:
  - **201 Created**:
    ```json
    {
        "message": "Comment created successfully.",
        "comment": { "id": "string", "user": "string", "post": "string", "content": "string", "createdAt": "string" }
    }
    ```
  - **400 Bad Request**: Missing required fields.
  - **401 Unauthorized**: User not logged in.
  - **404 Not Found**: Post not found.

---

### 2. **Get Comments for Post**
- **URL**: `/:postId`
- **Method**: `GET`
- **Description**: Retrieves all comments for a specific post, sorted by most recent.
- **Response**:
  - **200 OK**:
    ```json
    {
        "message": "Comments retrieved successfully.",
        "comments": [
            { "id": "string", "user": { "id": "string", "username": "string" }, "post": "string", "content": "string", "createdAt": "string" }
        ]
    }
    ```
  - **400 Bad Request**: Missing post ID.
  - **404 Not Found**: Post not found.

---

### 3. **Update Comment**
- **URL**: `/:commentId`
- **Method**: `PUT`
- **Description**: Allows a logged-in user to update their comment. (Pending Implementation)
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Request Body**:
  ```json
  {
      "content": "string"
  }
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
        "message": "Comment updated successfully."
    }
    ```
  - **400 Bad Request**: Invalid input.
  - **401 Unauthorized**: User not logged in.
  - **403 Forbidden**: Not authorized to update this comment.
  - **404 Not Found**: Comment not found.

---

### 4. **Delete Comment**
- **URL**: `/:commentId`
- **Method**: `DELETE`
- **Description**: Allows a logged-in user to delete their comment or allows an admin to delete any comment.
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Response**:
  - **200 OK**:
    ```json
    {
        "message": "Comment deleted successfully."
    }
    ```
  - **400 Bad Request**: Missing comment ID.
  - **401 Unauthorized**: User not logged in.
  - **403 Forbidden**: Not authorized to delete this comment.
  - **404 Not Found**: Comment not found.

