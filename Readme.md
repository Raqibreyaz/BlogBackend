
### Backend README for **MyBlog**

# MyBlog - Backend

MyBlog is a full-stack blogging application where users can register, log in, view posts by pagination, add posts, edit posts, comment on posts, and view comments by pagination. This repository contains the backend of the application, built with Node.js, Express, and MongoDB.

## Features
- **User Authentication**: Secure user authentication with JWT tokens.
- **Post Management**: API endpoints for creating, editing, deleting, and fetching posts with pagination.
- **Comments**: API endpoints for adding and fetching comments with pagination.
- **File Uploads**: Image uploads handled with Multer and stored in Cloudinary.
- **Environment Variables**: Managed with dotenv for secure configuration.
- **MongoDB**: Mongoose is used for database interactions and schema management.

## Tech Stack
- **Node.js**: v16.x.x
- **Express**: v4.19.2
- **Mongoose**: v8.5.3
- **JWT Authentication**: Managed with `jsonwebtoken`
- **File Uploads**: Managed with Multer and Cloudinary

## Setup Instructions
To get started with the backend of MyBlog, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone [\[backend-repo-url\]](https://github.com/Raqibreyaz/BlogBackend.git)
   cd backend-repo

2. **Install the dependencies**:
    ```bash
    npm install

3. **Create a .env file in the root directory with following variables**:
    ```bash
    PORT=<your-port-number>
    FRONTEND_URL=your-frontend-url
    DB_NAME=your-app-name
    MONGODB_URI=your-mongodb-uri
    JWT_SECRET_KEY=your-jwt-secret
    JWT_EXPIRY=jwt-expiration-time
    COOKIE_EXPIRY=your-cookie-expiration-time
    CLOUDINARY_API_KEY=your-cloudinary-api-key
    CLOUDINARY_API_SECRET=your-cloudinary-api-secret
    CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name

4. This backend works in conjunction with the React frontend. For frontend setup and more    
   information, visit the [Frontend Repository](https://github.com/Raqibreyaz/BlogFrontend.git).