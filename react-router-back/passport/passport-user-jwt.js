const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../routes/users/models/Users')
const key = process.env.SECRET_KEY
const jwtOptions = {}

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = key;

const userJWTLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
    const username = payload.username
    try {
        if (username) {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false)
            } else {
                return done(null, user)
            }
        }
    } catch (error) {
        return done(error, false)
    }
})

module.exports = userJWTLogin