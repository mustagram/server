const verifyToken = require('../helpers/tokenMaker').decodeToken
const User = require('../models/User')

function authentication(req, res, next) {
    try {
        let decodedToken = verifyToken(req.headers.token)
        User.findById(decodedToken.id)
            .then(user => {
                if(user) {
                    let temp = {id:user.id, email: user.email,}
                    req.loggedUser = temp
                    next()
                } else {
                    next({ status: 401, message: 'Authentication failed' })
                }
            })
            .catch(next)
    }
    catch(err) {
        next({ status: 401, message: err })
    }
}


module.exports = {
    authentication
}