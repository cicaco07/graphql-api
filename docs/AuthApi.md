# **User Authentication API Documentation**

## User Authentication Table of Contents

1. [Register API](#register)
2. [Login API](#login)
3. [Me API](#me)
4. [Get All Users API](#get-all-users)
5. [Update User Role API](#update-user-role)
6. [Delete User API](#delete-user)
7. [Logout API](#logout)
8. [Logout Everywhere API](#logout-everywhere)

## 1. Register API

Description: This API endpoint allows new users to register for an account by providing their email, password, and name. Upon successful registration, a user gets an access token to access some API endpoints. By default a new users will be assigned the "user" role.

### - Example schema field for Register API

```
mutation {
   register (
      input: {
         email: string,
         password: string,
         name: string
      }
   ) {
      access_token
      user {
         _id
         name
         email
         role
         createdAt
      }
   }
}
```

### - Example mutation for Register API

```
mutation {
   register (
      input: {
         email: "user123@example.com",
         password: "password123",
         name: "John Doe13"
      }
   ) {
      access_token
      user {
         _id
         name
         email
         role
         createdAt
      }
   }
}
```

### - Example response for Register API

```
{
   "data": {
      "register": {
         "access_token": "d238123123jansejkn21jk31",
         "user": {
            "_id": "689a10e7f46e5406a874e513",
            "email": "user123@example.com",
            "name": "John Doe13",
            "role": "user",
            "createdAt": "2025-08-11T15:48:55.883Z"
         }
      }
   }
}
```

## 2. Login API

Description: This API endpoint allows existing users to log in by providing their email and password. Upon successful login, a user receives an access token to access protected API endpoints.

### - Example schema field for Login API

```
mutation {
   login (
      input: {
         email: string,
         password: string
      }
   ) {
      access_token
      user {
         _id
         name
         email
         role
         createdAt
      }
   }
}
```

### - Example mutation for Login API

```
mutation {
   login (
      input: {
         email: "user123@example.com",
         password: "password123"
      }
   ) {
      access_token
      user {
         _id
         name
         email
         role
         createdAt
      }
   }
}
```

### - Example response for Login API

```
{
   "data": {
      "login": {
         "access_token": "d238123123jansejkn21jk31",
         "user": {
            "_id": "689a10e7f46e5406a874e513",
            "email": "user123@example.com",
            "name": "John Doe13",
            "role": "user",
            "createdAt": "2025-08-11T15:48:55.883Z"
         }
      }
   }
}
```

## 3. Me API

Description: This API endpoint allows users to retrieve their own profile information. The user must be authenticated and provide a valid access token.

### - Example schema field for Me API

```
query {
   me {
      _id
      name
      email
      role
      createdAt
   }
}
```

- HTTP Headers:

```js
Authorization: Bearer <access_token>
```

### - Example query for Me API

```
query {
   me {
      _id
      name
      email
      role
      createdAt
   }
}
```

- HTTP Headers:

```js
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODlhMTBlN2Y0NmU1NDA2YTg3NGU>
```

### - Example response for Me API

```
{
   "data": {
      "me": {
         "_id": "689a10e7f46e5406a874e513",
         "email": "user123@example.com",
         "name": "John Doe13",
         "role": "user",
         "createdAt": "2025-08-11T15:48:55.883Z"
      }
   }
}
```

## 4. Get All Users API

Description: This API endpoint allows an admin user to retrieve a list of all registered users.

### - Example schema field for Get All Users API

```
query {
   getAllUsers {
      _id
      name
      email
      role
      createdAt
   }
}
```

### - Example query for Get All Users API

```
query {
   getAllUsers {
      _id
      name
      email
      role
      createdAt
   }
}
```

### - Example response for Get All Users API

```
{
   "data": {
      "getAllUsers": [
         {
            "_id": "689a10e7f46e5406a874e513",
            "email": "user123@example.com",
            "name": "John Doe13",
            "role": "user",
            "createdAt": "2025-08-11T15:48:55.883Z"
         },
         {
            "_id": "689a10e7f46e5406a874e514",
            "email": "user124@example.com",
            "name": "John Doe14",
            "role": "user",
            "createdAt": "2025-08-12T15:48:55.883Z"
         }
      ]
   }
}
```

## 5. Update User Role API

Description: This API endpoint allows an admin user to update the role of an existing user.

### - Example schema field for Update User Role API

```
mutation {
   updateUserRole (
      input: {
         userId: "689a10e7f46e5406a874e513",
         role: "admin"
      }
   ) {
      user {
         _id
         name
         email
         role
         createdAt
      }
   }
}
```

### - Example mutation for Update User Role API

```
mutation {
   updateUserRole (
      input: {
         userId: "689a10e7f46e5406a874e513",
         role: "admin"
      }
   ) {
      user {
         _id
         name
         email
         role
         createdAt
      }
   }
}
```

### - Example response for Update User Role API

```
{
   "data": {
      "updateUserRole": {
         "user": {
            "_id": "689a10e7f46e5406a874e513",
            "email": "user123@example.com",
            "name": "John Doe13",
            "role": "admin",
            "createdAt": "2025-08-11T15:48:55.883Z"
         }
      }
   }
}
```

## 6. Delete User API

Description: This API endpoint allows an admin user to delete an existing user.

### - Example schema field for Delete User API

```
mutation {
   deleteUser (
      input: {
         userId: "689a10e7f46e5406a874e513"
      }
   ) {
      user {
         _id
         name
         email
         role
         createdAt
      }
   }
}
```

### - Example mutation for Delete User API

```
mutation {
   deleteUser (
      input: {
         userId: "689a10e7f46e5406a874e513"
      }
   ) {
      user {
         _id
         name
         email
         role
         createdAt
      }
   }
}
```

### - Example response for Delete User API

```
{
   "data": {
      "deleteUser": {
         "user": {
            "_id": "689a10e7f46e5406a874e513",
            "email": "user123@example.com",
            "name": "John Doe13",
            "role": "admin",
            "createdAt": "2025-08-11T15:48:55.883Z"
         }
      }
   }
}
```

## 7. Logout API

Description: This API endpoint allows users to log out from their account by invalidating their access token.

### - Example schema field for Logout API

```
mutation {
   logout {
      message
   }
}
```

- HTTP Headers:

```js
Authorization: Bearer <access_token>
```

### - Example mutation for Logout API

```
mutation {
   logout {
      message
   }
}
```

- HTTP Headers:

```js
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODlhMTBlN2Y0NmU1NDA2YTg3NGU>
```

### - Example response for Logout API

```
{
   "data": {
      "logout": {
         "message": "Successfully logged out"
      }
   }
}
```

## 8. Logout Everywhere API

Description: This API endpoint allows users to log out from all devices by invalidating their refresh token.

### - Example schema field for Logout Everywhere API

```
mutation {
   logoutEverywhere {
      message
   }
}
```

- HTTP Headers:

```js
Authorization: Bearer <access_token>
```

### - Example mutation for Logout Everywhere API

```
mutation {
   logoutEverywhere {
      message
   }
}
```

- HTTP Headers:

```js
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODlhMTBlN2Y0NmU1NDA2YTg3NGU>
```

### - Example response for Logout Everywhere API

```
{
   "data": {
      "logoutEverywhere": {
         "message": "Successfully logged out from all devices"
      }
   }
}
```
