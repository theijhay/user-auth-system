# User Authentication and Organisation Management System

This project is a Node.js-based API for user authentication and organisation management. It allows users to register, log in, manage their profile, and create or join organisations. The API is built with Express, MongoDB, and JWT for authentication.


## Table of Contents
- Features
- Technologies
- Installation
- Environment Variables
- Usage
- API Endpoints
- Testing
- Deployment


## Features
- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Organisation creation and management
- Adding users to organisations
- Protected routes for authenticated users
- MongoDB integration


## Technologies
- Node.js
- Express
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs

## Installation
To set up this project locally, follow these steps:

1. Clone the repository:
```
git clone https://github.com/your-username/user-auth-system.git
cd user-auth-system
```

2. Install dependencies:
```
npm install
```


3. Create a `.env` file in the root directory and add your environment variables:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
```

4. Start the server:
```
node server.js
```


The server should now be running on `http://localhost:5000`

### Environment Variables
The following environment variables are required:

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT

## Usage
You can test the API endpoints using `Postman` or `curl`. Below are examples of how to use the endpoints.

### API Endpoints
#### User Registration
#### Endpoint: `POST /auth/register`

`Request Body:`
```
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```


`Response:`
```
{
  "status": "success",
  "message": "Registration successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR...",
    "user": {
      "userId": "d319f6fe-fbf4-454f-9c6c-56bda31488c3",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "1234567890"
    }
  }
}
```

### User Login
#### Endpoint: `POST /auth/login`

`Request Body:`
```
{
  "email": "john@example.com",
  "password": "password123"
}
```


`Response:`
```
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR...",
    "user": {
      "userId": "d319f6fe-fbf4-454f-9c6c-56bda31488c3",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "1234567890"
    }
  }
}
```


### Get User by ID (Protected)
#### Endpoint: `GET /api/users/id`

#### Headers:

- `Authorization: Bearer <accessToken>`

`Response:`
```
{
  "status": "success",
  "message": "<message>",
  "data": {
    "userId": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string"
  }
}
```


### Get All Organisations (Protected)
#### Endpoint: `GET /api/organisations`

#### Headers:

- `Authorization: Bearer <accessToken>`

`Response:`
```
{
  "status": "success",
  "message": "<message>",
  "data": {
    "organisations": [
      {
        "orgId": "string",
        "name": "string",
        "description": "string"
      }
    ]
  }
}
```

### Get Organisation by ID (Protected)
#### Endpoint: `GET /api/organisations/orgId`

#### Headers:

- `Authorization: Bearer <accessToken>`

`Response:`
```
{
  "status": "success",
  "message": "<message>",
  "data": {
    "orgId": "string",
    "name": "string",
    "description": "string"
  }
}
```

### Create Organisation (Protected)
#### Endpoint: `POST /api/organisations`

#### Headers:

- `Authorization: Bearer <accessToken>`

`Request Body:`
```
{
  "name": "New Organisation",
  "description": "This is a new organisation"
}
```

`Response:`
```
{
  "status": "success",
  "message": "<message>",
  "data": {
    "orgId": "string",
    "name": "string",
    "description": "string"
  }
}
```

### Add User to Organisation (Protected)
#### Endpoint:  `POST /api/organisations/orgId/users`

#### Headers:

- `Authorization: Bearer <accessToken>`

`Request Body:`
```
{
  "userId": "string"
}
```

`Response:`
```
{
  "status": "success",
  "message": "User added to organisation successfully"
}
```

## Testing
#### Running Tests
You can run the provided tests using the following command:
```
npx jest
```

## Test Scenarios:
- It should register user successfully with default organisation.
- It should fail if required fields are missing.
- It should fail if email is already in use.
- It should log the user in successfully.
- It should fail to log in with incorrect password.
- It should ensure token expires at the correct time and contains correct user details.
- It should ensure users can’t see data from organisations they don’t have access to.

## Deployment
This project is deployed on Vercel. Follow these steps to deploy your own instance:

1. Install Vercel CLI:
```
npm install -g vercel
```
2. Login to Vercel:
```
vercel login
```
3. Deploy the Project:
```
vercel --prod
```



- By Dev Isaac
