const mongoose = require('mongoose')
const moment = require('moment')
const now = moment();
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
        required: 'Email is required'
    },
    username: {
        type: String,
        required: 'Username is required'
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: 'Password is required'
    },
    userCreated: {
        type: String,
        default: now.format('dddd, MMMM Do YYYY, h:mm:ss a')
    },
    id: {
        type: String
    }
})

UserSchema.methods.generateToken = function () {
    const token = jwt.sign({ sub: this._id }, process.env.SECRET_KEY, {
        expiresIn: 3600
    });
    return token;
}


module.exports = mongoose.model('User', UserSchema);

