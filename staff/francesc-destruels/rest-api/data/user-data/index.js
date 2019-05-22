const validate = require('../../common/validate')
const { ValueError } = require('../../common/errors')
const { MongoClient, ObjectId } = require('mongodb')

const userData = {
    __col__: null,

    create(user) {
        validate.arguments([
            { name: 'user', value: user, type: 'object', optional: false }
        ])

        return (async () => {
            await this.__col__.insertOne(user)
        })()
    },

    list() {
        return this.__col__.find().toArray()
    },

    retrieve(id) {
        validate.arguments([
            { name: 'id', value: id, type: 'object', notEmpty: true, optional: false }
        ])

        return (async () => {
            return await this.__col__.findOne(id)
        })()
    },

    find(criteria, especific) {
        validate.arguments([
            { name: 'especific', value: especific, type: 'boolean', notEmpty: true, optional: false }
        ])

        if (!especific) {
            return (async () => {
                const cursor = await this.__col__.find()

                const users = []

                await cursor.forEach(user => {
                    if (criteria(user)) return users.push(user)
                })

                return users
            })()
        } else {
            return (async () => await this.__col__.findOne(criteria))()
        }
    },

    update(id, data, replace) {
        validate.arguments([
            { name: 'id', value: id, type: 'object', notEmpty: true },
            { name: 'data', value: data, type: 'object' },
            { name: 'replace', value: replace, type: 'boolean', optional: true }
        ])

        if (data._id && id !== data.id) throw new ValueError('data id does not match criteria id')

        return (async () => {

            if (replace) {
                await this.__col__.findOneAndReplace({ _id: id }, data)
            } else
                await this.__col__.findOneAndUpdate({ _id: id }, { $set: data })
        })()
    }
}

module.exports = userData