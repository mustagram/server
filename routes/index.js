const router = require('express').Router()
const user = require('./user')
const posts = require('./posts')
const authentication = require('../middlewares/auth')

router.use('/user', user)

router.use('/', authentication)
router.use('/posts', posts)

module.exports = router