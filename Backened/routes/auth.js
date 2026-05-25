const express = require('express')
const { googleLogin, getMe, logout } = require('../controllers/authController')

const router = express.Router()

router.post('/google', googleLogin)
router.get('/me', getMe)
router.post('/logout', logout)

module.exports = router