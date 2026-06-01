const API = ''
let currentUser = null
let currentQuiz = null
let currentQuestions = []
let currentIndex = 0
let userAnswers = []
 
// ── Page Navigation ──────────────────────────────────────────────────────────
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'))
  document.getElementById(pageId).classList.remove('hidden')
  if (pageId === 'page-quizlist') loadQuizList()
  if (pageId === 'page-leaderboard') loadLeaderboard()
  if (pageId === 'page-admin') loadAdminQuizList()
}
 
// ── Google Auth ───────────────────────────────────────────────────────────────
async function handleCredentialResponse(response) {
  try {
    const res = await fetch(`${API}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ credential: response.credential }),
    })
    const data = await res.json()
    if (data.user) setUser(data.user)
  } catch (err) {
    alert('Login failed. Please try again.')
  }
}
 
function setUser(user) {
  currentUser = user
  document.getElementById('user-name').textContent = user.name
  document.getElementById('user-avatar').src = user.avatar || ''
  document.getElementById('user-info').classList.remove('hidden')
  document.getElementById('login-btn').classList.add('hidden')
  // Show Admin button for all logged-in users (for demo purposes)
  document.getElementById('admin-btn').style.display = 'inline-block'
}
 
async function logout() {
  await fetch(`${API}/api/auth/logout`, { method: 'POST', credentials: 'include' })
  currentUser = null
  document.getElementById('user-info').classList.add('hidden')
  document.getElementById('login-btn').classList.remove('hidden')
  document.getElementById('admin-btn').style.display = 'none'
  showPage('page-home')
}
 
async function checkSession() {
  try {
    const res = await fetch(`${API}/api/auth/me`, { credentials: 'include' })
    if (res.ok) {
      const data = await res.json()
      setUser(data.user)
    }
  } catch (err) {}
}
 
// ── Quiz List ─────────────────────────────────────────────────────────────────
async function loadQuizList() {
  const container = document.getElementById('quiz-list')
  container.innerHTML = '<p style="color:var(--muted)">Loading quizzes...</p>'
  try {
    const res = await fetch(`${API}/api/quiz`)
    const data = await res.json()
    if (!data.quizzes.length) {
      container.innerHTML = '<p style="color:var(--muted)">No quizzes available.</p>'
      return
    }
    container.innerHTML = data.quizzes.map(quiz => `
      <div class="quiz-card" onclick="startQuiz('${quiz._id}')">
        <h3>${quiz.title}</h3>
        <p>${quiz.description || 'Test your knowledge!'}</p>
        <span class="badge">${quiz.questionCount} Questions</span>
      </div>
    `).join('')
  } catch (err) {
    container.innerHTML = '<p style="color:var(--danger)">Failed to load quizzes.</p>'
  }
}
 
// ── Start Quiz ────────────────────────────────────────────────────────────────
async function startQuiz(quizId) {
  if (!currentUser) {
    alert('Please sign in with Google first to play!')
    return
  }
  try {
    const res = await fetch(`${API}/api/quiz/${quizId}`, { credentials: 'include' })
    if (!res.ok) { alert('Failed to load quiz.'); return }
    const data = await res.json()
    currentQuiz = data.quiz
    currentQuestions = data.quiz.questions
    currentIndex = 0
    userAnswers = []
    document.getElementById('quiz-title').textContent = currentQuiz.title
    document.getElementById('total-q').textContent = currentQuestions.length
    showPage('page-quiz')
    renderQuestion()
  } catch (err) {
    alert('Error loading quiz.')
  }
}
 
// ── Render Question ───────────────────────────────────────────────────────────
function renderQuestion() {
  const q = currentQuestions[currentIndex]
  const total = currentQuestions.length
  document.getElementById('current-q').textContent = currentIndex + 1
  document.getElementById('progress-fill').style.width = `${(currentIndex / total) * 100}%`
  document.getElementById('question-text').textContent = q.text
  document.getElementById('next-btn').classList.add('hidden')
 
  document.getElementById('options-list').innerHTML = q.options.map((opt, i) => `
    <button class="option-btn" onclick="selectAnswer(${i})" id="opt-${i}">${opt}</button>
  `).join('')
}
 
// ── Select Answer ─────────────────────────────────────────────────────────────
function selectAnswer(index) {
  userAnswers.push(index)
  document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true)
  document.getElementById(`opt-${index}`).classList.add('selected')
  const nextBtn = document.getElementById('next-btn')
  nextBtn.classList.remove('hidden')
  nextBtn.textContent = currentIndex === currentQuestions.length - 1 ? 'Submit Quiz' : 'Next'
}
 
// ── Next Question ─────────────────────────────────────────────────────────────
async function nextQuestion() {
  currentIndex++
  if (currentIndex < currentQuestions.length) {
    renderQuestion()
  } else {
    await submitQuiz()
  }
}
 
// ── Submit Quiz ───────────────────────────────────────────────────────────────
async function submitQuiz() {
  try {
    const res = await fetch(`${API}/api/quiz/${currentQuiz._id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ answers: userAnswers }),
    })
    const data = await res.json()
    showResult(data)
  } catch (err) {
    alert('Failed to submit quiz.')
  }
}
 
