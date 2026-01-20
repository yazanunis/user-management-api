# User Management System API

This project provides a complete RESTful API for user management, including Authentication, Authorization (Role-Based Access Control), and full CRUD operations with data validation.

## General Configuration

* Base URL: http://localhost:5000
* Data Format: JSON
* Authentication: JWT (JSON Web Token).
* Auth Header: Protected routes require the token in the header:
   
    x-auth-token: <YOUR_TOKEN_HERE>
    
---

## Authentication

These endpoints are Public and do not require a token.

### Register New User
Create a new account with password strength validation.

* Endpoint: /register
* Method: POST
* Request Body:

| Field | Type | Required | Description | Validation Rules |
| :--- | :--- | :--- | :--- | :--- |
| name | String | Yes | User's name
| email | String | Yes | User's email | Valid email format, unique. |
| password | String | Yes | User's password | Min 8 chars, 1 Uppercase, 1 Number. |

* Example Request:
   
    {
      "name": "JohnDoe",
      "email": "john@example.com",
      "password": "StrongPass123"
    }
    
* Success Response (201 Created):
   
    {
      "message": "Account Created successfully",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "60d0fe4f5311236168a109ca",
        "name": "JohnDoe",
        "email": "john@example.com",
        "role": "user"
      }
    }
    
* Possible Errors:
    * 400: Email already exists.
    * 400: Password is too weak (Joi Validation Error).

---

###  Login
Authenticate user and generate a session token.

* Endpoint: /login
* Method: POST
* Request Body:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| email | String | Yes | Registered email |
| password | String | Yes | User password |

* Success Response (200 OK):
   
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "60d0fe4f5311236168a109ca",
        "name": "JohnDoe",
        "role": "user"
      }
    }
    
* Possible Errors:
    * 400: Invalid Credentials.

---

## User Management

These endpoints are Protected and require the x-auth-token header.

### Get All Users
Retrieve a list of all registered users (excludes the current requester).

* Endpoint: /users
* Method: GET
* Access Level: Admin Only.
* Success Response (200 OK):
   
    [
      {
        "_id": "60d0fe4f5311236168a109ca",
        "name": "Alice",
        "email": "alice@test.com",
        "role": "user"
      },
      {
        "_id": "60d21b2a5311236168a109cb",
        "name": "Bob",
        "email": "bob@test.com",
        "role": "admin"
      }
    ]
    
* Possible Errors:
    * 401: No token provided.
    * 403: Access Denied (User is not an Admin).

---

### Update User
Update user details (Name, Email, or Role).

* Endpoint: /users/:id
* Method: PUT
* Access Level: Account Owner OR Admin.
* Request Body: (Send only fields you want to update)

| Field | Type | Description | Note |
| :--- | :--- | :--- | :--- |
| name | String | New Name | |
| email | String | New Email | |
| role | String | New Role (user/admin) | Can only be updated by an Admin. |

* Example Request:
   
    {
      "name": "John Updated",
      "role": "admin"
    }
    
* Success Response (200 OK):
    Returns the updated user object.

* Possible Errors:
    * 403: Access Denied (Trying to update someone else's account).
    * 500: Server Error.

---

### Delete User
Permanently remove a user account.

* Endpoint: /users/:id
* Method: DELETE
* Access Level: Account Owner OR Admin.

* Success Response (200 OK):
   
    {
      "message": "Account deleted successfully"
    }

* Possible Errors:
    * 403: Access Denied.
    * 404: User not found.

---

## HTTP Status Codes

| Code | Status | Meaning |
| :--- | :--- | :--- |
| 200 | OK | Request succeeded. |
| 201 | Created | Resource created successfully. |
| 400 | Bad Request | Validation error or missing data. |
| 401 | Unauthorized | Token is missing or invalid. |
| 403 | Forbidden | Valid token but insufficient permissions. |
| 404 | Not Found | Resource or endpoint not found. |
| 500 | Server Error | Internal server error. |

---

## How to Run

1.  Install Dependencies:
   
    npm install
    
2.  Start the Server:
   
    npm start