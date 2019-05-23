const validate = require('../common/validate')
const userData = require('../data/user-data')
const duckApi = require('../data/duck-api')
const { LogicError } = require('../common/errors')
const { ObjectId } = require('mongodb')

const logic = {
    registerUser(name, surname, email, password) {
        validate.arguments([
            { name: 'name', value: name, type: 'string', notEmpty: true },
            { name: 'surname', value: surname, type: 'string', notEmpty: true },
            { name: 'email', value: email, type: 'string', notEmpty: true },
            { name: 'password', value: password, type: 'string', notEmpty: true }
        ])

        validate.email(email)

        return (async () => {
            const results = await userData.find({ email }, true)

            if (!results) return userData.create({ name, surname, email, password })
            else throw new LogicError(`User with ${email} already exist`)
        })()
    },

    authenticateUser(email, password) {
        validate.arguments([
            { name: 'email', value: email, type: 'string', notEmpty: true },
            { name: 'password', value: password, type: 'string', notEmpty: true }
        ])

        validate.email(email)

        return (async () => {
            const user = await userData.find({ email, password }, true)

            if (user) {
                const { _id: id } = user
                return id.toString()

            } else throw new LogicError(`user with username \"${email}\" does not exist`)
        })()
    },

    retrieveUser(_id) {
        validate.arguments([
            { name: '_id', value: _id, type: 'string', notEmpty: true },
        ])

        return (async () => {

            const response = await userData.retrieve(ObjectId(`${_id}`))

            if (response._id.toString() === _id) {
                const { name, surname, email } = response

                const user = { name, surname, email }

                return user
            } else throw new LogicError("No User for that id")

        })()
    },

    searchDucks(_id, query) {
        validate.arguments([
            { name: '_id', value: _id, type: 'string', notEmpty: true },
            { name: 'query', value: query, type: 'string' }
        ])

        return (async () => {
            const response = await userData.retrieve(ObjectId(`${_id}`))
            if (response._id.toString() === _id) {
                const ducks = await duckApi.searchDucks(query)
                return ducks instanceof Array ? ducks : []

            } else throw new LogicError(response.error)
        })()
    },

    retrieveDuck(_id, id) {
        validate.arguments([
            { name: '_id', value: _id, type: 'string', notEmpty: true },
            { name: 'id', value: id, type: 'string', notEmpty: true }
        ])

        return (async () => {
            const response = await userData.retrieve(ObjectId(`${_id}`))
            if (response.id === _id) {
                return await duckApi.retrieveDuck(id)
            } else throw new LogicError(response.error)
        })()
    },

    toggleFavDuck(user, id) {
        validate.arguments([
            { name: 'user', value: user, type: 'string', notEmpty: true },
            { name: 'id', value: id, type: 'string', notEmpty: true }
        ])

        return (async () => {
            const response = await userData.retrieve(ObjectId(`${user}`))

            if (response._id.toString() === user) {
                const { favs = [] } = response

                const index = favs.indexOf(id)

                if (index < 0) favs.push(id)
                else favs.splice(index, 1)

                return await userData.update( ObjectId(`${user}`), { favs })
            }

            throw new LogicError(response.error)
        })()
    },

    retrieveFavDucks(_id) {
        validate.arguments([
            { name: '_id', value: _id, type: 'string', notEmpty: true },
        ])

        return (async () => {
            const response = await userData.retrieve(ObjectId(`${_id}`))

            if (response._id.toString() === _id) {
                const { favs = [] } = response

                if (favs.length) {
                    const calls = favs.map(fav => duckApi.retrieveDuck(fav))

                    return await Promise.all(calls)
                } else return favs
            }

            throw new LogicError(response.error)
        })()
    },

    addCart(id_, product) {
        validate.arguments([
            { name: 'id_', value: id_, type: 'string', notEmpty: true },
            { name: 'product', value: product, type: 'object', notEmpty: true }
        ])

        return (async () => {
            const response = await userData.retrieve(ObjectId(`${id_}`))

            if (response._id.toString() === id_) {

                let { cart = [] } = response

                if (cart.length === 0) {
                    cart.push(product)

                    return await userData.update(ObjectId(`${id_}`), { cart })

                } else {
                    let done = false
                    let changes = cart.map(thing => {
                        if (thing[0] === product[0]) {
                            thing[1] = thing[1] + product[1]

                            done = true
                            return thing
                        } else return thing
                    })

                    if (!done) changes.push(product)

                    return await userData.update(ObjectId(`${id_}`), { cart: changes })
                }

            } else throw new LogicError(response.error)
        })()
    },

    retrieveCart(_id) {
        validate.arguments([
            { name: '_id', value: _id, type: 'string', notEmpty: true },
        ])

        return (async () => {
            const response = await userData.retrieve(ObjectId(`${_id}`))

            if (response._id.toString() === _id) {
                const { cart = [] } = response

                if (cart.length) {
                    const calls = cart.map(([thing]) => duckApi.retrieveDuck(thing))
                    const list = await Promise.all(calls)

                    for (let i = 0; i < list.length; i++) {
                        list[i].howMany = cart[i][1]
                    }

                    return list

                } else return cart
            }

            throw new LogicError(response.error)
        })()
    },

    // checkout(_id) {
    //     validate.arguments([
    //         { name: '_id', value: _id, type: 'string', notEmpty: true },
    //     ])

    //     return (async () => {
    //         const response = await userData.retrieve(ObjectId(`${_id}`))
    //         if (response._id.toString() === id) {
    //             const { cart = [], checkout = [] } = response

    //             if (cart.length) {

    //                 let newId = JSON.stringify(new Date()) // el ID es la fecha de compra!

    //                 checkout.push({ id: newId, productList: cart })

    //                 return await userData.update(id, { cart: [], checkout })
    //             }

    //         } else throw new LogicError("Cart is empty")
    //     })()
    // },

    // retrieveCheckoutList(id) {
    //     validate.arguments([
    //         { name: 'id', value: id, type: 'string', notEmpty: true },
    //     ])

    //     return userData.retrieve(id)
    //         .then(response => {
    //             if (response.id === id) {
    //                 const { checkout = [] } = response


    //             }

    //             throw new LogicError(response.error)
    //         })



    // },
}

module.exports = logic