// ── Show Result ───────────────────────────────────────────────────────────────
function showResult(data) {
  const { score, totalQuestions, percentage, results } = data
  let emoji = '😢', msg = 'Keep practicing!'
  if (percentage >= 80) { emoji = '🏆'; msg = 'Excellent work!' }
  else if (percentage >= 60) { emoji = '😊'; msg = 'Good job!' }
  else if (percentage >= 40) { emoji = '🙂'; msg = 'Not bad, keep going!' }
 
  document.getElementById('result-emoji').textContent = emoji
  document.getElementById('result-score').textContent = `${score}/${totalQuestions}`
  document.getElementById('result-msg').textContent = `${percentage}% — ${msg}`
  document.getElementById('result-details').innerHTML = results.map(r => `
    <div class="result-item">
      <div><strong>${r.question}</strong></div>
      <div>Your answer: <span class="${r.correct ? 'correct-tag' : 'wrong-tag'}">
        ${r.yourAnswer} ${r.correct ? '✔' : '✗'}
      </span></div>
      ${!r.correct ? `<div>Correct: <span class="correct-tag">${r.correctAnswer}</span></div>` : ''}
    </div>
  `).join('')
  showPage('page-result')
}
 
// ── Leaderboard ───────────────────────────────────────────────────────────────
async function loadLeaderboard() {
  const container = document.getElementById('leaderboard-list')
  container.innerHTML = '<p style="color:var(--muted)">Loading...</p>'
  try {
    const res = await fetch(`${API}/api/leaderboard`)
    const data = await res.json()
    if (!data.leaderboard.length) {
      container.innerHTML = '<p style="color:var(--muted)">No scores yet. Be the first!</p>'
      return
    }
    const rankIcon = (r) => r === 1 ? '🥇' : r === 2 ? '🥈' : r === 3 ? '🥉' : `#${r}`
    container.innerHTML = data.leaderboard.map(entry => `
      <div class="lb-item">
        <div class="lb-rank">${rankIcon(entry.rank)}</div>
        <img class="lb-avatar" src="${entry.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.name)}`}" alt="avatar" />
        <div class="lb-info">
          <div class="lb-name">${entry.name}</div>
          <div class="lb-meta">${entry.quizzesTaken} quiz${entry.quizzesTaken !== 1 ? 'zes' : ''} taken</div>
        </div>
        <div class="lb-score">${entry.totalScore}</div>
      </div>
    `).join('')
  } catch (err) {
    container.innerHTML = '<p style="color:var(--danger)">Failed to load leaderboard.</p>'
  }
}
 
// ── ADMIN: Load Quiz List ─────────────────────────────────────────────────────
async function loadAdminQuizList() {
  const container = document.getElementById('admin-quiz-list')
  container.innerHTML = '<p>Loading...</p>'
  try {
    const res = await fetch(`${API}/api/quiz`)
    const data = await res.json()
    if (!data.quizzes.length) {
      container.innerHTML = '<p>No quizzes found.</p>'
      return
    }
    container.innerHTML = data.quizzes.map(quiz => `
      <div class="admin-quiz-item">
        <div>
          <h4>${quiz.title}</h4>
          <p>${quiz.description || 'No description'} — ${quiz.questionCount} questions</p>
        </div>
        <div class="admin-actions">
          <button class="btn-edit" onclick="openEditModal('${quiz._id}', '${quiz.title.replace(/'/g,"\\'")}', '${(quiz.description||'').replace(/'/g,"\\'")}')">✏️ Edit</button>
          <button class="btn-delete" onclick="deleteQuiz('${quiz._id}', '${quiz.title.replace(/'/g,"\\'")}')">🗑️ Delete</button>
        </div>
      </div>
    `).join('')
  } catch (err) {
    container.innerHTML = '<p style="color:red">Failed to load quizzes.</p>'
  }
}
 
// ── ADMIN: Create Quiz ────────────────────────────────────────────────────────
async function createQuiz() {
  const title = document.getElementById('new-title').value.trim()
  const description = document.getElementById('new-desc').value.trim()
  const questionsRaw = document.getElementById('new-questions').value.trim()
  const msg = document.getElementById('create-msg')
 
  if (!title || !questionsRaw) {
    msg.style.color = '#ef4444'
    msg.textContent = 'Title and questions are required.'
    return
  }
 
  let questions
  try {
    questions = JSON.parse(questionsRaw)
  } catch {
    msg.style.color = '#ef4444'
    msg.textContent = 'Invalid JSON format for questions.'
    return
  }
 
  try {
    const res = await fetch(`${API}/api/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, description, questions }),
    })
    const data = await res.json()
    if (res.ok) {
      msg.style.color = '#4ade80'
      msg.textContent = '✅ Quiz created successfully!'
      document.getElementById('new-title').value = ''
      document.getElementById('new-desc').value = ''
      document.getElementById('new-questions').value = ''
      loadAdminQuizList()
    } else {
      msg.style.color = '#ef4444'
      msg.textContent = data.error || 'Failed to create quiz.'
    }
  } catch (err) {
    msg.style.color = '#ef4444'
    msg.textContent = 'Error creating quiz.'
  }
}
 
