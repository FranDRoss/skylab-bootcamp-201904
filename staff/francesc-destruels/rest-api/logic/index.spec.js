const logic = require('.')
const { LogicError, RequirementError, ValueError, FormatError } = require('../common/errors')
const userData = require('../data/user-data')
const duckApi = require('../data/duck-api')
const fs = require('fs').promises

require('../common/utils/array-random.polyfill')
const { MongoClient, ObjectId } = require('mongodb')

const url = 'mongodb://localhost/rest-api-test'


describe('logic', () => {
    let client, users

    beforeAll(async () => {
        client = await MongoClient.connect(url, { useNewUrlParser: true })

        const db = client.db()

        users = db.collection('users')

        userData.__col__ = users
    })

    const names = ['Pepito', 'Fulanito', 'Menganito']

    let users_

    beforeEach(async () => {

        await users.deleteMany()

        return users_ = new Array(Math.random(100)).fill().map(() => ({
            name: `${names.random()}-${Math.random()}`,
            surname: `Grillo-${Math.random()}`,
            email: `grillo-${Math.random()}@mail.com`,
            password: `123-${Math.random()}`
        }))

    })

    describe('users', () => {
        const name = 'Manuel', surname = 'Barzi', email = 'manuelbarzi@gmail.com', password = '123'

        describe('register user', () => {

            it('should succeed on correct user data', async () => {
                const response = await logic.registerUser(name, surname, email, password)
                expect(response).toBeUndefined()
            })

            it('should fail on retrying to register', async () => {
                await userData.create({ name, surname, email, password })
                await logic.registerUser(name, surname, email, password)
                    .catch(error => {
                        expect(error).toBeDefined()
                        expect(error instanceof LogicError).toBeTruthy()

                        expect(error.message).toBe(`User with ${email} already exist`)
                    })
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

            beforeEach(async () => {
                elEmail = email
                await userData.create({ name, surname, email, password })
                const response = await users.findOne(({ email, password }))
                id = response._id.toString()
            })

            it('should succeed on correct user credential', async () => {

                const _id_ = await logic.authenticateUser(elEmail, password)
                expect(typeof _id_).toBe('string')
                expect(_id_.length).toBeGreaterThan(0)

                expect(_id_).toBe(id)
            })

            it('should fail on non-existing user', async () => {
                let fakeEmail = 'unexisting-user@mail.com'

                await logic.authenticateUser(fakeEmail, password)
                    .catch(error => {
                        expect(error).toBeDefined()
                        expect(error instanceof LogicError).toBeTruthy()

                        expect(error.message).toBe(`user with username \"${fakeEmail}\" does not exist`)
                    })

            })

        })

        describe('retrieve user', () => {
            let toCheck

            beforeEach(async () => {
                await userData.create({ name, surname, email, password })
                const response = await users.findOne(({ email, password }))
                toCheck = response
            })

            it('should succeed on correct user id ', async () => {
                const user = await logic.retrieveUser(toCheck._id.toString())

                expect(user.id).toBe(toCheck._id.toString())
                expect(user.name).toBe(toCheck.name)
                expect(user.surname).toBe(toCheck.surname)
                expect(user.email).toBe(toCheck.email)
                expect(user.password).toBeUndefined()

            })
        })

        describe('toggle fav duck', () => {
            let id, duckId = `${Math.random()}`

            beforeEach(async () => {
                await userData.create({ name, surname, email, password })
                const response = await users.findOne(({ email, password }))
                id = response._id.toString()
            })


            it('should succeed adding fav on first time', async () => {
                const response = await logic.toggleFavDuck(id, duckId)

                expect(response).toBeUndefined()

                const response2 = await userData.retrieve(ObjectId(id))

                const { favs } = response2

                expect(favs).toBeDefined()
                expect(favs instanceof Array).toBeTruthy()
                expect(favs.length).toBe(1)
                expect(favs[0]).toBe(duckId)
            })

            it('should succeed removing fav on second time', async () => {
                await logic.toggleFavDuck(id, duckId)
                await logic.toggleFavDuck(id, duckId)
                const response = await userData.retrieve(ObjectId(id))

                const { favs } = response

                expect(favs).toBeDefined()
                expect(favs instanceof Array).toBeTruthy()
                expect(favs.length).toBe(0)
            })

            it('should fail on null duck id', () => {
                duckId = null

                expect(() => logic.toggleFavDuck(id, duckId)).toThrowError(RequirementError, 'id is not optional')
            })

            // TODO more cases
        })

        describe('retrieve fav ducks', () => {
            let id, _favs

            beforeEach(async () => {
                _favs = []

                const ducks = await duckApi.searchDucks('')
                for (let i = 0; i < 10; i++) {
                    const randomIndex = Math.floor(Math.random() * ducks.length)

                    _favs[i] = ducks.splice(randomIndex, 1)[0].id
                }

                await userData.create({ name, surname, email, password, favs: _favs })
                const response = await users.findOne(({ email, password }))
                id = response._id.toString()
            })

            it('should succeed retriving ducks from fav', async () => {
                const ducks = await logic.retrieveFavDucks(id)

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

        })

        describe('add car', () => {
            let id, product = [45654, 5], product2 = [454545, 5]

            beforeEach(async () => {

                await userData.create({ name, surname, email, password })
                const response = await users.findOne(({ email, password }))
                id = response._id.toString()
            })


            it('should succeed adding a new product to an empty cart', async () => {
                const response = await logic.addCart(id, product)
                expect(response).toBeUndefined()

                const response2 = await userData.retrieve(ObjectId(id))
                const { cart } = response2

                expect(cart).toBeDefined()
                expect(cart instanceof Array).toBeTruthy()
                expect(cart.length).toBe(1)
                expect(cart[0][0]).toBe(product[0])

            })

            it('should succeed adding a new product to the cart', async () => {
                await logic.addCart(id, product)
                const response = await logic.addCart(id, product2)
                expect(response).toBeUndefined()
                const response2 = await userData.retrieve(ObjectId(id))

                const { cart } = response2

                expect(cart).toBeDefined()
                expect(cart instanceof Array).toBeTruthy()
                expect(cart.length).toBe(2)
                expect(cart[0][0]).toBe(product[0])
                expect(cart[0][1]).toBe(product[1])
            })

            it('should succeed in incresing the amount of an already added product', async () => {
                await logic.addCart(id, product)
                const response = await logic.addCart(id, product)
                expect(response).toBeUndefined()
                const response2 = await userData.retrieve(ObjectId(id))

                const { cart } = response2

                expect(cart).toBeDefined()
                expect(cart instanceof Array).toBeTruthy()
                expect(cart.length).toBe(1)
                expect(cart[0][0]).toBe(product[0])
                expect(cart[0][1]).toBe(product[1] * 2)

            })
        })

        describe('retrive cart', () => {
            let id, product = ["5c3853aebd1bde8520e66e11", 5], product2 = ["5c3853aebd1bde8520e66e15", 5]

            beforeEach(async () => {

                await userData.create({ name, surname, email, password })
                const response = await users.findOne(({ email, password }))
                id = response._id.toString()
            })

            it('should succeed on retriving the cart', async () => {
                await userData.update(ObjectId(id), { cart: [product, product2] })
                const cart = await logic.retrieveCart(id)


                expect(cart).toBeDefined()
                expect(cart instanceof Array).toBeTruthy()
                expect(cart.length).toBe(2)
                expect(cart[0].howMany).toBe(product[1])
                expect(cart[1].howMany).toBe(product2[1])

            })
        })

        describe('checkout', () => {
            let id, product = ["5c3853aebd1bde8520e66e11", 5], product2 = ["5c3853aebd1bde8520e66e15", 5]

            beforeEach(async () => {

                await userData.create({ name, surname, email, password })
                const response = await users.findOne(({ email, password }))
                id = response._id.toString()
            })

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
        const name = 'Manuel', surname = 'Barzi', email = 'manuelbarzi@gmail.com', password = '123'
        let id

        beforeEach(async () => {

            await userData.create({ name, surname, email, password })
            const response = await users.findOne(({ email, password }))
            id = response._id.toString()
        })

        describe('search ducks', () => {
            it('should succeed on correct query', async () => {
                const ducks = await logic.searchDucks(id, 'yellow')

                expect(ducks).toBeDefined()
                expect(ducks instanceof Array).toBeTruthy()
                expect(ducks.length).toBe(13)


                // TODO other cases
            })
        })
    })

    afterAll(() => client.close(true))
})
