# User Authentication System

A simple authentication system built with Node.js, Express and MongoDB.
It has user registration, login, a protected dashboard page and logout.

## Features

- Register with username, email and password
- Passwords are hashed with bcrypt before they are saved
- Login checks the credentials and returns a JWT token
- Middleware protects routes by verifying the token
- Dashboard page that only opens if the user is logged in
- Logout removes the token and blocks it on the server
- Error messages are shown for wrong or invalid input

## Tech Used

| Part | Technology |
|------|------------|
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Password Hashing | bcryptjs |
| Authentication | JWT (jsonwebtoken) |
| Frontend | HTML, CSS, JavaScript (Fetch API) |

## Folder Structure

```
task-3/
├── models/
│   └── User.js          # user schema
├── routes/
│   └── auth.js          # register, login, profile, logout
├── middleware/
│   └── auth.js          # token verification
├── public/
│   ├── index.html       # login page
│   ├── register.html    # registration page
│   ├── dashboard.html   # protected page
│   ├── script.js        # helper for messages
│   └── style.css
├── server.js
├── .env
└── package.json
```

## How To Run

1. Install the packages

```
npm install
```

2. Make a `.env` file (you can copy `.env.example`) and put your values in it

```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/authdb
JWT_SECRET=mysecretkey123
```

3. Start MongoDB on your computer, then start the server

```
npm start
```

4. Open http://localhost:3000 in the browser

## API Endpoints

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | /api/register | No | Create a new account |
| POST | /api/login | No | Login and get a JWT token |
| GET | /api/profile | Yes | Get the logged in user details |
| POST | /api/logout | Yes | Logout and block the token |

## Security Points

- Passwords are hashed using bcrypt with a salt, the plain password is never saved
- All the input is trimmed and validated on the server, not only in the browser
- Login gives the same message for a wrong email and a wrong password so nobody can find out which emails exist
- The JWT token expires after 1 hour
- The password field is removed before the user data is sent back
- The JWT secret is kept in the `.env` file which is not pushed to git

## Testing Done

- Registering a new user works
- Registering with a duplicate email shows "Email is already registered"
- Registering with a duplicate username shows "Username is already taken"
- Short password, wrong email format and empty fields show errors
- Login with the wrong password shows "Invalid email or password"
- Opening the dashboard without logging in sends the user back to the login page
- After logout the old token does not work anymore
