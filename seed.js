require('dotenv').config()
const mongoose = require('mongoose')
const Quiz = require('./Backened/models/Quiz')
const connectDB = require('./Backened/config/db')

const quizzes = [
  {
    title: 'General Knowledge I.T — Level 1',
    description: 'A beginner quiz to test your general knowledge.',
    questions: [
      {
        text: 'What does HTML stand for?',
        options: ['HyperText Markup Language', 'High Tech Modern Language', 'HyperText Machine Learning', 'Home Tool Markup Language'],
        correctIndex: 0,
      },
      {
        text: 'Which data structure uses LIFO?',
        options: ['Queue', 'Array', 'Stack', 'Linked List'],
        correctIndex: 2,
      },
      {
        text: 'What year was JavaScript created?',
        options: ['1991', '1993', '1995', '1999'],
        correctIndex: 2,
      },
    ],
  },
  {
    title: 'Technology & Programming — Level 2',
    description: 'A quiz for tech enthusiasts and future developers.',
    questions: [
      {
        text: 'What does CSS stand for?',
        options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Colorful Style Sheets'],
        correctIndex: 1,
      },
      {
        text: 'Which company created JavaScript?',
        options: ['Microsoft', 'Google', 'Netscape', 'Apple'],
        correctIndex: 2,
      },
      {
        text: 'What does SQL stand for?',
        options: ['Structured Query Language', 'Simple Query Logic', 'Standard Query List', 'System Query Language'],
        correctIndex: 0,
      },
      {
        text: 'Which of these is a NoSQL database?',
        options: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite'],
        correctIndex: 2,
      },
      {
        text: 'What does API stand for?',
        options: ['Application Programming Interface', 'Applied Program Integration', 'Automated Process Interface', 'Application Process Integration'],
        correctIndex: 0,
      },
      {
        text: 'What is the default port for HTTP?',
        options: ['21', '443', '8080', '80'],
        correctIndex: 3,
      },
      {
        text: 'Which HTTP method is used to send data to a server?',
        options: ['GET', 'POST', 'DELETE', 'PATCH'],
        correctIndex: 1,
      },
      {
        text: 'What does RAM stand for?',
        options: ['Random Access Memory', 'Read Access Memory', 'Rapid Access Module', 'Random Array Memory'],
        correctIndex: 0,
      },
      {
        text: 'Which language is used for styling web pages?',
        options: ['HTML', 'JavaScript', 'CSS', 'Python'],
        correctIndex: 2,
      },
      {
        text: 'What does JSON stand for?',
        options: ['JavaScript Object Notation', 'Java Standard Object Naming', 'JavaScript Oriented Networking', 'Java Source Object Node'],
        correctIndex: 0,
      },
    ],
  },
]

;(async () => {
  await connectDB()

  // Drop the entire quizzes collection to remove old indexes
  try {
    await mongoose.connection.dropCollection('quizzes')
    console.log('🗑️  Dropped old quizzes collection')
  } catch (err) {
    console.log('ℹ️  No existing collection to drop')
  }

  const inserted = await Quiz.insertMany(quizzes)
  console.log(`✅ Seeded ${inserted.length} quizzes:`)
  inserted.forEach(q => console.log(`   - "${q.title}" (${q.questions.length} questions)`))
  await mongoose.disconnect()
  console.log('Done.')
})()