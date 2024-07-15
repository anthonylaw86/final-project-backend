const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator(v) {
                return validator.isEmail(v)
            },
            message: "You must enter a valid email"
        },
    },
    password: {
        type: String,
        required: true,
        select: false,
    }
})

userSchema.statics.findUserByCredentials = function findUserByCredentials(
    username,
    password
) {
    return this.findOne({ username })
    .select('+password')
    .then((user) => {
        if (!user) {
            return Promise.reject(new Error('Incorrect email or password'))
        }
        return bcrypt.compare(password, user.password).then((matched) => {
            if (!matched) {
                return Promise.reject(new Error('Incorrect email or password'))
            }
            return user;
        })
    })
}

module.exports = mongoose.model('user', userSchema)