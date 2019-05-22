const userData = require('.')
require('../../common/utils/array-random.polyfill')
const { MongoClient, ObjectId } = require('mongodb')

const url = 'mongodb://localhost/rest-api-test'

describe('user data', () => {
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

        users_ = new Array(Math.random(100)).fill().map(() => ({
            name: `${names.random()}-${Math.random()}`,
            surname: `Grillo-${Math.random()}`,
            email: `grillo-${Math.random()}@mail.com`,
            password: `123-${Math.random()}`
        }))

    })

    describe('create', () => {
        it('should succeed on correct data', async () => {
            const user = {
                name: 'Manuel',
                surname: 'Barzi',
                email: 'manuelbarzi@gmail.com',
                password: '123'
            }

            await userData.create(user)

            expect(user._id).toBeInstanceOf(ObjectId)

            const cursor = await users.find()

            const _users = []

            await cursor.forEach(user => _users.push(user))

            expect(_users).toHaveLength(1)

            const [_user] = _users

            expect(_user).toEqual(user)
        })
    })

    describe('list', () => {

        beforeEach(() => users.insertMany(users_))

        it('should succeed and return items if users exist', async () => {

            const _users = await userData.list()

            expect(_users).toHaveLength(users_.length)
            expect(_users).toEqual(users_)
        })
    })

    describe('retrieve', () => {
        beforeEach(() => users.insertMany(users_))

        it('should succeed on an already existing user', async () => {
            const user = users_[Math.random(users_.length - 1)]

            const _user = await userData.retrieve(user._id)

            expect(_user).toEqual(user)

        })
    })

    describe('update', () => {
        beforeEach(() => users.insertMany(users_))

        describe('replacing', () => {
            it('should succeed on correct data', async () => {
                const user = users_[Math.random(users_.length - 1)]

                const data = { name: 'n', email: 'e', password: 'p', lastAccess: Date.now() }

                await userData.update(user._id, data, true)

                const _user = await users.findOne({ _id: user._id })

                expect(_user).toBeDefined()

                expect(_user._id).toEqual(user._id)

                expect(_user).toMatchObject(data)

                expect(Object.keys(_user).length).toEqual(Object.keys(data).length + 1)

            })
        })

        describe('not replacing', () => {
            it('should succeed on correct data', async () => {
                const user = users_[Math.random(users_.length - 1)]

                const data = { name: 'n', email: 'e', password: 'p', lastAccess: Date.now() }

                await userData.update(user._id, data)

                const cursor = users.find({ _id: user._id })

                const _user = []

                await cursor.forEach(user => _user.push(user))

                expect(_user).toBeDefined()

                expect(_user[0]._id).toEqual(user._id)

                expect(_user[0]).toMatchObject(data)

                expect(Object.keys(_user[0]).length).toEqual(Object.keys(data).length + 2)
            })
        })

    })

    describe('delete', () => {
        // TODO
    })

    describe('find', () => {
        let _users

        beforeEach(async () => {
            _users = new Array(8).fill().map(() => ({
                name: `${names.random()}-${Math.random()}`,
                surname: `Grillo-${Math.random()}`,
                email: `grillo-${Math.random()}@mail.com`,
                password: `123-${Math.random()}`
            }))

            await users.insertMany(_users)
        })

        it('should succeed on matching existing users', async () => {
            // const criteria = ({ name: /f/, email: /i/ })
            const criteria = ({name, email}) => (name.includes('f') && email.includes('i'))

            const users = await userData.find(criteria)
            const __users = _users.filter(criteria)

            expect(users).toEqual(__users)

        })
    })

    afterAll(() => client.close())
})