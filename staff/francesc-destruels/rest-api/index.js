const express = require('express')
const package = require('./package.json')
const bodyParser = require('body-parser')
const logic = require('./logic')

const jsonParser = bodyParser.json()

const { argv: [, , port = 8080] } = process

const app = express()

app.post('/user', jsonParser, (req, res) => { // ruta simple user para registra, devuelve un Ok.
    const { body: { name, surname, email, password } } = req
    
    try {
        logic.registerUser(name, surname, email, password)
            .then(() => res.json({ token }))
            .catch(({ message }) => {
                res.status(400).json({ error: message})
            })
    } catch ({ message }) {
        res.status(400).json({ error: message})
    }
})

app.post('/auth', jsonParser, (req, res) => { //  Ruta auth para authnticar el user devolverá token
    const { body: { email, password } } = req
    
    try {
        logic.authenticateUser(email, password) // cojerá token
            .then(token => res.json({ token }))
            .catch(({ message }) => {
                res.status(400).json({ error: message})
            })
    } catch ({ message }) {
        res.status(400).json({ error: message})
    }
})

app.get('/user', jsonParser, (req, res) => { // Un get + ruta user y ID para obtener datos de usuario
    let { headers: { authorization: token } } = req
    token = token.split(' ')[1]
    
    try {
        logic.retrieveUser(token) // cojerá token
            .then(({ name, surname, email }) => res.json({ name, surname, email }))
            .catch(({ message }) => {
                res.status(400).json({ error: message})
            })
    } catch ({ message }) {
        res.status(400).json({ error: message})
    }
})

// app.put('/user', jsonParser, (req, res) => { Necesita el token más el objeto para actualizar.
//     const { body: { token, updatedInfo } } = req
    
//     try {
//         logic.updateUser(token, updatedInfo) // cojerá token
//             .then(() => res.json({ message: 'Ok, user registered. '}))
//             .catch(({ message }) => {
//                 res.status(400).json({ error: message})
//             })
//     } catch ({ message }) {
//         res.status(400).json({ error: message})
//     }
// })

app.get('/duckSearch', jsonParser, (req, res) => { // Un get + ruta search
    let { headers: { authorization: token }, query: { q:query } } = req
    token = token.split(' ')[1]
    
    try {
        logic.searchDucks(token, query) // cojerá token
            .then((ducks) => res.json({ ducks }))
            .catch(({ message }) => {
                res.status(400).json({ error: message})
            })
    } catch ({ message }) {
        res.status(400).json({ error: message})
    }
})

app.get('/duckDetail/:id', jsonParser, (req, res) => { // Un get + ruta search
    let { headers: { authorization: token }, params: { id }} = req
    token = token.split(' ')[1]
    
    try {
        logic.retrieveDuck(token, id) // cojerá token
            .then(duck => res.json({ duck }))
            .catch(({ message }) => {
                res.status(400).json({ error: message})
            })
    } catch ({ message }) {
        res.status(400).json({ error: message})
    }
})

app.post('/user/favs/:id', jsonParser, (req, res) => { 
    let { headers: { authorization: token }, params: { id }} = req
    token = token.split(' ')[1]
    
    try {
        logic.toggleFavDuck(token, id)
            .then(() => res.json({ message: 'Done'}))
            .catch(({ message }) => {
                res.status(400).json({ error: message})
            })
    } catch ({ message }) {
        res.status(400).json({ error: message})
    }
})

app.get('/user/favs', jsonParser, (req, res) => { 
    let { headers: { authorization: token }, params: { id }} = req
    token = token.split(' ')[1]
    
    try {
        logic.retrieveFavDucks(token)
            .then(ducks => res.json({ ducks }))
            .catch(({ message }) => {
                res.status(400).json({ error: message})
            })
    } catch ({ message }) {
        res.status(400).json({ error: message})
    }
})

app.use(function (req, res, next) {
    res.redirect('/')
})

app.listen(port, () => console.log(`${package.name} ${package.version} up on port ${port}`))