const express = require('express')
const bodyParser = require('./body-parser')
const render = require('./render')
const logic = require('./logic')

const { argv: [, , port] } = process

const app = express()

app.use(express.static('public'))

let checked = false
let nametoshow = ""

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
            <input type="text" name="name" placeholder="Name" required>
            <input type="text" name="surname" placeholder="Surname" required>
            <input type="text" name="username" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button>Register</button>
        </form>`))
})


app.post('/register', bodyParser, (req, res) => {
    const { name, surname, username, password } = req.body

    logic.registerUser(name, surname, username, password)
        .then(() => res.send(render(`<p>Ok, user correctly registered, you can now proceed to <a href="/login">login</a></p>`)))
        .catch(error => error && res.send(render(`<form method="post" action="/register">
        <input type="text" name="name" placeholder="Name" required>
        <input type="text" name="surname" placeholder="Surname" required>
        <input type="text" name="username" placeholder="Email" required>
        <input type="password" name="password" placeholder="Password" required>
        <button>Register</button>
        <p>Something happened try again</p>
    </form>`)))

})

app.get('/login', (req, res) => {
    if (checked) res.redirect('/home')
    else res.send(render(`<h1>Login</h1>
    <form method="post" action="/login">
            <input type="text" placeholder="Name" name="username">
            <input type="password" placeholder="Password" name="password">
            <button>Login</button>
        </form>`))
})

app.post('/login', bodyParser, (req, res) => {
    const { username, password } = req.body

    logic.loginUser(username, password)
        .then(() => {
            nametoshow = username
            checked = true
            res.redirect('/home')
        })
        .catch(error => error && res.send(`<h1>Login</h1>
                                            <form method="post" action="/login">
                                            <input type="text" placeholder="Name" name="username">
                                            <input type="password" placeholder="Password" name="password">
                                            <button>Login</button>
                                            <p>Wrong credentials.</p>
                                        </form>`))
})

app.get('/home', (req, res) => {
    if (checked) res.send(render(`<h1>Hola, ${nametoshow}!`))
    else res.redirect('/')
})

app.listen(port)