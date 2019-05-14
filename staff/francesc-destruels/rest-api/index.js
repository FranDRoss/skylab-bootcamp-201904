const express = require('express')
const package = require('./package.json')
const bodyParser = require('body-parser')
const logic = require('./logic')
const handleErrors = require('./routes/handle-errors')

const jsonParser = bodyParser.json()

const { argv: [, , port = 8080] } = process

const app = express()

app.post('/user', jsonParser, (req, res) => { // ruta simple user para registra, devuelve un Ok.
    const { body: { name, surname, email, password } } = req

    handleErrors(() =>
        logic.registerUser(name, surname, email, password)
            .then(() => res.status(201).json({ message: 'Ok, user registered. ' })),
        res)
})

app.post('/auth', jsonParser, (req, res) => { //  Ruta auth para authnticar el user devolverá token
    const { body: { email, password } } = req

    handleErrors(() =>
        logic.authenticateUser(email, password)
            .then(token => res.json({ token })),
        res)
})

app.get('/user', jsonParser, (req, res) => { // Un get + ruta user y ID para obtener datos de usuario
    let { headers: { authorization: token } } = req
    token = token.split(' ')[1]

    handleErrors(() =>
        logic.retrieveUser(token)
            .then(({ name, surname, email }) => res.json({ name, surname, email })),
        res)
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
    let { headers: { authorization: token }, query: { q: query } } = req
    token = token.split(' ')[1]

    handleErrors(() =>
        logic.searchDucks(token, query)
            .then((ducks) => res.json({ ducks })),
        res)
})

app.get('/duckDetail/:id', jsonParser, (req, res) => { // Un get + ruta search
    let { headers: { authorization: token }, params: { id } } = req
    token = token.split(' ')[1]

    handleErrors(() =>
        logic.retrieveDuck(token, id) // cojerá token
            .then(duck => res.json({ duck })),
        res)
})

app.post('/user/favs/:id', jsonParser, (req, res) => {
    let { headers: { authorization: token }, params: { id } } = req
    token = token.split(' ')[1]

    handleErrors(() =>
        logic.toggleFavDuck(token, id)
            .then(() => res.json({ message: 'Done' })),
        res)
})

app.get('/user/favs', jsonParser, (req, res) => {
    let { headers: { authorization: token }, params: { id } } = req
    token = token.split(' ')[1]

    handleErrors(() =>
        logic.retrieveFavDucks(token)
            .then(ducks => res.json({ ducks })),
        res)
})

app.use(function (req, res, next) {
    res.redirect('/')
})

app.listen(port, () => console.log(`${package.name} ${package.version} up on port ${port}`))