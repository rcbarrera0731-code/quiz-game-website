const User = require('../models/User')

// Get top 10 players
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ quizzesTaken: { $gt: 0 } })
      .sort({ totalScore: -1 })
      .limit(10)
      .select('name avatar totalScore quizzesTaken')
      .lean()

    const leaderboard = users.map((user, i) => ({
      rank: i + 1,
      name: user.name,
      avatar: user.avatar,
      totalScore: user.totalScore,
      quizzesTaken: user.quizzesTaken,
    }))

    return res.json({ leaderboard })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load leaderboard.' })
  }
}

module.exports = { getLeaderboard }