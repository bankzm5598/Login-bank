const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))

const USERS_FILE = path.join(__dirname, 'users.json')

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '[]')
  }
  return JSON.parse(fs.readFileSync(USERS_FILE))
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'))
})

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'))
})

app.post('/login', (req, res) => {
  const { username, password } = req.body
  const users = loadUsers()
  const user = users.find(u => u.username === username && u.password === password)
  if (user) {
    res.send(\`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Logged In</title>
        <style>
          body {
            font-family: sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background-color: #f0f8ff;
          }
          img {
            width: 200px;
            border-radius: 15px;
          }
          h2 {
            color: #007bff;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <img src="/images/love.jpg" alt="Love Image">
        <h2>Bank Huk tia der 💙</h2>
      </body>
      </html>
    \`)
  } else {
    res.send(\`
      <h2 style="color: red; text-align: center;">Invalid username or password</h2>
      <p style="text-align: center;"><a href="/">กลับไปหน้า Login</a></p>
    \`)
  }
})

app.post('/register', (req, res) => {
  const { username, password } = req.body
  const users = loadUsers()
  if (users.find(u => u.username === username)) {
    res.send(\`
      <html>
      <head>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: sans-serif;
            background-color: #f5f5f5;
          }
          .box {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h2 style="color: red;">⚠️ Username นี้มีอยู่แล้ว</h2>
          <a href="/register">กลับไป</a>
        </div>
      </body>
      </html>
    \`)
    return
  }
  users.push({ username, password })
  saveUsers(users)
  res.redirect('/success.html')
})

app.listen(PORT, () => {
  console.log(\`✅ Server running at http://localhost:\${PORT}\`)
})
