const router = require('express').Router()
const user = require('./user')
const posts = require('./posts')
const comments = require('./comments')
const authentication = require('../middlewares/auth')

router.use('/user', user)

router.use('/', authentication)
router.use('/posts', posts)
router.use('/comments', comments)

module.exports = router