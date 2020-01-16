'use strict'
const User = require('../models/User')
const comparePassword = require('../helpers/bcrypt').comparePassword
const generateToken = require('../helpers/jwt').generateToken

class UserController {
    static register(req, res, next) {
        console.log('masuk')
        let objUser = {
            email: req.body.email,
            password: req.body.password
        }
        User.create(objUser)
            .then(result => {
                res.status(201).json(result)
            })
            .catch(next)
    }

    static login(req, res, next) {
        User.findOne(
            {
                email: req.body.email
            }
        )
            .then(user => {
                if(user && comparePassword(req.body.password, user.password)) {
                    let payload = {
                        id: user._id,
                        email: user.email
                    }
                    let token = generateToken(payload)
                    res.status(200).json({ token })
                } else {
                    next({ status: 400, message: "wrong password" })
                }
            })
            .catch(next)
    }
}

module.exports = UserController