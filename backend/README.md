# Uber Backend

## API contents

- [User APIs](#user-apis)
  - [Register a user](#register-a-user)
  - [Login a user](#login-a-user)
  - [User profile](#user-profile)
  - [User logout](#user-logout)
- [Captain APIs](#captain-apis)
  - [Register a captain](#register-a-captain)
  - [Login a captain](#login-a-captain)
  - [Captain profile](#captain-profile)
  - [Captain logout](#captain-logout)

## User APIs

### Register a user

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

### Login a user

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

### User profile

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

### User logout

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

## Captain APIs

### Register a captain

Creates a captain account and hashes the password. The endpoint is `POST /api/captain/register`.

**Content-Type:** `application/json`

#### Request body

```json
{
  "fullName": {
    "firstName": "Jane",
    "lastName": "Doe"
  },
  "email": "captain@example.com",
  "password": "secure-password",
  "vehicle": {
    "color": "Black",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

| Field | Required | Validation |
| --- | :---: | --- |
| `fullName.firstName` | Yes | At least 3 characters |
| `fullName.lastName` | No | — |
| `email` | Yes | Must be a valid email address |
| `password` | Yes | At least 6 characters |
| `vehicle.color` | Yes | At least 3 characters |
| `vehicle.plate` | Yes | At least 3 characters |
| `vehicle.capacity` | Yes | Integer of at least 1 |
| `vehicle.vehicleType` | Yes | `car`, `motorcycle`, or `auto` |

Example request:

```bash
curl -X POST http://localhost:5000/api/captain/register \
  -H "Content-Type: application/json" \
  -d "{\"fullName\":{\"firstName\":\"Jane\",\"lastName\":\"Doe\"},\"email\":\"captain@example.com\",\"password\":\"secure-password\",\"vehicle\":{\"color\":\"Black\",\"plate\":\"ABC123\",\"capacity\":4,\"vehicleType\":\"car\"}}"
```

#### Responses

| Status | Meaning |
| --- | --- |
| `201 Created` | Captain registered |
| `400 Bad Request` | Validation failed or captain already exists |
| `500 Internal Server Error` | Registration failed |

The controller currently returns the created document directly; it may include the hashed password. Exclude the password before returning this response in production.

### Login a captain

Logs in an existing captain and returns a JWT in the response and the `token` cookie. The endpoint is `POST /api/captain/login`.

**Content-Type:** `application/json`

#### Request body

```json
{
  "email": "captain@example.com",
  "password": "secure-password"
}
```

| Field | Required | Validation |
| --- | :---: | --- |
| `email` | Yes | Must be a valid email address |
| `password` | Yes | At least 6 characters |

Example request:

```bash
curl -X POST http://localhost:5000/api/captain/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"captain@example.com\",\"password\":\"secure-password\"}"
```

#### Responses

| Status | Meaning |
| --- | --- |
| `200 OK` | Captain logged in |
| `400 Bad Request` | Validation failed or captain was not found |
| `401 Unauthorized` | Password is incorrect |
| `500 Internal Server Error` | Login failed |

**200 OK — logged in**

```json
{
  "message": "captain logged in successfully.",
  "captain": {
    "id": "CAPTAIN_ID",
    "fullName": {
      "firstName": "Jane",
      "lastName": "Doe"
    },
    "email": "captain@example.com"
  },
  "token": "JWT_TOKEN"
}
```

**401 Unauthorized — invalid password**

```json
{
  "message": "Invalid email or password."
}
```

### Captain profile

Returns the authenticated captain's profile. The endpoint is `GET /api/captain/profile`.

**Authentication:** Required via the `token` cookie or an `Authorization: Bearer <JWT>` header. No request body is required.

Example request:

```bash
curl -X GET http://localhost:5000/api/captain/profile \
  -H "Cookie: token=JWT_TOKEN"
```

#### Responses

| Status | Meaning |
| --- | --- |
| `200 OK` | Captain profile returned |
| `400 Bad Request` | Token missing or blacklisted |

**200 OK — profile fetched**

```json
{
  "captain": {
    "_id": "CAPTAIN_ID",
    "fullName": {
      "firstName": "Jane",
      "lastName": "Doe"
    },
    "email": "captain@example.com",
    "status": "inactive",
    "vehicle": {
      "color": "Black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    },
    "location": {
      "lat": null,
      "lng": null
    }
  }
}
```

### Captain logout

Logs out the authenticated captain by blacklisting the current token and clearing the `token` cookie. The endpoint is `GET /api/captain/logout`.

**Authentication:** Required via the `token` cookie or an `Authorization: Bearer <JWT>` header. No request body is required.

Example request:

```bash
curl -X GET http://localhost:5000/api/captain/logout \
  -H "Cookie: token=JWT_TOKEN"
```

#### Responses

| Status | Meaning |
| --- | --- |
| `200 OK` | Captain logged out |
| `400 Bad Request` | Token missing or blacklisted |

**200 OK — logged out**

```json
{
  "message": "Logged out successfully"
}
```
