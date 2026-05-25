const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  avatar:   { type: String },
  totalScore:   { type: Number, default: 0 },
  quizzesTaken: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)