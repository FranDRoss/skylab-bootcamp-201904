const validate = require('../common/validate')
const userData = require('../data/user-data')
const duckApi = require('../data/duck-api')
const { LogicError } = require('../common/errors')

const logic = {
    registerUser(name, surname, email, password) {
        validate.arguments([
            { name: 'name', value: name, type: 'string', notEmpty: true },
            { name: 'surname', value: surname, type: 'string', notEmpty: true },
            { name: 'email', value: email, type: 'string', notEmpty: true },
            { name: 'password', value: password, type: 'string', notEmpty: true }
        ])

        validate.email(email)

        return userData.find(({ email:_email}) => ( _email === email))
            .then(results => {
                if (!results[0]) return userData.create({ name, surname, email, password })
                else throw new LogicError(`User with ${email} already exist`)
            })

    },

    authenticateUser(_email, _password) {
        validate.arguments([
            { name: 'email', value: _email, type: 'string', notEmpty: true },
            { name: 'password', value: _password, type: 'string', notEmpty: true }
        ])

        validate.email(_email)

        return userData.find(({ email, password }) => (email === _email && password === _password))
            .then(user => {
                if (user[0]) {

                    return user[0].id
                } else throw new LogicError(`user with username \"${_email}\" does not exist`)
            })
    },

    retrieveUser(id) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true },
        ])

        return userData.retrieve(id)
            .then(response => {
                if (response.id === id) {
                    const { name, surname, email, id } = response

                    return { name, surname, email, id }
                } else throw new LogicError("No User for that id")
            })
    },

    searchDucks(id, query) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true },
            { name: 'query', value: query, type: 'string' }
        ])

        return userData.retrieve(id)
            .then(response => {
                if (response.id === id) {
                    return duckApi.searchDucks(query)
                        .then(ducks => ducks instanceof Array ? ducks : [])
                } else throw new LogicError(response.error)
            })
    },

    retrieveDuck(_id, id) {
        validate.arguments([
            { name: '_id', value: _id, type: 'string', notEmpty: true },
            { name: 'id', value: id, type: 'string', notEmpty: true }
        ])

        return userData.retrieve(_id)
            .then(response => {
                if (response.id === _id) {
                    return duckApi.retrieveDuck(id)
                } else throw new LogicError(response.error)
            })
    },

    toggleFavDuck(user, id) {
        validate.arguments([
            { name: 'user', value: user, type: 'string', notEmpty: true },
            { name: 'id', value: id, type: 'string', notEmpty: true }
        ])

        return userData.retrieve(user)
            .then(response => {
                if (response.id === user) {
                    const { favs = [] } = response

                    const index = favs.indexOf(id)

                    if (index < 0) favs.push(id)
                    else favs.splice(index, 1)

                    return userData.update(user, { favs })
                        .then(() => { })
                }

                throw new LogicError(response.error)
            })
    },

    retrieveFavDucks(id) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true }
        ])

        return userData.retrieve(id)
            .then(response => {
                if (response.id === id) {
                    const { favs = [] } = response

                    if (favs.length) {
                        const calls = favs.map(fav => duckApi.retrieveDuck(fav))

                        return Promise.all(calls)
                    } else return favs
                }

                throw new LogicError(response.error)
            })
    }
}

module.exports = logic