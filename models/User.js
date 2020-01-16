`use strict`
const { hashPassword } = require('../helpers/bcrypt')
const { Schema, model } = require('mongoose')

const userSchema = Schema({    
    email : {
        type : String,
        required : [true, 'you must enter your email'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'please enter a valid email'],
        validate: {
            validator : function(cek) {
                return User.findOne({
                    email : cek
                })
                .then(user => {
                    if (user) {
                        return false
                    } else {
                        return true
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            },
            message : `email already registered`
          }
    },
    password : {
        type : String,
        minlength : [6, "minimum password length is 6 characters"],
        required : [true, 'you must enter your password'],
    }   
}, {timestamps : true},{versionKey : false})


userSchema.pre('save', function(next) {
    this.password = hashPassword(this.password)
    next()
})

const User = model('User', userSchema)
module.exports = User