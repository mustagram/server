const jwt = require('jsonwebtoken')

function generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET)
}

function decodeToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = {
    generateToken, decodeToken
}