
# API Documentation for Profile Management

### Base URL: `/api/profiles`

## Endpoints

### 1. **Get User Profile**
**Endpoint**: `GET /:username`  
**Description**: Retrieves the profile details of a user by their username.  
**Request Headers**:  
- `Authorization: Bearer <token>` (optional)  
**Response**:  
- `200 OK` with user profile details, including posts  
- `404 Not Found` if the user does not exist  

---

### 2. **Update User Profile**
**Endpoint**: `POST /:username/update`  
**Description**: Updates the profile of a user. Only admins or the profile owner can update.  
**Request Headers**:  
- `Authorization: Bearer <token>`  
**Request Body**:  
```json
{
  "email": "string",
  "tagline": "string",
  "password": "string"
}
```
**Response**:  
- `200 OK` with updated user details  
- `401 Unauthorized` if not authenticated  
- `403 Forbidden` if not authorized to update  
- `404 Not Found` if the user does not exist  

---

### 3. **Get User Followers**
**Endpoint**: `GET /:username/followers`  
**Description**: Retrieves a list of followers for a specific user.  
**Request Headers**:  
- `Authorization: Bearer <token>`  
**Response**:  
- `200 OK` with followers list  
- `401 Unauthorized` if not authenticated  
- `404 Not Found` if the target user does not exist  

