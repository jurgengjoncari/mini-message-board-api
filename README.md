# Mini Message Board – Backend

The **Mini Message Board** is a simple web application that lets people share short messages in a chat-style interface.
I did this project to practice and showcase my skills in full stack JavaScript.
This is the backend, where I used Node.js, Express, and MongoDB. Check out the [frontend repository](https://github.com/jurgengjoncari/mini-message-board) for the client-side code.

## Run locally

Requirements:
- [Node.js 22 or later](https://nodejs.org/en/download/) (includes npm)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community), running locally

Open a terminal in this API folder. Install dependencies:

```powershell
npm install
```

Optional environment variables. Replace the underscore placeholders to override defaults:

```powershell
$env:MONGO_URI = "your_mongodb_connection_string"
$env:PORT = "your_port"
$env:ORIGIN = "your_frontend_origin"
$env:SESSION_SECRET = "your_session_secret"
$env:JWT_SECRET = "your_jwt_secret"
```

Start the API:

```powershell
npm start
```

Google OAuth parameters are not required to start the API. Google sign-in endpoints return `503` until OAuth is configured.

## Technical implementation
- API routes created with Express 4 and Node.js 22.
- Test-driven development with Jest and Supertest. 
- Database managed with MongoDB and Mongoose.
- Code deployed on Render.
- Database hosted on MongoDB Atlas.
- Authentication with JWT.
- Authentication with passport google oauth in progress.
