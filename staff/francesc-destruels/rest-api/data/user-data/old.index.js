const fs = require('fs').promises
const path = require('path')
const uuid = require('uuid/v4')
const validate = require('../../common/validate')

const userData = {
    __file__: path.join(__dirname, 'users.json'),

    async __load__() {
        const data = await fs.readFile(this.__file__, 'utf8')
        return await JSON.parse(data)
    },

    __save__(users) {
        return fs.writeFile(this.__file__, JSON.stringify(users))
    },


    create(user) {
        validate.arguments([
            { name: 'user', value: user, type: 'object', optional: false }
        ])

        user.id = uuid()

        return (async () => {
            let users = await this.__load__()

            users.push(user)

            return this.__save__(users)
        })()
    },

    list() {
        return this.__load__()
    },

    retrieve(id) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', optional: false }
        ])

        return (async () => {
            const users = await this.__load__()

            const user = users.find(user => user.id === id)

            return user
        })()
    },

    update(id, data) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', optional: false },
            { name: 'data', value: data, type: 'object', optional: false }
        ])

        return (async () => {

            const users = await this.__load__()

            const updatedList = users.map(user => {

                if (user.id === id) {
                    const dataKey = Object.keys(data) // name

                    for (i = 0; i < dataKey.length; i++) {
                        user[dataKey[i]] = data[dataKey[i]]
                    }
                }

                return user
            })

            this.__save__(updatedList)
        })()
    },

    delete(_id) {
        validate.arguments([
            { name: 'id', value: _id, type: 'string', optional: false }
        ])

        return (async () => {
            const users = await this.__load__()

            const index = users.findIndex(user => user.id === _id)

            if (index < 0) throw new Error(`User doesn't exist`)

            this.__save__(users)
        })()
    },

    find(criteria) {
        validate.arguments([
            { name: 'criteria', value: criteria, type: 'function', notEmpty: true, optional: false }
        ])

        return ( async () => {
            const users = await this.__load__()

            return users.filter(criteria)
        })()
    }
}

module.exports = userData