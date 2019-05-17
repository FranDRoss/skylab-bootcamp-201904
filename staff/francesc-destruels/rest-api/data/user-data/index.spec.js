const userData = require('.')
const fs = require('fs').promises
const path = require('path')

userData.__file__ = path.join(__dirname, 'users.test.json')

fdescribe('user data', () => {
    const users = [
        {
            id: "123",
            name: "Pepito",
            surname: "Grillo",
            email: "pepitogrillo@mail.com",
            password: "123"
        },
        {
            id: "456",
            name: "John",
            surname: "Doe",
            email: "johndoe@mail.com",
            password: "123"
        },
        {
            id: "789",
            name: "Pepito",
            surname: "Palotes",
            email: "pepitopalotes@mail.com",
            password: "123"
        },
    ]

    describe('create', () => {
        beforeEach(() => fs.writeFile(userData.__file__, '[]'))

        it('should succeed on correct data', () => {
            const user = {
                name: 'Manuel',
                surname: 'Barzi',
                email: 'manuelbarzi@gmail.com',
                password: '123'
            }

            return userData.create(user)
                .then(() => {
                    expect(typeof user.id).toBe('string')

                    return fs.readFile(userData.__file__, 'utf8')
                })
                .then(content => {
                    expect(content).toBeDefined()

                    const users = JSON.parse(content)

                    expect(users).toHaveLength(1)

                    const [_user] = users

                    // expect(_user).toMatchObject(user) 
                    expect(_user).toEqual(user)
                })
        })
    })

    describe('list', () => {
        beforeEach(() => fs.writeFile(userData.__file__, JSON.stringify(users)))

        it('should succeed and return items if users exist', () => {
            userData.list()
                .then(_users => {
                    expect(_users).toHaveLength(users.length)

                    // expect(_users).toMatchObject(users)
                    expect(_users).toEqual(users)
                })
        })
    })

    describe('retrieve', () => {
        beforeEach(() => fs.writeFile(userData.__file__, JSON.stringify(users)))

        it('should succeed on an already existing user', () => {
            return userData.retrieve(users[0].id)
                .then(user => {
                    expect(user).toEqual(users[0])
                })
        })
    })

    describe('update', () => {
        beforeEach(() => fs.writeFile(userData.__file__, JSON.stringify(users)))
        let name = "Pepita"
        let gender = "Trans"

        it('should succeed on updating and existing user', () => {
            return userData.update(users[0].id, { name: name })
                .then(() => {
                    return userData.retrieve(users[0].id)
                        .then(user => {
                            expect(user.name).toEqual(name)
                        })
                })
        })

        it('should succeed on updating and existing user and adding new data', () => {
            return userData.update(users[0].id, { name: name, gender: gender })
                .then(() => {
                    return userData.retrieve(users[0].id)
                        .then(user => {
                            expect(user.name).toEqual(name)
                            expect(user.gender).toEqual(gender)
                        })
                })
        })
    })

    describe('delete', () => {
        beforeEach(() => fs.writeFile(userData.__file__, JSON.stringify(users)))

        it('should succeed on deleting an already existing user', () => {
            return userData.delete(users[0].id)
                .then(() => {
                    return userData.retrieve(users[0].id)
                        .then(response =>  expect(response).toBeUndefined)
                })
        })
    })

    describe('find', () => {
        beforeEach(() => fs.writeFile(userData.__file__, JSON.stringify(users)))
       
        const criteria = (({ name }) => (name.includes('P')))
        const criteria2 = (({ email, password }) => (email === "pepitopalotes@mail.com" && password === "123"))

        it('should succeed on matching existing users', () => {
            return userData.find(criteria)
            .then(_users => {
                expect(_users).toBeDefined
                expect(_users[0].name).toEqual(_users[1].name)
            })
        })
        
        it('should succeed on matching existing user', () => {
            return userData.find(criteria2)
            .then( _users => {
                expect(_users).toBeDefined
                expect(_users[0].id).toEqual(users[2].id)
            })
        })

    })

    afterAll(() => fs.writeFile(userData.__file__, '[]'))
})