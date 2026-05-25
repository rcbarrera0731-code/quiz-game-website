# Quiz Game Website

A web-based quiz game where users can log in with Google, play quizzes, and compete on the leaderboard.

---

## Group Members
- R.C Barrera
- Jv Casora
- Ian Louwell Barrera

---

## Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Runtime        | Node.js v22                       |
| Framework      | Express.js                        |
| Database       | MongoDB Atlas                     |
| ODM            | Mongoose                          |
| Authentication | Google OAuth via google-auth-library |
| Sessions       | express-session + connect-mongo   |
| Frontend       | HTML, CSS, JavaScript             |

---

## Key Features

### 1. Login / Logout
- Users sign in using their Google account
- No passwords required — Google handles identity
- Sessions are stored in MongoDB and last 7 days
- Users can log out anytime from the navbar

### 2. Game System
- Users can browse all available quizzes
- Must be logged in to play
- Questions are served without correct answers to prevent cheating
- Answers are graded server-side
- Results show score, percentage, and correct answers

### 3. Leaderboard
- Shows top 10 players ranked by total score
- Updates automatically after every quiz
- Displays player name, avatar, total score, and quizzes taken

---

## Project Structure

Quiz Game Website/
├── Backened/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── requireAuth.js     # Blocks unauthenticated users
│   ├── models/
│   │   ├── User.js            # User data from Google login
│   │   ├── Quiz.js            # Quiz and questions
│   │   └── Score.js           # Quiz results
│   └── routes/
│       ├── auth.js            # Login, logout, session
│       ├── quiz.js            # Browse, play, submit quiz
│       └── leaderboard.js     # Top 10 rankings
├── frontend/
│   ├── index.html             # Main webpage
│   ├── css/
│   │   └── style.css          # Dark theme styling
│   └── js/
│       └── main.js            # Frontend logic
├── node_modules/
├── .env                       # Environment variables (not in GitHub)
├── index.js                   # Main server entry point
├── package.json               # Project dependencies
├── seed.js                    # Sample quiz data loader
└── README.md                  # This file

---

## API Endpoints

| Method | Endpoint                  | Auth     | Description              |
|--------|---------------------------|----------|--------------------------|
| POST   | /api/auth/google          | ❌ Public | Login with Google        |
| GET    | /api/auth/me              | ✅ Login  | Get current user         |
| POST   | /api/auth/logout          | ✅ Login  | Logout                   |
| GET    | /api/quiz                 | ❌ Public | List all quizzes         |
| GET    | /api/quiz/:id             | ✅ Login  | Get quiz questions       |
| POST   | /api/quiz/:id/submit      | ✅ Login  | Submit answers           |
| GET    | /api/leaderboard          | ❌ Public | Top 10 players           |

---

## Database Collections

| Collection | Description                        |
|------------|------------------------------------|
| users      | Google login users and their scores |
| quizzes    | Quiz titles, descriptions, questions |
| scores     | Individual quiz results per user   |
| sessions   | Active login sessions              |

---

## How to Run

### Requirements
- Node.js v18 or higher
- MongoDB Atlas account
- Google Cloud Console OAuth credentials

### Setup Steps

**1. Clone or download the project**
```bash
cd "Quiz Game Website"
```

**2. Install dependencies**
```bash
npm install
```

**3. Create `.env` file**
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mshyqpd.mongodb.net/quizgame?retryWrites=true&w=majority&appName=Cluster0
SESSION_SECRET=your_random_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:3000
PORT=3000
```

**4. Seed quiz data**
```bash
node seed.js
```

**5. Start the server**
```bash
npm run serve
```

**6. Open in browser**

http://localhost:3000/
---

## How Authentication Works

1. User clicks **Sign in with Google** button
2. Google returns a token to the frontend
3. Frontend sends token to `POST /api/auth/google`
4. Backend verifies token using `google-auth-library`
5. User is created or updated in MongoDB
6. Session is saved — user stays logged in for 7 days
7. Logout destroys the session and clears the cookie

## How the Game Works

1. User browses the quiz list (public)
2. Clicks a quiz — must be logged in to continue
3. Backend sends questions **without correct answers**
4. User answers each question one by one
5. Answers sent to backend on submit
6. Backend grades answers and saves score to MongoDB
7. User's total score is updated for the leaderboard

## How the Leaderboard Works

1. Every quiz submission updates the user's `totalScore`
2. Leaderboard fetches top 10 users sorted by `totalScore`
3. Displays rank, name, avatar, score, and quizzes taken
4. Updates automatically after every quiz played

---

## Available Quizzes

| Quiz | Questions |
|------|-----------|
| General Knowledge I.T — Level 1 | 3 questions |
| Technology & Programming — Level 2 | 10 questions |