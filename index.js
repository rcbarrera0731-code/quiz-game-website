require('dotenv').config()
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const cors = require('cors')
const connectDB = require('./Backened/config/db')

const app = express()
const PORT = process.env.PORT || 3000

connectDB()

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(express.static('Frontend'))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }
}))

app.use('/api/auth', require('./Backened/routes/auth'))
app.use('/api/quiz', require('./Backened/routes/quiz'))
app.use('/api/leaderboard', require('./Backened/routes/leaderboard'))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
