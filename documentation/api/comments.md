
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
