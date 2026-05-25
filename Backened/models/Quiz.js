const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  text:         { type: String, required: true },
  options:      { type: [String], required: true },
  correctIndex: { type: Number, required: true },
})

const quizSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  questions:   [questionSchema],
}, { timestamps: true })

module.exports = mongoose.model('Quiz', quizSchema)