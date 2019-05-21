const logic = require('.')
const { LogicError, RequirementError, ValueError, FormatError } = require('../common/errors')
const userData = require('../data/user-data')
const duckApi = require('../data/duck-api')
const fs = require('fs').promises
const path = require('path')

userData.__file__ = path.join(__dirname, '../data/user-data/users.test.json')

describe('logic', () => {
    const name = 'Manuel'
    const surname = 'Barzi'
    let email
    const password = '123'

    beforeEach(() => email = `manuelbarzi-${Math.random()}@gmail.com`)

    describe('users', () => {

        describe('register user', () => {
            it('should succeed on correct user data', () =>
                logic.registerUser(name, surname, email, password)
                    .then(response => expect(response).toBeUndefined())
            )

            describe('on already existing user', () => {
                beforeEach(() => logic.registerUser(name, surname, email, password))

                it('should fail on retrying to register', () =>
                    logic.registerUser(name, surname, email, password)
                        .then(() => { throw Error('should not reach this point') })
                        .catch(error => {
                            expect(error).toBeDefined()
                            expect(error instanceof LogicError).toBeTruthy()

                            expect(error.message).toBe(`User with ${email} already exist`)
                        })
                )
            })

            it('should fail on undefined name', () => {
                const name = undefined

                expect(() => logic.registerUser(name, surname, email, password)).toThrowError(RequirementError, `name is not optional`)
            })

            it('should fail on null name', () => {
                const name = null

                expect(() => logic.registerUser(name, surname, email, password)).toThrowError(RequirementError, `name is not optional`)
            })

            it('should fail on empty name', () => {
                const name = ''

                expect(() => logic.registerUser(name, surname, email, password)).toThrowError(ValueError, 'name is empty')
            })

            it('should fail on blank name', () => {
                const name = ' \t    \n'

                expect(() => logic.registerUser(name, surname, email, password)).toThrowError(ValueError, 'name is empty')
            })

            it('should fail on undefined surname', () => {
                const surname = undefined

                expect(() => logic.registerUser(name, surname, email, password)).toThrowError(RequirementError, `surname is not optional`)
            })

            it('should fail on null surname', () => {
                const surname = null

                expect(() => logic.registerUser(name, surname, email, password)).toThrowError(RequirementError, `surname is not optional`)
            })

            it('should fail on empty surname', () => {
                const surname = ''

                expect(() => logic.registerUser(name, surname, email, password)).toThrowError(ValueError, 'surname is empty')
            })

            it('should fail on blank surname', () => {
                const surname = ' \t    \n'

                expect(() => logic.registerUser(name, surname, email, password)).toThrowError(ValueError, 'surname is empty')
            })

            it('should fail on undefined email', () => {
                const email = undefined

                expect(() => logic.registerUser(name, surname, email, password)).toThrowError(RequirementError, `email is not optional`)
            })

            it('should fail on null email', () => {
                const email = null

                expect(() => logic.registerUser(name, surname, email, password)).toThrowError(RequirementError, `email is not optional`)
            })

            it('should fail on empty email', () => {
                const email = ''

                expect(() => logic.registerUser(name, surname, email, password)).toThrowError(ValueError, 'email is empty')
            })

            it('should fail on blank email', () => {
                const email = ' \t    \n'

                expect(() => logic.registerUser(name, surname, email, password)).toThrowError(ValueError, 'email is empty')
            })

            it('should fail on non-email email', () => {
                const nonEmail = 'non-email'

                expect(() => logic.registerUser(name, surname, nonEmail, password)).toThrowError(FormatError, `${nonEmail} is not an e-mail`)
            })

        })

        describe('authenticate user', () => {
            let id, elEmail

            beforeEach(() => {
                elEmail = email
                return userData.create({ name, surname, email, password })
                    .then(() => userData.find(({ email: _email, password: _password }) => (_email === email && _password === password)))
                    .then(response => { id = response[0].id })
            })

            it('should succeed on correct user credential', () => {

                return logic.authenticateUser(elEmail, password)
                    .then(_id_ => {
                        expect(typeof _id_).toBe('string')
                        expect(_id_.length).toBeGreaterThan(0)

                        expect(_id_).toBe(id)
                    })
            })

            describe('authenticate user', () => {
                let fakeEmail = 'unexisting-user@mail.com'

                it('should fail on non-existing user', () => {
                    return logic.authenticateUser(fakeEmail, password)
                        .then(() => { throw Error('should not reach this point') })
                        .catch(error => {

                            expect(error).toBeDefined()
                            expect(error instanceof LogicError).toBeTruthy()

                            expect(error.message).toBe(`user with username \"${fakeEmail}\" does not exist`)
                        })

                })
            })
        })

        describe('retrieve user', () => {
            let usingUser
            const criteria = (({ email: _email, password: _password }) => (_email === email && _password === password))

            beforeEach(async () => {
                const data = await userData.create({ name, surname, email, password })
                if (!data) {
                    const response = await userData.find(criteria)
                    return usingUser = response[0]
                }

            })

            it('should succeed on correct user id ', async () => {
                const user = await logic.retrieveUser(usingUser.id)

                expect(user.id).toBe(usingUser.id)
                expect(user.name).toBe(usingUser.name)
                expect(user.surname).toBe(usingUser.surname)
                expect(user.email).toBe(usingUser.email)
                expect(user.password).toBeUndefined()

            })
        })

        describe('toggle fav duck', () => {
            let id, duckId = `${Math.random()}`

            beforeEach(async () => {
                const done = await userData.create({ name, surname, email, password })

                if (!done) {
                    const response = await userData.find(({ email: _email, password: _password }) => (_email === email && _password === password))
                    id = response[0].id
                }
            })


            it('should succeed adding fav on first time', () => {
                return logic.toggleFavDuck(id, duckId)
                    .then(response => expect(response).toBeUndefined())
                    .then(() => userData.retrieve(id))
                    .then(response => {
                        const { favs } = response

                        expect(favs).toBeDefined()
                        expect(favs instanceof Array).toBeTruthy()
                        expect(favs.length).toBe(1)
                        expect(favs[0]).toBe(duckId)
                    })
            })

            it('should succeed removing fav on second time', () => {
                return logic.toggleFavDuck(id, duckId)
                    .then(() => logic.toggleFavDuck(id, duckId))
                    .then(() => userData.retrieve(id))
                    .then(response => {
                        const { favs } = response

                        expect(favs).toBeDefined()
                        expect(favs instanceof Array).toBeTruthy()
                        expect(favs.length).toBe(0)
                    })
            })

            it('should fail on null duck id', () => {
                duckId = null

                expect(() => logic.toggleFavDuck(id, duckId)).toThrowError(RequirementError, 'id is not optional')
            })

            // TODO more cases
        })

        describe('retrieve fav ducks', () => {
            let id, _favs

            beforeEach(() => {
                _favs = []

                return duckApi.searchDucks('')
                    .then(ducks => {
                        for (let i = 0; i < 10; i++) {
                            const randomIndex = Math.floor(Math.random() * ducks.length)

                            _favs[i] = ducks.splice(randomIndex, 1)[0].id
                        }

                        return userData.create({ name, surname, email, password, favs: _favs })
                    })
                    .then(() => userData.find(({ email: _email, password: _password }) => (_email === email && _password === password)))
                    .then(response => id = response[0].id)
            })

            it('should succeed adding fav on first time', () =>
                logic.retrieveFavDucks(id)
                    .then(ducks => {
                        ducks.forEach(({ id: _id, title, imageUrl, description, price }) => {
                            const isFav = _favs.some(fav => fav === _id)

                            expect(isFav).toBeTruthy()
                            expect(typeof title).toBe('string')
                            expect(title.length).toBeGreaterThan(0)
                            expect(typeof imageUrl).toBe('string')
                            expect(imageUrl.length).toBeGreaterThan(0)
                            expect(typeof description).toBe('string')
                            expect(description.length).toBeGreaterThan(0)
                            expect(typeof price).toBe('string')
                            expect(price.length).toBeGreaterThan(0)
                        })
                    })
            )
        })

        describe('add car', () => {
            let id, product = [45654, 5], product2 = [454545, 5]

            beforeEach(() => userData.create({ name, surname, email, password })
                .then(() => userData.find(({ email: _email, password: _password }) => (_email === email && _password === password)))
                .then(response => id = response[0].id)
            )

            it('should succeed adding a new product to an empty cart', () => {
                return logic.addCart(id, product)
                    .then(response => expect(response).toBeUndefined())
                    .then(() => userData.retrieve(id))
                    .then(response => {
                        const { cart } = response

                        expect(cart).toBeDefined()
                        expect(cart instanceof Array).toBeTruthy()
                        expect(cart.length).toBe(1)
                        expect(cart[0][0]).toBe(product[0])
                    })
            })

            it('should succeed adding a new product to the cart', () => {
                return logic.addCart(id, product)
                    .then(() => logic.addCart(id, product2))
                    .then(response => expect(response).toBeUndefined())
                    .then(() => userData.retrieve(id))
                    .then(response => {
                        const { cart } = response

                        expect(cart).toBeDefined()
                        expect(cart instanceof Array).toBeTruthy()
                        expect(cart.length).toBe(2)
                        expect(cart[0][0]).toBe(product[0])
                        expect(cart[0][1]).toBe(product[1])
                    })
            })

            it('should succeed in incresing the amount of an already added product', () => {
                return logic.addCart(id, product)
                    .then(() => logic.addCart(id, product))
                    .then(response => expect(response).toBeUndefined())
                    .then(() => userData.retrieve(id))
                    .then(response => {
                        const { cart } = response

                        expect(cart).toBeDefined()
                        expect(cart instanceof Array).toBeTruthy()
                        expect(cart.length).toBe(1)
                        expect(cart[0][0]).toBe(product[0])
                        expect(cart[0][1]).toBe(product[1] * 2)
                    })
            })
        })

        describe('retrive cart', () => {
            let id, product = ["5c3853aebd1bde8520e66e11", 5], product2 = ["5c3853aebd1bde8520e66e15", 5]

            beforeEach(() => userData.create({ name, surname, email, password })
                .then(() => userData.find(({ email: _email, password: _password }) => (_email === email && _password === password)))
                .then(response => id = response[0].id)
            )

            it('should succeed on retriving the cart', () => {
                return userData.update(id, { cart: [product, product2] })
                    .then(() => logic.retrieveCart(id))
                    .then(cart => {

                        expect(cart).toBeDefined()
                        expect(cart instanceof Array).toBeTruthy()
                        expect(cart.length).toBe(2)
                        expect(cart[0].howMany).toBe(product[1])
                        expect(cart[1].howMany).toBe(product2[1])
                    })
            })
        })

        describe('checkout', () => {
            let id, product = ["5c3853aebd1bde8520e66e11", 5], product2 = ["5c3853aebd1bde8520e66e15", 5]

            beforeEach(() => userData.create({ name, surname, email, password })
                .then(() => userData.find(({ email: _email, password: _password }) => (_email === email && _password === password)))
                .then(response => id = response[0].id)
            )

            it('should succeed on adding the cart to the checkoutlist with a timestamp as an Id', () => {
                return userData.update(id, { cart: [product, product2] })
                    .then(() => logic.checkout(id))
                    .then(response => {
                        expect(response).toBeUndefined()
                        return userData.retrieve(id)
                    })
                    .then(user => {

                        expect(user).toBeDefined()

                        expect(user.checkout).toBeTruthy()
                        expect(user.checkout.length).toBe(1)
                        expect(user.checkout[0].id).toBeTruthy()
                        expect(user.checkout[0].productList).toBeTruthy()
                        expect(user.checkout[0].productList[0][0]).toBe(product[0])
                    })
            })

            it('should succeed on retriving the checkout', () => {
                return userData.update(id, { cart: [product, product2] })
                    .then(() => logic.checkout(id))
                    .then(response => {
                        expect(response).toBeUndefined()
                        return userData.retrieve(id)
                    })
                    .then(user => {

                        expect(user).toBeDefined()

                        expect(user.checkout).toBeTruthy()
                        expect(user.checkout.length).toBe(1)
                        expect(user.checkout[0].id).toBeTruthy()
                        expect(user.checkout[0].productList).toBeTruthy()
                        expect(user.checkout[0].productList[0][0]).toBe(product[0])
                    })
            })

        })

    })

    describe('ducks', () => {
        let id


        beforeEach(() =>
            userData.create({ name, surname, email, password })
                .then(() => userData.find(({ email: _email, password: _password }) => (_email === email && _password === password)))
                .then(response => id = response[0].id)
        )

        describe('search ducks', () => {
            it('should succeed on correct query', () =>
                logic.searchDucks(id, 'yellow')
                    .then(ducks => {
                        expect(ducks).toBeDefined()
                        expect(ducks instanceof Array).toBeTruthy()
                        expect(ducks.length).toBe(13)
                    })

                // TODO other cases
            )
        })
    })

    afterAll(() => fs.writeFile(userData.__file__, '[]'))
})