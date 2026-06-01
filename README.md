# Quiz Game Website

A web-based quiz game where users can log in with Google, play quizzes, and compete on the leaderboard.

---

## Group Members
- R.C Barrera
- Jv Casora
- Ian Louwell Barrera

---

## Tech Stack

| Layer          | Technology                           |
|----------------|--------------------------------------|
| Runtime        | Node.js v22                          |
| Framework      | Express.js v5                        |
| Database       | MongoDB Atlas                        |
| ODM            | Mongoose                             |
| Authentication | Google OAuth via google-auth-library |
| Sessions       | express-session + connect-mongo      |
| Frontend       | HTML, CSS, Vanilla JavaScript        |

---

## Key Features

- **Google OAuth Login** — Sign in with Google, no passwords needed
- **Quiz Game** — Browse and play quizzes, answers graded server-side
- **Admin Panel (CRUD)** — Create, Edit, and Delete quizzes after login
- **Leaderboard** — Top 10 players ranked by total score

---

## Advanced Feature

**Google OAuth** via `google-auth-library` — Users authenticate with their Google account. The backend verifies the token, creates/updates the user in MongoDB, and stores a 7-day session.

---

## Project Structure

```
quiz-game-website/
├── Backened/
│   ├── config/db.js
│   ├── controllers/authController.js
│   ├── controllers/quizController.js
│   ├── controllers/leaderboardController.js
│   ├── middleware/requireAuth.js
│   ├── models/User.js
│   ├── models/Quiz.js
│   ├── models/Score.js
│   └── routes/auth.js, quiz.js, leaderboard.js
├── Frontend/
│   ├── index.html
│   ├── css/style.css
│   └── js/main.js
├── index.js
├── seed.js
├── package.json
└── README.md
```

---

## API Endpoints

| Method | Endpoint              | Auth    | Description            |
|--------|-----------------------|---------|------------------------|
| POST   | /api/auth/google      | Public  | Login with Google      |
| GET    | /api/auth/me          | Login   | Get current user       |
| POST   | /api/auth/logout      | Login   | Logout                 |
| GET    | /api/quiz             | Public  | List all quizzes       |
| GET    | /api/quiz/:id         | Login   | Get quiz questions     |
| POST   | /api/quiz             | Login   | Create a quiz (Admin)  |
| PUT    | /api/quiz/:id         | Login   | Update a quiz (Admin)  |
| DELETE | /api/quiz/:id         | Login   | Delete a quiz (Admin)  |
| POST   | /api/quiz/:id/submit  | Login   | Submit answers         |
| GET    | /api/leaderboard      | Public  | Top 10 players         |

---

## How to Run

### Requirements
- Node.js v18+
- MongoDB Atlas account
- Google Cloud Console OAuth credentials

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/rcbarrera0731-code/quiz-game-website.git
cd quiz-game-website

# 2. Install dependencies
npm install

# 3. Create .env file
MONGODB_URI=mongodb+srv://:@cluster0.mshyqpd.mongodb.net/quizgame?retryWrites=true&w=majority&appName=Cluster0
SESSION_SECRET=your_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:3000
PORT=3000

# 4. Seed quiz data
node seed.js

# 5. Start the server
npm run serve

# 6. Open in browser
http://localhost:3000
```