# Uber Backend

## Register a user

Creates a user account, hashes the password, and returns a JWT. The router path is
`POST /register`, mounted under `/api/auth`.

**Endpoint:** `POST /api/auth/register`  
**Content-Type** `application/json`

### Request body

```json
{
  "fullName": {
    "firstName": "Jane",
    "lastName": "Doe"
  },
  "email": "jane@example.com",
  "password": "secure-password"
}
```

| Field | Required | Validation |
| --- | :---: | --- |
| `fullName.firstName` | Yes | At least 3 characters |
| `fullName.lastName` | No | — |
| `email` | Yes | Must be a valid email address |
| `password` | Yes | At least 6 characters |

Example request:
### HTTP Method
```bash
  POST
  ```

### Request path

```bash
curl -X POST http://localhost:5000/api/auth/register 
```


### Responses

| Status | Meaning |
| --- | --- |
| `201 Created` | User registered |
| `400 Bad Request` | Request validation failed |
| `409 Conflict` | Email is already registered |
| `500 Internal Server Error` | Unexpected server error |

**201 Created — registered**

The token is returned in the JSON body and in the `Token` cookie. The password is hashed before it is stored and is not included in the response.

```json
{
  "message": "User registered successfully.",
  "user": {
    "id": "USER_ID",
    "fullName": {
      "firstName": "Jane",
      "lastName": "Doe"
    },
    "email": "jane@example.com"
  },
  "token": "JWT_TOKEN"
}
```

**400 Bad Request — invalid input**

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Password must be at least 6 characters",
      "path": "password",
      "location": "body"
    }
  ]
}
```

**409 Conflict — account already exists**

```json
{
  "message": "User already exists."
}
```

**500 Internal Server Error — registration failed**

```json
{
  "message": "Internal server error.",
  "error": "ERROR_DETAILS"
}
```

## Login a user

Logs in an existing user and returns a JWT. The router path is `POST /login`, mounted under `/api/auth`.

**Endpoint:** `POST /api/auth/login`  
**Content-Type** `application/json`

### Request body

```json
{
  "email": "jane@example.com",
  "password": "secure-password"
}
```

| Field | Required | Validation |
| --- | :---: | --- |
| `email` | Yes | Must be a valid email address |
| `password` | Yes | At least 6 characters |

Example request:
### HTTP Method
```bash
  POST
  ```

### Request path

```bash
curl -X POST http://localhost:5000/api/auth/login
```

### Responses

| Status | Meaning |
| --- | --- |
| `200 OK` | User logged in successfully |
| `400 Bad Request` | Request validation failed |
| `401 Unauthorized` | Invalid email or password |
| `500 Internal Server Error` | Unexpected server error |

**200 OK — logged in**

The token is returned in the JSON body and in the `Token` cookie. This endpoint verifies the password before issuing a JWT.

```json
{
  "message": "User logged in successfully.",
  "user": {
    "id": "USER_ID",
    "fullName": {
      "firstName": "Jane",
      "lastName": "Doe"
    },
    "email": "jane@example.com"
  },
  "token": "JWT_TOKEN"
}
```

**400 Bad Request — invalid input**

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Password must be at least 6 characters",
      "path": "password",
      "location": "body"
    }
  ]
}
```

**401 Unauthorized — invalid credentials**

```json
{
  "message": "Invalid email or password."
}
```

**500 Internal Server Error — login failed**

```json
{
  "message": "Internal server error."
}
```

## User profile

Fetches the authenticated user's details from the JWT token. The route is `GET /profile`, mounted under `/api/auth`.

**Endpoint:** `GET /api/auth/profile`  
**Authentication:** Required via `token` cookie or `Authorization: Bearer <JWT>` header

### Request

No request body is required.

Example request:

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Cookie: token=JWT_TOKEN"
```

### Responses

| Status | Meaning |
| --- | --- |
| `200 OK` | User profile returned successfully |
| `400 Bad Request` | Token missing, invalid, or blacklisted |

**200 OK — profile fetched**

```json
{
  "_id": "USER_ID",
  "fullName": {
    "firstName": "Jane",
    "lastName": "Doe"
  },
  "email": "jane@example.com",
  "password": "HASHED_PASSWORD",
  "createdAt": "2026-11-15T00:00:00.000Z",
  "updatedAt": "2026-11-15T00:00:00.000Z"
}
```

**400 Bad Request — unauthorized**

```json
{
  "message": "unauthorized user"
}
```

## User logout

Logs out the authenticated user by clearing the JWT cookie and blacklisting the active token. The route is `GET /logout`, mounted under `/api/auth`.

**Endpoint:** `GET /api/auth/logout`  
**Authentication:** Required via `token` cookie or `Authorization: Bearer <JWT>` header

### Request

No request body is required.

Example request:

```bash
curl -X GET http://localhost:5000/api/auth/logout \
  -H "Cookie: token=JWT_TOKEN"
```

### Responses

| Status | Meaning |
| --- | --- |
| `200 OK` | User logged out successfully |
| `400 Bad Request` | Token missing, invalid, or blacklisted |

**200 OK — logged out**

```json
{
  "message": "User logout successfully."
}
```

**400 Bad Request — unauthorized**

```json
{
  "message": "unauthorized user"
}
```
