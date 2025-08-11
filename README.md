# EduSync API

A RESTful API for managing a school's student information system. Built with Node.js, Express, and MongoDB.

## Features

- **Students Management**: CRUD operations for student records
- **Courses Management**: CRUD operations for course information
- **Swagger Documentation**: Interactive API documentation
- **MongoDB Integration**: Persistent data storage
- **CORS Support**: Cross-origin resource sharing enabled

## API Endpoints

### Students
- `GET /students` - Get all students
- `GET /students/:id` - Get student by ID
- `POST /students` - Create new student
- `PUT /students/:id` - Update student
- `DELETE /students/:id` - Delete student

### Courses
- `GET /courses` - Get all courses
- `GET /courses/:id` - Get course by ID
- `POST /courses` - Create new course
- `PUT /courses/:id` - Update course
- `DELETE /courses/:id` - Delete course

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file (you can copy `.env.example`) and set the values:
   ```
   # Required
   MONGODB_URL=your_mongodb_connection_string
   
   # GitHub OAuth (required for GitHub login)
   GITHUB_CLIENT_ID=your_github_oauth_app_client_id
   GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret
   # Optional in local dev; defaults to http://localhost:3000/github/callback
   CALLBACK_URL=http://localhost:3000/github/callback
   
   # Optional
   PORT=3000
   ```

3. **Generate Swagger documentation:**
   ```bash
   npm run swagger
   ```

4. **Start the server:**
   ```bash
   node server.js
   # or
   npm start
   ```

5. **Access the API:**
   - API: `http://localhost:3000`
   - Swagger Docs: `http://localhost:3000/api-docs`
   - GitHub Login: `http://localhost:3000/github`
   - Logout: `http://localhost:3000/logout`

## Render Deployment

### Prerequisites
- Render account
- MongoDB database (MongoDB Atlas recommended)

### Deployment Steps

1. **Update swagger.js with your Render app name:**
   ```javascript
   // In swagger.js, replace 'your-render-app-name' with your actual Render app name
   const host = isProduction 
     ? process.env.RENDER_EXTERNAL_HOSTNAME || 'your-actual-app-name.onrender.com'
     : 'localhost:3000';
   ```

2. **Deploy to Render:**
   - Connect your GitHub repository to Render
   - Set environment variables in Render dashboard:
     - `MONGODB_URI`: Your MongoDB connection string
     - `NODE_ENV`: `production`
   - Deploy the application

3. **Update swagger.json for production (optional):**
   After deployment, you can manually update the host in `swagger.json` with your actual Render URL:
   ```json
   {
     "host": "your-actual-app-name.onrender.com",
     "schemes": ["https"]
   }
   ```

### Environment Variables for Render

Set these in your Render dashboard:
- `MONGODB_URI`: Your MongoDB connection string
- `NODE_ENV`: `production`
- `PORT`: Render will set this automatically

### Build Command for Render
```bash
npm install
```

### Start Command for Render
```bash
npm start
```

## API Documentation

Once deployed, access your API documentation at:
- **Local**: `http://localhost:3000/api-docs`
- **Production**: `https://your-app-name.onrender.com/api-docs`

## Testing the API

Use the provided `routes.rest` file with VS Code REST Client extension to test all endpoints.

## Project Structure

```
eduSync_api/
├── controllers/     # Route handlers
├── data/           # Database configuration
├── middleware/     # Custom middleware
├── routes/         # Route definitions
├── server.js       # Main application file
├── swagger.js      # Swagger documentation generator
├── swagger.json    # Generated API documentation
└── routes.rest     # REST client test file
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Swagger** - API documentation
- **Render** - Deployment platform