const express = require('express')
const { getAllQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz, submitQuiz } = require('../controllers/quizController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.get('/',          getAllQuizzes)           // READ all
router.get('/:id',       requireAuth, getQuizById)  // READ one
router.post('/',         requireAuth, createQuiz)   // CREATE
router.put('/:id',       requireAuth, updateQuiz)   // UPDATE
router.delete('/:id',    requireAuth, deleteQuiz)   // DELETE
router.post('/:id/submit', requireAuth, submitQuiz) // SUBMIT

module.exports = router