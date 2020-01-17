const route = require('express').Router()
const UserCon = require('../controllers/UserController')

route.post('/login',UserCon.login)
route.post('/register', UserCon.register)


module.exports = route
