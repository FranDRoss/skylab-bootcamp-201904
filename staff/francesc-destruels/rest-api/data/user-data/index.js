const fs = require('fs').promises
const path = require('path')
const uuid = require('uuid/v4')
const validate = require('../../common/validate')

const userData = {
    __file__: path.join(__dirname, 'users.json'),

    __load__() {
        return fs.readFile(this.__file__, 'utf8')
            .then(JSON.parse)
    },

    __save__(users) {
        return fs.writeFile(this.__file__, JSON.stringify(users))
    },


    create(user) {
        validate.arguments([
            { name: 'user', value: user, type: 'object', optional: false }
        ])

        user.id = uuid()

        return this.__load__()
            .then(users => {
                users.push(user)
                
                return this.__save__(users)
            })
    },

    list() {
        return this.__load__()
    },

    retrieve(id) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', optional: false }
        ])

        return this.__load__()
            .then(users => {
                const user = users.find(user => user.id === id)

                return user
            })
    },

    update(id, data) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', optional: false },
            { name: 'data', value: data, type: 'object', optional: false }
        ])

        return this.__load__()
            .then(users => {

                const updatedList = users.map(user => {

                    // if (user.id === id) { QUE GANAS DE COMPLICARSE LA VIDA!
                    //     const userKey = Object.keys(user) // id, name, surname, email, password
                    //     const dataKey = Object.keys(data) // name

                    //     for (i = 0; i < dataKey.length; i++) {
                    //         for (j = 0; j <= userKey.length; j++) {
                    //             if (userKey[j] === dataKey[i] || j === userKey.length) user[dataKey[i]] = data[dataKey[i]]
                    //         }
                    //     }
                    // }

                    if (user.id === id) {
                        const dataKey = Object.keys(data) // name

                        for (i = 0; i < dataKey.length; i++) {
                            user[dataKey[i]] = data[dataKey[i]]
                        }
                    }

                    return user
                })

                this.__save__(updatedList)
            })

    },

    delete(_id) {
        validate.arguments([
            { name: 'id', value: _id, type: 'string', optional: false }
        ])

        return this.__load__()
            .then(users => {
                const index = users.findIndex(user => user.id === _id)

                if (index < 0) throw new Error(`User doesn't exist`)

                this.__save__(users)
            })
    },

    find(criteria) {
        validate.arguments([
            { name: 'criteria', value: criteria, type: 'function', notEmpty: true, optional: false }
        ])

        return this.__load__()
            .then(users => users.filter(criteria))
    },
}

module.exports = userData