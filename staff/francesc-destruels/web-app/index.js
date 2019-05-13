const express = require('express')
const { injectLogic, checkLogin } = require('./middlewares')
const render = require('./components/render')
const package = require('./package.json')
const bodyParser = require('body-parser')
const session = require('express-session')

const urlencodedParser = bodyParser.urlencoded({ extended: false })

const { argv: [, , port = 8080] } = process

const app = express()

app.set('view engine', 'pug')
app.set('views', 'components')

app.use(session({
    secret: 'my super secret phrase to encrypt my session',
    resave: true,
    saveUninitialized: true
}))

app.use(express.static('public'), injectLogic)

app.get('/', checkLogin('/home'), (req, res) => {
    res.render('landing')
})

app.get('/register', checkLogin('/home'), (req, res) => {
    res.render('register')
})

app.post('/register', [checkLogin('/home'), urlencodedParser], (req, res) => {
    const { body: { name, surname, email, password }, logic } = req

    try {
        logic.registerUser(name, surname, email, password)
            .then(() => res.send(render(`<p>Ok, user correctly registered, you can now proceed to <a href="/login">login</a></p>`)))
            .catch(({ message }) => {
                res.render('register', { name, surname, email, message })
            })
    } catch ({ message }) {
        res.render('register', { name, surname, email, message })
    }
})

app.get('/login', checkLogin('/home'), (req, res) => res.render('login'))

app.post('/login', [checkLogin('/home'), urlencodedParser], (req, res) => {
    const { body: { email, password }, logic, session } = req

    try {
        logic.loginUser(email, password)
            .then(() => {
                session.token = logic.__userToken__

                res.redirect('/home')
            })
            .catch(({ message }) => res.render('login', { email, message }))
    } catch ({ message }) {
        res.render('login', { email, message })
    }
})

app.get('/home', checkLogin('/', false), (req, res) => {
    const { logic } = req

    logic.retrieveUser()
        .then(({ name }) => res.render('home', { name }))

        .catch(({ message }) => res.render('home', { message }))
})

app.get('/home/search', checkLogin('/', false), urlencodedParser, (req, res) => {
    const { query: { query }, logic, session } = req

    session.query = query

    logic.searchDucks(query)
        .then(ducks => {
            ducks = ducks.map(({ id, title, imageUrl: image, price }) => ({ url: `/home/duck/${id}`, title, image, price, id }))
            return logic.retrieveUser()
                .then(({ name, favs, cart }) => {
                    res.render('home', { name, query, ducks, favs, cart })
                })
        })
        .catch(({ message }) => res.render('home', { name, query, ducks, message }))
})

app.get('/home/favourites', checkLogin('/', false), urlencodedParser, (req, res) => {
    const { logic } = req

    logic.retrieveFavDucks()
        .then(__favs => {
            const toPaintFavs = __favs.map(({ id, title, imageUrl: image, price }) => ({ url: `/home/duck/${id}`, title, image, price, id }))

            return logic.retrieveUser()
                .then(({ name, cart }) => res.render('home', { name, toPaintFavs, cart }))
        })
        .catch(({ message }) => res.render('home', { name, message, query, ducks, toPaintFavs }))
})

app.get('/home/cart', checkLogin('/', false), urlencodedParser, (req, res) => {
    const { session: { query }, logic, session } = req

    logic.retrieveCartDucks()
        .then(__cart => {
            const toPaintCart = __cart.map(({ id, title, imageUrl: image, price }) => ({ url: `/home/duck/${id}`, title, image, price, id }))

            return logic.retrieveUser()
                .then(({ name }) => res.render('home', { name, query, toPaintCart }))
        })
        .catch(({ message }) => res.render('home', { name, query, ducks, message, toPaintCart }))
})

app.get('/home/duck/:id', checkLogin('/', false), (req, res) => {
    const { params: { id }, logic, session: { query } } = req

    logic.retrieveDuck(id)
        .then(({ title, imageUrl: image, description, price, id }) => {
            const duck = { title, image, description, price, id }

            return logic.retrieveUser()
                .then(({ name, favs, cart }) => res.render('home', { name, query, duck, favs, cart }))
        })
})

app.get('/toggleFavourite/:data', checkLogin('/', false), (req, res) => {
    const { params: { data }, logic } = req

    const [id, path, query = ""] = data.split(":")

    let url = ""

    switch (path) {
        case ("search"):
            url = `/home/search?query=${query}`
            break;
        case ("favourites"):
            url = `/home/favourites`
            break;
        case ("detail"):
            url = `/home/duck/${id}`
            break;
    }

    logic.toggleFavDuck(id)
        .then(() => {
            res.redirect(url)
        })
})

app.get('/toggleCart/:data', checkLogin('/', false), (req, res) => {
    const { params: { data }, logic } = req

    const [id, path, query = ""] = data.split(":")

    let url = ""

    switch (path) {
        case ("search"):
            url = `/home/search?query=${query}`
            break;
        case ("favourites"):
            url = `/home/favourites`
            break;
        case ("detail"):
            url = `/home/duck/${id}`
            break;
        case ("cart"):
            url = `/home/cart`
            break;
    }

    logic.toggleCartDuck(id)
        .then(() => {
            res.redirect(url)
        })
})

app.post('/logout', (req, res) => {
    req.session.destroy()

    res.redirect('/')
})

app.use(function (req, res, next) {
    res.redirect('/')
})

app.listen(port, () => console.log(`${package.name} ${package.version} up on port ${port}`))