const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const auth = require('../middlewares/auth')

const { registerUser, authenticateUser, retrieveUser, updateUser, removeUser
      } = require('./handlers')


const jsonBodyParser = bodyParser.json()

const router = express.Router()

router.use(cors())


router.post('/user', jsonBodyParser, registerUser)
router.post('/user/auth', jsonBodyParser, authenticateUser)
router.get('/user', auth, retrieveUser)
router.put('/user', [jsonBodyParser, auth], updateUser)
router.delete('/user', auth, removeUser)

//TODO: router para map y pin (con sus handlers)

module.exports = router