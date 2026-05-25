const { OAuth2Client } = require('google-auth-library')
const User = require('../models/User')

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// Login with Google
const googleLogin = async (req, res) => {
  const { credential } = req.body
  if (!credential) return res.status(400).json({ error: 'No credential provided.' })

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const { sub: googleId, name, email, picture: avatar } = ticket.getPayload()

    let user = await User.findOne({ googleId })
    if (!user) {
      user = await User.create({ googleId, name, email, avatar })
    } else {
      user.name = name
      user.avatar = avatar
      await user.save()
    }

    req.session.userId = user._id
    return res.json({ user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } })
  } catch (err) {
    console.error('Google auth error:', err.message)
    return res.status(401).json({ error: 'Invalid Google token.' })
  }
}

// Get current session user
const getMe = async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in.' })
  try {
    const user = await User.findById(req.session.userId)
    if (!user) return res.status(404).json({ error: 'User not found.' })
    return res.json({ user })
  } catch (err) {
    return res.status(500).json({ error: 'Server error.' })
  }
}

// Logout
const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid')
    return res.json({ message: 'Logged out.' })
  })
}

module.exports = { googleLogin, getMe, logout }