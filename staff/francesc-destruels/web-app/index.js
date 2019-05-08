const express = require('express')
const http = require('http')
const bodyParser = require('./body-parser')

const { argv: [, , port] } = process

const app = express()

app.use(express.static('public'))

let user = {}
let checked = false

function render(body) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        ${body}
    </body>
    </html>`
}

app.get('/', (req, res) => {

    if (checked) res.redirect('/home')
    else res.send(render(`<div>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
        </div>`))
})

app.get('/register', (req, res) => {

    if (checked) res.redirect('/home')
    else res.send(render(`<form method="post" action="/register">
            <input type="text" name="username" required>
            <input type="password" name="password" required>
            <button>Register</button>
        </form>`))
})

app.post('/register', bodyParser, (req, res) => {

    const { username, password } = req.body

    user.username = username
    user.password = password


    if (username && password) res.send(render(`<p>Ok, user correctly registered, you can now proceed to <a href="/login">login</a></p>`))
    else res.send(render(`<form method="post" action="/register">
            <input type="text" name="username">
            <input type="password" name="password">
            <button>Register</button>
            <p>you have to fill both fields</p>
        </form>`))

})

app.get('/login', (req, res) => {
    if (checked) res.redirect('/home')
    else res.send(render(`<form method="post" action="/login">
            <input type="text" name="username">
            <input type="password" name="password">
            <button>Login</button>
        </form>`))
})

app.post('/login', bodyParser, (req, res) => {
    const { username, password } = req.body

    if (username === user.username && password === user.password) {
        checked = true
        res.redirect('/home')
    }
    else res.send(render(`<form method="post" action="/login">
        <input type="text" name="username">
        <input type="password" name="password">
        <button>Login</button>
        <p>Wrong credentials.</p>
        </form>`))
})

app.get('/home', (req, res) => {
    if (checked) res.send(render(`<h1>Hola, ${user.username}!`))
    else res.redirect('/')
})

app.listen(port)