function errorHandler(err, req, res, next) {
    console.log(err);
    const status = err.status || 500
    const message = err.message || "Internal Server Error"
    if(err.name === 'MongoError' && err.code === 11000) {
        res.status(400).json({
            msg: 'Email is already registered'
        })
    } else if(err.name === "ValidationError") {
        const errors = []
        for(key in err.errors) {
            errors.push(err.errors[key].message)
        }
        res.status(400).json({
            message: "Validation Error",
            errors
        })
    } else if(err.message.name === 'JsonWebTokenError') {
        res.status(status).json({ message: err.message.message })
    } 
    
    else {
        res.status(status).json({ message })
    }
}

module.exports = errorHandler