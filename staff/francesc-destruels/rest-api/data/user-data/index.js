const fs = require('fs').promises
const path = require('path')
const uuid = require('uuid/v4')
const validate = require('../../common/validate')

const userData = {
    __file__: path.join(__dirname, 'users.json'),

    create(user) {
        validate.arguments([
            { name: 'user', value: user, type: 'object', optional: false }
        ])

        user.id = uuid()

        return fs.readFile(this.__file__, 'utf8')
            .then(content => {
                const users = JSON.parse(content)

                users.push(user)

                const json = JSON.stringify(users)

                return fs.writeFile(this.__file__, json)
            })
    },

    list() {
        return fs.readFile(this.__file__, 'utf8')
            .then(JSON.parse)
    },

    retrieve(id) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', optional: false }
        ])

        return fs.readFile(this.__file__, 'utf8')
            .then(content => {
                const users = JSON.parse(content)

                const user = users.find(user => user.id === id)
                
                return user
            })
    },

    update(id, data) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', optional: false },
            { name: 'data', value: data, type: 'object', optional: false }
        ])

        return fs.readFile(this.__file__, 'utf8')
            .then(content => {
                const users = JSON.parse(content)

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

                const json = JSON.stringify(updatedList)

                return fs.writeFile(this.__file__, json)
            })

    },

    delete(_id) {
        validate.arguments([
            { name: 'id', value: _id, type: 'string', optional: false }
        ])

        return fs.readFile(this.__file__, 'utf8')
            .then(content => {
                const users = JSON.parse(content)

                const index = users.findIndex(user => user.id === _id)

                if (index < 0) throw new Error(`User doesn't exist`)

                const json = JSON.stringify(users.splice(index))

                return fs.writeFile(this.__file__, json)
            })
    },

    find(data) {
        validate.arguments([
            { name: 'data', value: data, type: 'object', optional: false }
        ])

        return fs.readFile(this.__file__, 'utf8')
            .then(content => {
                const users = JSON.parse(content)

                const matchingList = users.filter(user => {
                    const dataKey = Object.keys(data)
                    if (user[dataKey[0]] === data[dataKey[0]]) return user
                    }
                )

                if (matchingList) return matchingList

            })
    },
}

module.exports = userData