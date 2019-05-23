const express = require('express')
const package = require('./package.json')
const bodyParser = require('body-parser')
const userData = require('./data/user-data') // exporto la data para poder linkar mongo
const logic = require('./logic')
const cors = require('cors')
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb') // exporto mongo 

const jsonParser = bodyParser.json()

const { argv: [, , port = 8080] } = process

const app = express()

const url = 'mongodb://localhost/rest-api-test'; // url donde esta la base de datos

(async () => {
    client = await MongoClient.connect(url, { useNewUrlParser: true }) // esperamos que se levabte mongo

    const db = client.db() // sacamos la base de datos  

    users = db.collection('users')

    userData.__col__ = users

    app.use(cors())

    app.post('/user', jsonParser, (req, res) => { // ruta simple user para registrar, devuelve un Ok.
        const { body: { name, surname, email, password } } = req

        try {

            logic.registerUser(name, surname, email, password)
                .then(() => res.status(201).json({ message: 'Ok, user registered. ' }))
                .catch(({ message }) => {
                    res.status(400).json({ error: message })
                })
        } catch ({ message }) {
            res.status(400).json({ error: message })
        }
    })

    app.post('/auth', jsonParser, (req, res) => { //  Ruta auth para authnticar el user devolverá token
        const { body: { email, password } } = req

        try {
            logic.authenticateUser(email, password) // cojerá token
                .then(id => {

                    let newtoken = jwt.sign({ sub: id }, 'Ladonahemovile', { expiresIn: '2h' })
                    return res.json({ token: newtoken })
                })
                .catch(({ message }) => {
                    res.status(400).json({ error: message })
                })
        } catch ({ message }) {
            res.status(400).json({ error: message })
        }
    })

    app.get('/user', jsonParser, (req, res) => { // Un get + ruta user y ID para obtener datos de usuario
        let { headers: { authorization: token } } = req
        token = token.split(' ')[1]

        try {
            let payload = jwt.verify(token, 'Ladonahemovile')

            const { sub } = payload

            return logic.retrieveUser(sub) // cojerá token
                .then(({ name, surname, email }) => res.json({ name, surname, email }))
                .catch(({ message }) => {
                    res.status(400).json({ error: message })
                })
        } catch ({ message }) {
            res.status(400).json({ error: message })
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
        let { headers: { authorization: token }, query: { q: query } } = req
        token = token.split(' ')[1]

        try {
            let payload = jwt.verify(token, 'Ladonahemovile')

            const { sub } = payload

            return logic.searchDucks(sub, query) // cojerá token
                .then((ducks) => res.json({ ducks }))
                .catch(({ message }) => {
                    res.status(400).json({ error: message })
                })
        } catch ({ message }) {
            res.status(400).json({ error: message })
        }
    })

    app.get('/duckDetail/:id', jsonParser, (req, res) => { // Un get + ruta search
        let { headers: { authorization: token }, params: { id } } = req
        token = token.split(' ')[1]

        try {
            let payload = jwt.verify(token, 'Ladonahemovile')

            const { sub } = payload

            return logic.retrieveDuck(sub, id) // cojerá token
                .then(duck => res.json({ duck }))
                .catch(({ message }) => {
                    res.status(400).json({ error: message })
                })
        } catch ({ message }) {
            res.status(400).json({ error: message })
        }
    })

    app.post('/user/favs/:id', jsonParser, (req, res) => {
        let { headers: { authorization: token }, params: { id } } = req
        token = token.split(' ')[1]

        try {
            let payload = jwt.verify(token, 'Ladonahemovile')

            const { sub } = payload

            return logic.toggleFavDuck(sub, id)
                .then(() => res.json({ message: 'Done' }))
                .catch(({ message }) => {
                    res.status(400).json({ error: message })
                })
        } catch ({ message }) {
            res.status(400).json({ error: message })
        }
    })

    app.get('/user/favs', jsonParser, (req, res) => {
        let { headers: { authorization: token } } = req
        token = token.split(' ')[1]

        try {
            let payload = jwt.verify(token, 'Ladonahemovile')

            const { sub } = payload

            logic.retrieveFavDucks(sub)
                .then(ducks => res.json({ ducks }))
                .catch(({ message }) => {
                    res.status(400).json({ error: message })
                })
        } catch ({ message }) {
            res.status(400).json({ error: message })
        }
    })

    app.post('/user/addCart', jsonParser, (req, res) => {
        let { headers: { authorization: token }, body: { id, amount } } = req
        token = token.split(' ')[1]

        try {
            let payload = jwt.verify(token, 'Ladonahemovile')

            const { sub } = payload

            if (id && amount) {
                let product = [id, amount]

                return logic.addCart(sub, product)
                    .then(() => res.json({ message: 'Added' }))
                    .catch(({ message }) => {
                        res.status(400).json({ error: message })
                    })
            }

        } catch ({ message }) {
            res.status(400).json({ error: message })
        }
    })

    app.get('/user/cart', jsonParser, (req, res) => {
        let { headers: { authorization: token } } = req
        token = token.split(' ')[1]

        try {
            let payload = jwt.verify(token, 'Ladonahemovile')

            const { sub } = payload

            logic.retrieveCart(sub) //products es una array de objetos duck enteros con el campo howMany
                .then(products => res.json({ products }))
                .catch(({ message }) => {
                    res.status(400).json({ error: message })
                })
        } catch ({ message }) {
            res.status(400).json({ error: message })
        }
    })

    app.post('/user/cart/checkout', jsonParser, (req, res) => {
        let { headers: { authorization: token }, params: { cart } } = req
        token = token.split(' ')[1]

        try {
            let payload = jwt.verify(token, 'Ladonahemovile')

            const { sub } = payload

            return logic.toggleFavDuck(sub, id)
                .then(() => res.json({ message: 'Done' }))
                .catch(({ message }) => {
                    res.status(400).json({ error: message })
                })
        } catch ({ message }) {
            res.status(400).json({ error: message })
        }
    })

    app.use(function (req, res, next) {
        res.redirect('/')
    })

    app.listen(port, () => console.log(`${package.name} ${package.version} up on port ${port}`))

})()