// ── ADMIN: Open Edit Modal ────────────────────────────────────────────────────
function openEditModal(id, title, description) {
  document.getElementById('edit-id').value = id
  document.getElementById('edit-title').value = title
  document.getElementById('edit-desc').value = description
  document.getElementById('edit-msg').textContent = ''
  document.getElementById('edit-modal').classList.add('active')
}
 
function closeModal() {
  document.getElementById('edit-modal').classList.remove('active')
}
 
// ── ADMIN: Save Edit ──────────────────────────────────────────────────────────
async function saveEdit() {
  const id = document.getElementById('edit-id').value
  const title = document.getElementById('edit-title').value.trim()
  const description = document.getElementById('edit-desc').value.trim()
  const msg = document.getElementById('edit-msg')
 
  try {
    const res = await fetch(`${API}/api/quiz/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, description }),
    })
    const data = await res.json()
    if (res.ok) {
      msg.style.color = '#4ade80'
      msg.textContent = '✅ Quiz updated!'
      loadAdminQuizList()
      setTimeout(closeModal, 1000)
    } else {
      msg.style.color = '#ef4444'
      msg.textContent = data.error || 'Failed to update.'
    }
  } catch (err) {
    msg.style.color = '#ef4444'
    msg.textContent = 'Error updating quiz.'
  }
}
 
// ── ADMIN: Delete Quiz ────────────────────────────────────────────────────────
async function deleteQuiz(id, title) {
  if (!confirm(`Are you sure you want to delete "${title}"?`)) return
 
  try {
    const res = await fetch(`${API}/api/quiz/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    const data = await res.json()
    if (res.ok) {
      alert('✅ Quiz deleted successfully!')
      loadAdminQuizList()
    } else {
      alert(data.error || 'Failed to delete quiz.')
    }
  } catch (err) {
    alert('Error deleting quiz.')
  }
}
 
// ── Init ──────────────────────────────────────────────────────────────────────
checkSession()