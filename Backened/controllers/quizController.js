const Quiz = require('../models/Quiz')
const Score = require('../models/Score')
const User = require('../models/User')

// READ — Get all quizzes
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('title description questions').lean()
    const data = quizzes.map(({ questions, ...rest }) => ({
      ...rest,
      questionCount: questions.length
    }))
    return res.json({ quizzes: data })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load quizzes.' })
  }
}

// READ — Get one quiz (answers hidden)
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).lean()
    if (!quiz) return res.status(404).json({ error: 'Quiz not found.' })
    const questions = quiz.questions.map(({ _id, text, options }) => ({ _id, text, options }))
    return res.json({ quiz: { ...quiz, questions } })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load quiz.' })
  }
}

// CREATE — Add a new quiz
const createQuiz = async (req, res) => {
  const { title, description, questions } = req.body

  if (!title || !questions || questions.length === 0) {
    return res.status(400).json({ error: 'Title and questions are required.' })
  }

  try {
    const quiz = await Quiz.create({ title, description, questions })
    return res.status(201).json({ message: 'Quiz created.', quiz })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create quiz.' })
  }
}

// UPDATE — Edit a quiz title and description
const updateQuiz = async (req, res) => {
  const { title, description, questions } = req.body

  try {
    const quiz = await Quiz.findById(req.params.id)
    if (!quiz) return res.status(404).json({ error: 'Quiz not found.' })

    // Update only fields that were sent
    if (title) quiz.title = title
    if (description) quiz.description = description
    if (questions && questions.length > 0) quiz.questions = questions

    await quiz.save()
    return res.json({ message: 'Quiz updated.', quiz })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update quiz.' })
  }
}

// DELETE — Remove a quiz
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
    if (!quiz) return res.status(404).json({ error: 'Quiz not found.' })

    await Quiz.findByIdAndDelete(req.params.id)

    // Also delete all scores for this quiz
    await Score.deleteMany({ quiz: req.params.id })

    return res.json({ message: 'Quiz deleted successfully.' })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete quiz.' })
  }
}

// SUBMIT — Grade answers
const submitQuiz = async (req, res) => {
  const { answers } = req.body
  if (!Array.isArray(answers)) return res.status(400).json({ error: 'Answers must be an array.' })

  try {
    const quiz = await Quiz.findById(req.params.id)
    if (!quiz) return res.status(404).json({ error: 'Quiz not found.' })

    let score = 0
    const results = quiz.questions.map((q, i) => {
      const correct = q.correctIndex === answers[i]
      if (correct) score++
      return {
        question: q.text,
        yourAnswer: q.options[answers[i]] ?? 'No answer',
        correctAnswer: q.options[q.correctIndex],
        correct,
      }
    })

    await Score.create({
      user: req.session.userId,
      quiz: quiz._id,
      score,
      totalQuestions: quiz.questions.length,
    })

    await User.findByIdAndUpdate(req.session.userId, {
      $inc: { totalScore: score, quizzesTaken: 1 }
    })

    return res.json({
      score,
      totalQuestions: quiz.questions.length,
      percentage: Math.round((score / quiz.questions.length) * 100),
      results,
    })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to submit quiz.' })
  }
}

module.exports = { getAllQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz, submitQuiz }