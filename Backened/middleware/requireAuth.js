const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next()
  }
  return res.status(401).json({ error: 'Please sign in with Google first.' })
}

module.exports = requireAuth