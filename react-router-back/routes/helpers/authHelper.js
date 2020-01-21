const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function comparePassword(incomingPassword, userPassword) {
    try {
        let comparePassword = await bcrypt.compare(incomingPassword, userPassword);
        if (comparePassword) {
            return comparePassword
        } else {
            throw 409
        }
    } catch (e) {
        return e
    }
}
async function createJwtToken(user) {
    let payload;

    payload = {
        id: user._id,
        email: user.email,
        username: user.username
    };

    let jwtToken = await jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: 3600
    });
    return jwtToken;
}
module.exports = {
    comparePassword,
    createJwtToken
}