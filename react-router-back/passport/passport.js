const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../routes/users/models/Users')


const localLogin = new LocalStrategy({ usermameField: "username" }, async function (
    username,
    password,
    done
) {
    try {
        const user = await User.findOne({ username })
        if (!user) return done(null, false);
        const passMatch = await bcrypt.compare(password, user.password)
        if (passMatch) return done(null, user)
        done(null, false)
    }
    catch (error) {
        done(error)
    }
});

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization-x-token"),
    secretOrKey: "birds"

};

let jwtLogin = new JwtStrategy(jwtOptions, async function (payload, done) {
    try {
        const user = findById(payload.sub);
        if (user) {
            done(null, user)
        }
        done(null, false)

    } catch (error) {
        console.log(`${error} : - >> from passport`);
        done(error, false)
    }
})

passport.use(jwtLogin)
passport.use(localLogin)

module.exports = strategy => {
    return passport.authenticate(strategy, { session: false })
}