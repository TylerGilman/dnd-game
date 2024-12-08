
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
